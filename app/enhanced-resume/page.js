"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Download,
  Edit3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Plus,
  Wand2,
  Settings,
  Eye,
  Save,
  X,
  FileText,
  Star,
  Zap,
  Target,
  User,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Loader2,
} from "lucide-react";
import { TextSelectionMenu } from "@/components/TextSelectionMenu";
import { allTemplates, getTemplateById } from "@/components/pdf-templates";
import dynamic from 'next/dynamic';
import { pdf } from '@react-pdf/renderer';
import * as Templates from '@/components/pdf-templates';
import { getResume, saveResumeAssets } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";
import html2canvas from 'html2canvas';

// Dynamically import PDFPreview to avoid SSR issues
const PDFPreview = dynamic(() => import('@/components/PDFPreview'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
      <div className="text-gray-500">Loading preview...</div>
    </div>
  ),
});

// Custom styles for editable fields
const customStyles = `
  .editable-field:hover .edit-icon {
    opacity: 1 !important;
  }
`;

function EnhancedResumeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(null);
  const [userName, setUserName] = useState("Advika Sharma");
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFromUpload = searchParams.get("from") === "upload";
  const isFromAI = searchParams.get("from") === "ai";
  const selectedTemplate = searchParams.get("template") || "internship-1-with-photo";
  const resumeId = searchParams.get("resumeId");

  // Get template metadata
  const currentTemplate = getTemplateById(selectedTemplate);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Handle ESC key for modal
    const handleEsc = (event) => {
      if (event.keyCode === 27 && showPreview) {
        setShowPreview(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showPreview]);

  useEffect(() => {
    // Fetch resume data from API or sessionStorage
    const fetchResumeData = async () => {
      setLoading(true);
      setError(null);

      try {
        let resumeDataFromAPI = null;

        // Try to get from sessionStorage first
        if (isFromUpload) {
          const storedData = sessionStorage.getItem('enhancedResumeData');
          if (storedData) {
            resumeDataFromAPI = JSON.parse(storedData);
          }
        } else if (isFromAI) {
          const storedData = sessionStorage.getItem('createdResumeData');
          if (storedData) {
            resumeDataFromAPI = JSON.parse(storedData);
          }
        }

        // If not in sessionStorage and we have resumeId, fetch from API
        if (!resumeDataFromAPI && resumeId) {
          const response = await getResume(resumeId);
          if (response.success) {
            resumeDataFromAPI = response.data;
          }
        }

        // If we have data from API, update the resume
        if (resumeDataFromAPI) {
          setResumeData(resumeDataFromAPI);
          if (resumeDataFromAPI.personalInfo?.name) {
            setUserName(resumeDataFromAPI.personalInfo.name);
          }
        } else {
          // Fallback: Extract from prompt if no API data
          const prompt = searchParams.get("prompt") || "";

          let extractedName = null;
          const namePatterns = [
            /I'm\s+\*\*([A-Za-z\s]+)\*\*/,
            /My name is\s+\*\*([A-Za-z\s]+)\*\*/i,
            /I am\s+\*\*([A-Za-z\s]+)\*\*/i,
            /name:\s*\*\*([A-Za-z\s]+)\*\*/i,
            /\*\*([A-Z][a-z]+\s+[A-Z][a-z]+)\*\*/,
            /Hi.*I'm\s+([A-Za-z\s]+)/i,
            /Hello.*I'm\s+([A-Za-z\s]+)/i,
          ];

          for (const pattern of namePatterns) {
            const match = prompt.match(pattern);
            if (match && match[1]) {
              extractedName = match[1].trim();
              break;
            }
          }

          const urlName = searchParams.get("name");
          if (urlName) {
            extractedName = urlName;
          }

          if (extractedName) {
            setUserName(extractedName);
          }

          const emailMatch = prompt.match(/(\w+@\w+\.\w+)/);
          const phoneMatch = prompt.match(
            /(\+?\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4})/
          );
          const locationMatch = prompt.match(
            /(from|in|at|live in|based in|located in)\s+([A-Za-z\s,]+)/i
          );

          setResumeData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              name: extractedName || prev.personalInfo.name,
              email: emailMatch ? emailMatch[1] : prev.personalInfo.email,
              phone: phoneMatch ? phoneMatch[1] : prev.personalInfo.phone,
              location: locationMatch
                ? locationMatch[2].trim()
                : prev.personalInfo.location,
            },
          }));
        }

        setLoading(false);
      } catch (err) {
        const errorMessage = handleApiError(err);
        logError('EnhancedResumePage', err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [searchParams, resumeId, isFromUpload, isFromAI]);

  // Enhanced changes for upload flow
  const enhancedChanges = [
    {
      section: "summary",
      text: "Highly skilled Senior Software Engineer with 5+ years of experience",
      type: "enhanced",
    },
    {
      section: "experience",
      text: "reducing API response time by 40%",
      type: "quantified",
    },
    {
      section: "experience",
      text: "improving team productivity by 25%",
      type: "quantified",
    },
    {
      section: "skills",
      text: "TypeScript",
      type: "added",
    },
  ];

  // Hardcoded resume data - would come from API in real app
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: userName,
      title: "Senior Software Engineer",
      email: "claude.ai@anthropic.com",
      phone: "+1 (555) 123-CLAUDE",
      location: "Delhi, India",
      photo: null,
      summary:
        "**Highly skilled Senior Software Engineer** with **5+ years of experience** developing scalable web applications using **React, Node.js, and cloud technologies**. Proven track record of leading cross-functional teams and delivering high-quality software solutions that drive business growth.",
    },
    experience: [
      {
        id: 1,
        company: "TechCorp Inc.",
        position: "Senior Software Engineer",
        duration: "2022 - Present",
        achievements: [
          "Led development of microservices architecture serving **1M+ users**, **reducing API response time by 40%**",
          "Mentored **3 junior developers** and conducted code reviews **improving team productivity by 25%**",
          "Implemented CI/CD pipelines using **Docker and AWS**, reducing deployment time from **2 hours to 15 minutes**",
        ],
      },
      {
        id: 2,
        company: "StartupXYZ",
        position: "Full Stack Developer",
        duration: "2020 - 2022",
        achievements: [
          "Built and maintained React-based dashboard used by **10,000+ daily active users**",
          "Developed REST APIs handling **100K+ requests per day** with **99.9% uptime**",
          "Collaborated with design team to implement responsive UI components improving **user satisfaction by 30%**",
        ],
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "Git",
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2020",
      },
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: "2023",
      },
    ],
    languages: [
      { id: 1, name: "English", level: "Fluent" },
      { id: 2, name: "Spanish", level: "Conversational" },
    ],
    projects: [
      {
        id: 1,
        name: "E-Commerce Platform",
        description: "Built a full-stack e-commerce platform with React and Node.js serving 50,000+ users",
        technologies: ["React", "Node.js", "MongoDB", "AWS"],
      },
      {
        id: 2,
        name: "Real-time Chat Application",
        description: "Developed a real-time messaging app using WebSockets and Redis for instant communication",
        technologies: ["Socket.io", "Redis", "Express", "React"],
      },
    ],
  });

  const aiImprovements = [
    {
      type: "enhancement",
      title: "Quantified Achievements",
      description: "Added specific metrics and numbers to demonstrate impact",
      count: 8,
    },
    {
      type: "optimization",
      title: "ATS Keywords",
      description:
        "Optimized for Applicant Tracking Systems with relevant keywords",
      count: 15,
    },
    {
      type: "improvement",
      title: "Action Verbs",
      description: "Enhanced bullet points with powerful action verbs",
      count: 12,
    },
    {
      type: "enhancement",
      title: "Professional Summary",
      description: "Crafted compelling summary highlighting key strengths",
      count: 1,
    },
  ];

  const handleEdit = (field) => {
    setIsEditing(field);
  };

  const handleSave = (field) => {
    setIsEditing(null);
    // Save logic would go here
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePhoto(base64String);
        setResumeData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photo: base64String,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photo: null,
      },
    }));
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Map template ID to component name
      const componentMap = {
        'internship-1-with-photo': 'InternshipTemplate1WithPhoto',
        'internship-2-with-photo': 'InternshipTemplate2WithPhoto',
        'internship-3-with-photo': 'InternshipTemplate3WithPhoto',
        'internship-1-without-photo': 'InternshipTemplate1WithoutPhoto',
        'internship-2-without-photo': 'InternshipTemplate2WithoutPhoto',
        'internship-3-without-photo': 'InternshipTemplate3WithoutPhoto',
        'job-1-with-photo': 'JobTemplate1WithPhoto',
        'job-2-with-photo': 'JobTemplate2WithPhoto',
        'job-3-with-photo': 'JobTemplate3WithPhoto',
        'job-1-without-photo': 'JobTemplate1WithoutPhoto',
        'job-2-without-photo': 'JobTemplate2WithoutPhoto',
        'job-3-without-photo': 'JobTemplate3WithoutPhoto',
      };

      const componentName = componentMap[selectedTemplate];
      if (!componentName) {
        throw new Error(`Template ${selectedTemplate} not found`);
      }

      const TemplateComponent = Templates[componentName];
      if (!TemplateComponent) {
        throw new Error(`Component ${componentName} not found`);
      }

      // Transform resume data to match template expectations
      const nameParts = (resumeData.personalInfo?.name || '').split(' ');
      const transformedData = {
        personalInfo: {
          ...resumeData.personalInfo,
          firstName: nameParts[0] || 'John',
          lastName: nameParts.slice(1).join(' ') || nameParts[0] || 'Doe',
          email: resumeData.personalInfo?.email || '',
          phone: resumeData.personalInfo?.phone || '',
          location: resumeData.personalInfo?.location || '',
          linkedin: resumeData.personalInfo?.linkedin || '',
          website: resumeData.personalInfo?.website || '',
          photo: resumeData.personalInfo?.photo || '',
        },
        summary: resumeData.personalInfo?.summary || resumeData.summary || '',
        experience: (resumeData.experience || []).map(exp => ({
          position: exp.position || 'Position',
          company: exp.company || 'Company',
          location: exp.location || resumeData.personalInfo?.location || '',
          startDate: exp.duration ? exp.duration.split(' - ')[0] : (exp.startDate || 'Start'),
          endDate: exp.duration ? exp.duration.split(' - ')[1] || 'Present' : (exp.endDate || 'Present'),
          responsibilities: exp.achievements || exp.responsibilities || [],
        })),
        education: (resumeData.education || []).map(edu => ({
          degree: edu.degree || 'Bachelor of Science',
          fieldOfStudy: edu.fieldOfStudy || (edu.degree ? edu.degree.replace(/Bachelor of Science in |Bachelor of /gi, '') : 'Computer Science'),
          institution: edu.school || edu.institution || 'University',
          startDate: edu.startDate || (edu.year ? (parseInt(edu.year) - 4).toString() : '2016'),
          endDate: edu.endDate || edu.year || '2020',
          gpa: edu.gpa || '',
        })),
        skills: resumeData.skills || [],
        projects: (resumeData.projects || []).map(proj => ({
          name: proj.name || 'Project',
          description: proj.description || '',
          technologies: proj.technologies || [],
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
        })),
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        achievements: resumeData.achievements || [],
      };

      // Generate PDF
      const blob = await pdf(<TemplateComponent resumeData={transformedData} />).toBlob();
      const pdfFile = new File([blob], `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`, { type: 'application/pdf' });

      // Capture screenshot
      const resumeElement = document.querySelector('.resume-preview-container') || document.body;
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const screenshotBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const screenshotFile = new File([screenshotBlob], 'screenshot.png', { type: 'image/png' });

      // Upload to backend if we have a resumeId
      if (resumeId) {
        try {
          const response = await saveResumeAssets(
            resumeId,
            pdfFile,
            screenshotFile,
            resumeData.personalInfo.name
          );

          if (response.success) {
            console.log('Resume saved successfully');
            console.log('PDF path:', response.data.gcs_pdf_path);
            console.log('Screenshot path:', response.data.gcs_screenshot_path);
          }
        } catch (apiError) {
          console.error('Error uploading to backend:', apiError);
          // Continue with download even if upload fails
        }
      }

      // Download PDF locally
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      logError('EnhancedResumePage - Download', error);
      setIsGenerating(false);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate loading time (you can adjust this or remove it if not needed)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Navigate to resume complete page
    router.push("/resume-complete");
  };

  const handleAddToSection = (sectionName) => {
    setResumeData((prev) => {
      const newData = { ...prev };

      switch (sectionName) {
        case "experience":
          const newExp = {
            id: Date.now(),
            company: "New Company",
            position: "New Position",
            duration: "2024 - Present",
            achievements: ["New achievement"],
          };
          newData.experience.push(newExp);
          break;

        case "education":
          const newEdu = {
            id: Date.now(),
            degree: "New Degree",
            school: "New School",
            year: "2024",
          };
          // Ensure education is always an array
          if (!Array.isArray(newData.education)) {
            newData.education = [newData.education];
          }
          newData.education.push(newEdu);
          break;

        case "certifications":
          const newCert = {
            id: Date.now(),
            name: "New Certification",
            issuer: "New Issuer",
            year: "2024",
          };
          newData.certifications.push(newCert);
          break;

        case "languages":
          const newLang = {
            id: Date.now(),
            name: "New Language",
            level: "Beginner",
          };
          newData.languages.push(newLang);
          break;

        case "skills":
          newData.skills.push("New Skill");
          break;

        case "projects":
          const newProject = {
            id: Date.now(),
            name: "New Project",
            description: "Project description",
            technologies: ["Technology1", "Technology2"],
          };
          newData.projects.push(newProject);
          break;
      }

      return newData;
    });
  };

  const handleRemoveFromSection = (sectionName, id) => {
    setResumeData((prev) => {
      const newData = { ...prev };

      switch (sectionName) {
        case "experience":
          newData.experience = newData.experience.filter(
            (item) => item.id !== id
          );
          break;
        case "education":
          newData.education = newData.education.filter(
            (item) => item.id !== id
          );
          break;
        case "certifications":
          newData.certifications = newData.certifications.filter(
            (item) => item.id !== id
          );
          break;
        case "languages":
          newData.languages = newData.languages.filter(
            (item) => item.id !== id
          );
          break;
        case "projects":
          newData.projects = newData.projects.filter(
            (item) => item.id !== id
          );
          break;
      }

      return newData;
    });
  };

  const handleEnhanceSection = (sectionName) => {
    // AI enhance section logic
    console.log(`Enhancing ${sectionName} with AI...`);
  };

  const handleSectionClick = (sectionName) => {
    setIsEditing(sectionName);
  };

  const handlePrev = () => {
    const template = searchParams.get("template");
    if (template) {
      router.push("/template-selection?" + searchParams.toString());
    } else {
      router.push("/loading-screen?" + searchParams.toString());
    }
  };

  const handleEnhanceText = (selectedText) => {
    console.log(`Enhancing selected text: ${selectedText}`);
    // Here you would call an API to enhance the selected text
  };

  const handleEditField = (field, value) => {
    setEditingField(field);
    setEditingValue(value);
  };

  const handleSaveEdit = () => {
    if (editingField && editingValue) {
      // Update the resume data based on the field being edited
      setResumeData((prev) => {
        const newData = { ...prev };
        const fieldParts = editingField.split(".");

        if (fieldParts.length === 2) {
          newData[fieldParts[0]][fieldParts[1]] = editingValue;
        } else if (fieldParts.length === 3) {
          newData[fieldParts[0]][fieldParts[1]][fieldParts[2]] = editingValue;
        }

        return newData;
      });
    }
    setEditingField(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  const handlePhotoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handlePhotoUpload;
    input.click();
  };

  // Function to highlight enhanced text
  const highlightEnhancements = (text, section) => {
    if (!isFromUpload) return text;

    const changes = enhancedChanges.filter(
      (change) => change.section === section
    );
    let highlightedText = text;

    changes.forEach((change) => {
      if (text.includes(change.text)) {
        highlightedText = highlightedText.replace(
          change.text,
          `<span class="bg-success/20 text-success-foreground font-medium rounded px-1">${change.text}</span>`
        );
      }
    });

    return highlightedText;
  };

  // Function to process markdown-style bold text
  const processBoldText = (text) => {
    return text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold" style="color: #2370FF;">$1</strong>'
    );
  };

  // Enhanced Editable text component
  const EditableText = ({
    field,
    value,
    className = "",
    placeholder = "",
    multiline = false,
    onSave = null,
    showEditIcon = true,
    size = "xs",
  }) => {
    const isEditing = editingField === field;

    const handleSave = () => {
      if (onSave) {
        onSave(editingValue);
      } else {
        handleSaveEdit();
      }
    };

    if (isEditing) {
      return (
        <div className="relative z-10 w-full mb-4">
          <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-3">
            {multiline ? (
              <textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-${size} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors ${className}`}
                placeholder={placeholder}
                rows={multiline === true ? 4 : multiline}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-${size} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors ${className}`}
                placeholder={placeholder}
                autoFocus
              />
            )}
            <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 shadow-md transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 shadow-md transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <span
        className={`cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-300 hover:shadow-md px-2 py-1 rounded-md transition-all duration-200 inline-flex items-center gap-2 editable-field relative min-h-[24px] ${className}`}
        onClick={() => handleEditField(field, value)}
        title="Click to edit"
      >
        <span className="flex-1">{value || placeholder}</span>
        <Edit3 className="h-3 w-3 opacity-0 transition-opacity text-blue-600 flex-shrink-0 edit-icon" />
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-md opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
          Click to edit
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </span>
    );
  };

  // Editable Achievement List Component
  const EditableAchievementList = ({
    achievements,
    experienceId,
    className = "",
  }) => {
    const [localAchievements, setLocalAchievements] = useState(achievements);

    const addAchievement = () => {
      setLocalAchievements([...localAchievements, "New achievement"]);
      // Update parent data
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                achievements: [...localAchievements, "New achievement"],
              }
            : exp
        ),
      }));
    };

    const updateAchievement = (index, value) => {
      const updated = localAchievements.map((ach, i) =>
        i === index ? value : ach
      );
      setLocalAchievements(updated);
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === experienceId ? { ...exp, achievements: updated } : exp
        ),
      }));
    };

    const removeAchievement = (index) => {
      const updated = localAchievements.filter((_, i) => i !== index);
      setLocalAchievements(updated);
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp) =>
          exp.id === experienceId ? { ...exp, achievements: updated } : exp
        ),
      }));
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {localAchievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-start gap-2 bg-gray-50 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <span className="text-xs mt-1 text-gray-600 font-bold">•</span>
            <div className="flex-1">
              <EditableText
                field={`achievement_${experienceId}_${index}`}
                value={achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                className="break-words w-full"
                multiline={2}
                onSave={(value) => updateAchievement(index, value)}
                size="xs"
              />
            </div>
            <button
              onClick={() => removeAchievement(index)}
              className="opacity-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all"
              title="Remove achievement"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addAchievement}
          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 mt-3 px-3 py-2 rounded-md border border-dashed border-blue-300 hover:border-blue-500 transition-all w-full justify-center"
        >
          <Plus className="h-3 w-3" />
          Add achievement
        </button>
      </div>
    );
  };

  // Get template dimensions and orientation - A4 portrait size
  const getTemplateDimensions = (templateId) => {
    // Standard A4 portrait dimensions (210mm x 297mm = 8.27" x 11.69")
    // Using aspect ratio of approximately 0.707 (height/width)
    return { aspectRatio: "0.707", orientation: "portrait", columns: 2 };
  };

  // Function to check if template supports photos
  const templateSupportsPhoto = (templateId) => {
    return ["saanvi-patel-1", "saanvi-patel-3"].includes(templateId);
  };

  // Static template render function for preview mode (non-editable)
  const renderStaticTemplate = (templateData, firstName, lastName) => {
    switch (selectedTemplate) {
      case "saanvi-patel-1":
        return (
          <div className="h-full flex bg-white p-4 text-sm leading-relaxed overflow-hidden">
            {/* Left Sidebar - Dark Blue */}
            <div className="w-1/3 bg-slate-700 text-white p-3 rounded-sm mr-3 overflow-y-auto">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 border-2 border-white overflow-hidden">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-white text-base leading-tight break-words">
                  {templateData.name}
                </div>
                <div className="text-xs text-gray-300 mt-1 font-medium break-words">
                  {templateData.title}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  CONTACT
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="break-all flex items-center gap-1">
                    📧 {templateData.email}
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📱 {templateData.phone}
                  </div>
                  <div className="break-all">
                    🌐 linkedin.com/in/{firstName.toLowerCase()}
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📍 {templateData.location}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  SKILLS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  {templateData.skills.slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="break-words flex items-center gap-1"
                    >
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  LANGUAGES
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• English (Fluent)</div>
                  <div>• Spanish (Conversational)</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  CERTIFICATIONS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Professional Development</div>
                  <div>• Industry Certification</div>
                  <div>• Technical Training</div>
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  INTERESTS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Professional Growth</div>
                  <div>• Team Collaboration</div>
                  <div>• Innovation</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-2/3 p-3 overflow-y-auto">
              <div className="mb-3">
                <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide border-b border-slate-300 pb-1">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wide border-b border-slate-300 pb-2">
                  WORK EXPERIENCE
                </div>
                <div className="text-xs text-gray-600 space-y-4">
                  {templateData.experience.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold text-gray-800 text-xs break-words">
                            {exp.position}
                          </div>
                          <div className="font-medium text-gray-600 text-xs break-words flex items-center gap-2">
                            {exp.company}
                            <span className="text-gray-400">•</span>
                            {exp.duration}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-xs mt-1 text-gray-600 font-bold">
                              •
                            </span>
                            <div className="text-xs text-gray-600 break-words">
                              {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wide border-b border-slate-300 pb-2">
                  EDUCATION
                </div>
                <div className="text-xs text-gray-600 space-y-3">
                  {(Array.isArray(templateData.education)
                    ? templateData.education
                    : [templateData.education]
                  ).map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="font-semibold text-gray-800 text-xs">
                          {edu.degree}
                        </div>
                        <div className="text-gray-600 flex items-center gap-2">
                          {edu.school}
                          <span className="text-gray-400">•</span>
                          {edu.year}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide border-b border-slate-300 pb-1">
                  KEY ACHIEVEMENTS
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>🏆 Outstanding Performance Recognition</div>
                  <div>🏆 Team Leadership Excellence</div>
                  <div>🏆 Innovation and Problem-Solving Award</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "saanvi-patel-2":
        return (
          <div className="h-full p-4 text-sm leading-relaxed bg-white overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="text-center mb-4 pb-2 border-b-2 border-slate-700">
              <div className="font-bold text-lg text-slate-700 tracking-wider break-words">
                {templateData.name}
              </div>
              <div className="text-sm text-gray-600 mt-1 font-medium break-words">
                {templateData.title}
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all flex justify-center items-center gap-1">
                {templateData.location} • {templateData.phone} •{" "}
                {templateData.email}
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-3">
              <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide">
                PROFESSIONAL SUMMARY
              </div>
              <div className="text-xs text-gray-600 leading-relaxed break-words">
                {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>
            </div>

            {/* Core Competencies */}
            <div className="mb-3">
              <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide">
                CORE COMPETENCIES
              </div>
              <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2 gap-y-1">
                {templateData.skills.map((skill, index) => (
                  <div key={index} className="break-words">
                    • {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                PROFESSIONAL EXPERIENCE
              </div>
              <div className="text-xs text-gray-600 space-y-3">
                {templateData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="font-semibold text-gray-800 text-sm">
                      {exp.position}
                    </div>
                    <div className="font-medium text-gray-600">
                      {exp.company} • {exp.duration}
                    </div>
                    <div className="mt-1 space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i}>
                          • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                EDUCATION
              </div>
              <div className="text-xs text-gray-600">
                {(Array.isArray(templateData.education)
                  ? templateData.education
                  : [templateData.education]
                ).map((edu, index) => (
                  <div key={index}>
                    <div className="font-semibold text-gray-800 text-sm">
                      {edu.degree}
                    </div>
                    <div className="text-gray-600">
                      {edu.school} • {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                KEY ACHIEVEMENTS
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>🏆 Excellence in Performance and Results</div>
                <div>🏆 Leadership and Team Development</div>
                <div>🏆 Innovation and Process Improvement</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                ADDITIONAL INFORMATION
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  • Available for immediate start and flexible scheduling
                </div>
                <div>• Strong analytical and problem-solving capabilities</div>
                <div>• Excellent communication and interpersonal skills</div>
              </div>
            </div>
          </div>
        );

      case "saanvi-patel-3":
        return (
          <div className="h-full flex bg-white overflow-hidden">
            {/* Left Column - Green Sidebar */}
            <div className="w-2/5 bg-emerald-600 text-white p-2 text-xs overflow-y-auto">
              <div className="text-center mb-2">
                <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1 shadow-md overflow-hidden">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-3 w-3 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-xs leading-none break-words">
                  {templateData.name}
                </div>
                <div className="text-xs mt-1 font-medium opacity-90 break-words">
                  {templateData.title.toUpperCase()}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-white font-bold mb-1 text-xs uppercase tracking-wide">
                  CONTACT
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1 break-all">
                    <span>📧</span> {templateData.email}
                  </div>
                  <div className="flex items-center gap-1 break-words">
                    <span>📱</span> {templateData.phone}
                  </div>
                  <div className="flex items-center gap-1 break-all">
                    <span>🌐</span> linkedin.com/in/{firstName.toLowerCase()}
                  </div>
                  <div className="flex items-center gap-1 break-words">
                    <span>📍</span> {templateData.location}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px]">
                  {(Array.isArray(templateData.education)
                    ? templateData.education
                    : [templateData.education]
                  ).map((edu, index) => (
                    <div key={index}>
                      <div className="font-semibold">{edu.degree}</div>
                      <div className="opacity-90">{edu.school}</div>
                      <div className="opacity-90">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  SKILLS
                </div>
                <div className="text-[5px] space-y-0.5">
                  {templateData.skills.map((skill, index) => (
                    <div key={index}>• {skill}</div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  LANGUAGES
                </div>
                <div className="text-[5px] space-y-0.5">
                  <div>• English (Fluent)</div>
                  <div>• Spanish (Conversational)</div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="w-3/5 p-2 text-xs overflow-y-auto">
              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600">
                  {templateData.experience.map((exp, index) => (
                    <div key={index} className="mb-1.5">
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-emerald-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  KEY ACHIEVEMENTS
                </div>
                <div className="text-[5px] text-gray-600 space-y-0.5">
                  <div>🏆 Outstanding Performance Award</div>
                  <div>🏆 Team Leadership Excellence</div>
                  <div>🏆 Innovation Recognition</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  ADDITIONAL INFO
                </div>
                <div className="text-[5px] text-gray-600 space-y-0.5">
                  <div>• Available for flexible scheduling</div>
                  <div>• Strong analytical and problem-solving skills</div>
                  <div>• Excellent communication abilities</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "template-4":
        return (
          <div className="h-full p-3 text-xs bg-gray-50 leading-tight overflow-y-auto overflow-x-hidden">
            <div className="text-center mb-2 border-b-2 border-blue-600 pb-1">
              <div className="font-bold text-sm text-gray-800 tracking-wider break-words">
                {templateData.name.toUpperCase()}
              </div>
              <div className="text-blue-600 font-semibold text-xs mt-0.5 break-words">
                {templateData.title.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all">
                {templateData.email} • {templateData.phone} •{" "}
                {templateData.location}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-xs uppercase tracking-wide">
                  TECHNICAL SKILLS
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2">
                  {templateData.skills.map((skill, index) => (
                    <div key={index} className="break-words">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                  EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600 space-y-1">
                  {templateData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-blue-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px] text-gray-600">
                  {(Array.isArray(templateData.education)
                    ? templateData.education
                    : [templateData.education]
                  ).map((edu, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {edu.degree}
                      </div>
                      <div className="text-gray-600">
                        {edu.school} • {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "template-5":
      case "template-6":
        return (
          <div className="h-full p-3 text-xs bg-white leading-tight overflow-y-auto overflow-x-hidden">
            <div className="text-center mb-2 border-b-2 border-gray-800 pb-1">
              <div className="font-bold text-sm text-gray-800 tracking-wider break-words">
                {templateData.name.toUpperCase()}
              </div>
              <div className="text-gray-600 text-xs mt-0.5 font-medium break-words">
                {templateData.title.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all">
                {templateData.email} • {templateData.phone} •{" "}
                {templateData.location}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-xs uppercase tracking-wide">
                  CORE COMPETENCIES
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2">
                  {templateData.skills.map((skill, index) => (
                    <div key={index} className="break-words">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600 space-y-1">
                  {templateData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-gray-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px] text-gray-600">
                  {(Array.isArray(templateData.education)
                    ? templateData.education
                    : [templateData.education]
                  ).map((edu, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {edu.degree}
                      </div>
                      <div className="text-gray-600">
                        {edu.school} • {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // Only the professional single-column templates
      case "internship-1-with-photo":
      case "job-1-with-photo":
        return (
          <div className="h-full bg-white overflow-y-auto" style={{padding: '20px 25px', fontFamily: 'Helvetica, Arial, sans-serif'}}>
            {/* Header with Photo - EXACT PDF measurements */}
            <div className="flex mb-5" style={{paddingBottom: '15px', borderBottom: '2px solid #2563eb'}}>
              <div className="mr-5" style={{width: '80px', height: '80px'}}>
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200" style={{width: '80px', height: '80px', borderRadius: '40px'}}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={handlePhotoClick}>
                      <Camera className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="font-bold mb-1" style={{fontSize: '24px', color: '#1f2937', marginBottom: '5px'}}>
                  <EditableText field="personalInfo.name" value={templateData.name} className="text-gray-800" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, name: value}}))} />
                </h1>
                <h2 className="font-bold mb-2" style={{fontSize: '14px', color: '#2563eb', marginBottom: '8px'}}>
                  <EditableText field="personalInfo.title" value={templateData.title} className="text-blue-600" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, title: value}}))} />
                </h2>
                <div className="flex flex-wrap" style={{fontSize: '10px', color: '#6b7280'}}>
                  <span style={{marginRight: '15px', marginBottom: '3px'}}>📧 <EditableText field="personalInfo.email" value={templateData.email} className="text-gray-500" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, email: value}}))} /></span>
                  <span style={{marginRight: '15px', marginBottom: '3px'}}>📱 <EditableText field="personalInfo.phone" value={templateData.phone} className="text-gray-500" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, phone: value}}))} /></span>
                  <span style={{marginRight: '15px', marginBottom: '3px'}}>📍 <EditableText field="personalInfo.location" value={templateData.location} className="text-gray-500" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, location: value}}))} /></span>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '14px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Professional Summary</h3>
              <div style={{fontSize: '10px', color: '#374151', lineHeight: '1.5'}}>
                <EditableText field="personalInfo.summary" value={templateData.summary} className="text-gray-700" multiline={true} onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, summary: value}}))} />
              </div>
            </div>

            {/* Experience */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '14px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Experience</h3>
              {templateData.experience.map((exp, index) => (
                <div key={exp.id || index} style={{marginBottom: '12px'}}>
                  <h4 className="font-bold" style={{fontSize: '12px', color: '#1f2937', marginBottom: '3px'}}>
                    <EditableText field={`experience.${index}.position`} value={exp.position} className="text-gray-800" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], position: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </h4>
                  <div className="font-bold" style={{fontSize: '10px', color: '#2563eb', marginBottom: '3px'}}>
                    <EditableText field={`experience.${index}.company`} value={exp.company} className="text-blue-600" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], company: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </div>
                  <div style={{fontSize: '9px', color: '#6b7280', marginBottom: '5px'}}>
                    <EditableText field={`experience.${index}.duration`} value={exp.duration} className="text-gray-500" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], duration: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </div>
                  {exp.achievements?.map((achievement, achIndex) => (
                    <div key={achIndex} style={{fontSize: '10px', color: '#374151', marginBottom: '2px', marginLeft: '10px'}}>
                      • <EditableText field={`experience.${index}.achievements.${achIndex}`} value={achievement} className="text-gray-700" onSave={(value) => {const newExperience = [...templateData.experience]; const newAchievements = [...newExperience[index].achievements]; newAchievements[achIndex] = value; newExperience[index] = {...newExperience[index], achievements: newAchievements}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '14px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Skills</h3>
              <div style={{fontSize: '10px', color: '#374151', lineHeight: '1.5'}}>{templateData.skills.join(" • ")}</div>
            </div>

            {/* Education */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '14px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Education</h3>
              {templateData.education.map((edu, index) => (
                <div key={edu.id || index} style={{marginBottom: '10px'}}>
                  <div className="font-bold" style={{fontSize: '12px', color: '#1f2937', marginBottom: '3px'}}>
                    <EditableText field={`education.${index}.degree`} value={edu.degree} className="text-gray-800" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], degree: value}; setResumeData(prev => ({...prev, education: newEducation}));}} />
                  </div>
                  <div style={{fontSize: '10px', color: '#6b7280'}}>
                    <EditableText field={`education.${index}.school`} value={edu.school} className="text-gray-500" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], school: value}; setResumeData(prev => ({...prev, education: newEducation}));}} /> • <EditableText field={`education.${index}.year`} value={edu.year} className="text-gray-500" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], year: value}; setResumeData(prev => ({...prev, education: newEducation}));}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "internship-1-without-photo":
      case "job-1-without-photo":
        return (
          <div className="h-full bg-white p-6 text-sm leading-relaxed overflow-y-auto">
            {/* Header without Photo */}
            <div className="mb-5 pb-4 border-b-2 border-blue-600">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                <EditableText field="personalInfo.name" value={templateData.name} className="text-gray-800" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, name: value}}))} />
              </h1>
              <h2 className="text-sm font-bold text-blue-600 mb-2">
                <EditableText field="personalInfo.title" value={templateData.title} className="text-blue-600" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, title: value}}))} />
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                <span>📧 <EditableText field="personalInfo.email" value={templateData.email} className="text-gray-600" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, email: value}}))} /></span>
                <span>📱 <EditableText field="personalInfo.phone" value={templateData.phone} className="text-gray-600" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, phone: value}}))} /></span>
                <span>📍 <EditableText field="personalInfo.location" value={templateData.location} className="text-gray-600" onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, location: value}}))} /></span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Professional Summary</h3>
              <div className="text-xs text-gray-700 leading-relaxed">
                <EditableText field="personalInfo.summary" value={templateData.summary} className="text-gray-700" multiline={true} onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, summary: value}}))} />
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Experience</h3>
              {templateData.experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <h4 className="text-xs font-bold text-gray-800 mb-1">
                    <EditableText field={`experience.${index}.position`} value={exp.position} className="text-gray-800" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], position: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </h4>
                  <div className="text-xs font-bold text-blue-600 mb-1">
                    <EditableText field={`experience.${index}.company`} value={exp.company} className="text-blue-600" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], company: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <EditableText field={`experience.${index}.duration`} value={exp.duration} className="text-gray-600" onSave={(value) => {const newExperience = [...templateData.experience]; newExperience[index] = {...newExperience[index], duration: value}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                  </div>
                  {exp.achievements?.map((achievement, achIndex) => (
                    <div key={achIndex} className="text-xs text-gray-700 ml-2 mb-1">•
                      <EditableText field={`experience.${index}.achievements.${achIndex}`} value={achievement} className="text-gray-700" onSave={(value) => {const newExperience = [...templateData.experience]; const newAchievements = [...newExperience[index].achievements]; newAchievements[achIndex] = value; newExperience[index] = {...newExperience[index], achievements: newAchievements}; setResumeData(prev => ({...prev, experience: newExperience}));}} />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Skills</h3>
              <div className="text-xs text-gray-700">{templateData.skills.join(" • ")}</div>
            </div>

            {/* Education */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Education</h3>
              {templateData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="text-xs font-bold text-gray-800">
                    <EditableText field={`education.${index}.degree`} value={edu.degree} className="text-gray-800" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], degree: value}; setResumeData(prev => ({...prev, education: newEducation}));}} />
                  </div>
                  <div className="text-xs text-gray-700">
                    <EditableText field={`education.${index}.school`} value={edu.school} className="text-gray-700" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], school: value}; setResumeData(prev => ({...prev, education: newEducation}));}} /> • <EditableText field={`education.${index}.year`} value={edu.year} className="text-gray-700" onSave={(value) => {const newEducation = [...templateData.education]; newEducation[index] = {...newEducation[index], year: value}; setResumeData(prev => ({...prev, education: newEducation}));}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "saanvi-patel-1":
        return (
          <div className="h-full flex bg-white p-4 text-sm leading-relaxed overflow-hidden">
            {/* Left Sidebar - Dark Blue */}
            <div className="w-1/3 bg-slate-700 text-white p-3 rounded-sm mr-3 overflow-y-auto">
              <div className="text-center mb-4">
                <div
                  className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 border-2 border-white cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                  onClick={handlePhotoClick}
                  title="Click to upload photo"
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-white text-base leading-tight break-words">
                  <EditableText
                    field="personalInfo.name"
                    value={templateData.name}
                    className="text-white"
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: value },
                      }))
                    }
                  />
                </div>
                <div className="text-xs text-gray-300 mt-1 font-medium break-words">
                  <EditableText
                    field="personalInfo.title"
                    value={templateData.title}
                    className="text-gray-300"
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, title: value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  CONTACT
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="break-all flex items-center gap-1">
                    📧{" "}
                    <EditableText
                      field="personalInfo.email"
                      value={templateData.email}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: value },
                        }))
                      }
                    />
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📱{" "}
                    <EditableText
                      field="personalInfo.phone"
                      value={templateData.phone}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: value },
                        }))
                      }
                    />
                  </div>
                  <div className="break-all">
                    🌐 linkedin.com/in/{firstName.toLowerCase()}
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📍{" "}
                    <EditableText
                      field="personalInfo.location"
                      value={templateData.location}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            location: value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  SKILLS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  {templateData.skills.slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="break-words flex items-center gap-1"
                    >
                      •{" "}
                      <EditableText
                        field={`skills.${index}`}
                        value={skill}
                        className="text-gray-300 flex-1"
                        onSave={(value) => {
                          const newSkills = [...templateData.skills];
                          newSkills[index] = value;
                          setResumeData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                        }}
                      />
                      <button
                        onClick={() => {
                          const newSkills = templateData.skills.filter(
                            (_, i) => i !== index
                          );
                          setResumeData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                        }}
                        className="opacity-0 text-red-400 hover:text-red-300"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddToSection("skills")}
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-800 hover:bg-opacity-20 mt-1 px-2 py-1 rounded transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add skill
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-xs text-gray-300 space-y-2">
                  {templateData.education.map((edu, index) => (
                    <div key={edu.id || index} className="break-words">
                      <div className="font-semibold text-gray-200">
                        <EditableText
                          field={`education.${index}.degree`}
                          value={edu.degree}
                          className="text-gray-200"
                          onSave={(value) => {
                            const newEducation = [...templateData.education];
                            newEducation[index] = {
                              ...newEducation[index],
                              degree: value,
                            };
                            setResumeData((prev) => ({
                              ...prev,
                              education: newEducation,
                            }));
                          }}
                        />
                      </div>
                      <div className="text-gray-300">
                        <EditableText
                          field={`education.${index}.school`}
                          value={edu.school}
                          className="text-gray-300"
                          onSave={(value) => {
                            const newEducation = [...templateData.education];
                            newEducation[index] = {
                              ...newEducation[index],
                              school: value,
                            };
                            setResumeData((prev) => ({
                              ...prev,
                              education: newEducation,
                            }));
                          }}
                        />
                      </div>
                      <div className="text-gray-400">
                        <EditableText
                          field={`education.${index}.year`}
                          value={edu.year}
                          className="text-gray-400"
                          onSave={(value) => {
                            const newEducation = [...templateData.education];
                            newEducation[index] = {
                              ...newEducation[index],
                              year: value,
                            };
                            setResumeData((prev) => ({
                              ...prev,
                              education: newEducation,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area - White */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="mb-4">
                <div className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-700 leading-relaxed break-words">
                  <EditableText
                    field="personalInfo.summary"
                    value={templateData.summary}
                    className="text-gray-700"
                    multiline={true}
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </div>
                <div className="space-y-3">
                  {templateData.experience.map((exp, index) => (
                    <div key={exp.id || index} className="break-words">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-gray-800 text-sm">
                          <EditableText
                            field={`experience.${index}.position`}
                            value={exp.position}
                            className="text-gray-800"
                            onSave={(value) => {
                              const newExperience = [...templateData.experience];
                              newExperience[index] = {
                                ...newExperience[index],
                                position: value,
                              };
                              setResumeData((prev) => ({
                                ...prev,
                                experience: newExperience,
                              }));
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">
                          <EditableText
                            field={`experience.${index}.duration`}
                            value={exp.duration}
                            className="text-gray-600"
                            onSave={(value) => {
                              const newExperience = [...templateData.experience];
                              newExperience[index] = {
                                ...newExperience[index],
                                duration: value,
                              };
                              setResumeData((prev) => ({
                                ...prev,
                                experience: newExperience,
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        <EditableText
                          field={`experience.${index}.company`}
                          value={exp.company}
                          className="text-gray-600"
                          onSave={(value) => {
                            const newExperience = [...templateData.experience];
                            newExperience[index] = {
                              ...newExperience[index],
                              company: value,
                            };
                            setResumeData((prev) => ({
                              ...prev,
                              experience: newExperience,
                            }));
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        {exp.achievements?.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start gap-1">
                            <span className="text-gray-500 mt-0.5">•</span>
                            <EditableText
                              field={`experience.${index}.achievements.${achIndex}`}
                              value={achievement}
                              className="text-gray-700 flex-1"
                              onSave={(value) => {
                                const newExperience = [...templateData.experience];
                                const newAchievements = [
                                  ...newExperience[index].achievements,
                                ];
                                newAchievements[achIndex] = value;
                                newExperience[index] = {
                                  ...newExperience[index],
                                  achievements: newAchievements,
                                };
                                setResumeData((prev) => ({
                                  ...prev,
                                  experience: newExperience,
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <p>Template not found</p>
              <p className="text-sm">Selected template: {selectedTemplate}</p>
            </div>
          </div>
        );
    }
  };

  // Template render function using exact same templates as template-selection page
  const renderTemplate = (isPreview = false) => {
    const templateData = {
      name: resumeData.personalInfo.name,
      title: resumeData.personalInfo.title,
      email: resumeData.personalInfo.email,
      phone: resumeData.personalInfo.phone,
      location: resumeData.personalInfo.location,
      summary: resumeData.personalInfo.summary,
      experience: resumeData.experience,
      skills: resumeData.skills,
      education: resumeData.education,
    };

    // Get first and last name for templates that need them separately
    const nameParts = templateData.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // For preview mode, render static content without EditableText components
    if (isPreview) {
      return renderStaticTemplate(templateData, firstName, lastName);
    }

    switch (selectedTemplate) {
      case "saanvi-patel-1":
        return (
          <div className="h-full flex bg-white p-4 text-sm leading-relaxed overflow-hidden">
            {/* Left Sidebar - Dark Blue */}
            <div className="w-1/3 bg-slate-700 text-white p-3 rounded-sm mr-3 overflow-y-auto">
              <div className="text-center mb-4">
                <div
                  className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 border-2 border-white cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                  onClick={handlePhotoClick}
                  title="Click to upload photo"
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-white text-base leading-tight break-words">
                  <EditableText
                    field="personalInfo.name"
                    value={templateData.name}
                    className="text-white"
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: value },
                      }))
                    }
                  />
                </div>
                <div className="text-xs text-gray-300 mt-1 font-medium break-words">
                  <EditableText
                    field="personalInfo.title"
                    value={templateData.title}
                    className="text-gray-300"
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, title: value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  CONTACT
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="break-all flex items-center gap-1">
                    📧{" "}
                    <EditableText
                      field="personalInfo.email"
                      value={templateData.email}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: value },
                        }))
                      }
                    />
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📱{" "}
                    <EditableText
                      field="personalInfo.phone"
                      value={templateData.phone}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: value },
                        }))
                      }
                    />
                  </div>
                  <div className="break-all">
                    🌐 linkedin.com/in/{firstName.toLowerCase()}
                  </div>
                  <div className="break-words flex items-center gap-1">
                    📍{" "}
                    <EditableText
                      field="personalInfo.location"
                      value={templateData.location}
                      className="text-gray-300"
                      onSave={(value) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            location: value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  SKILLS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  {templateData.skills.slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="break-words flex items-center gap-1"
                    >
                      •{" "}
                      <EditableText
                        field={`skills.${index}`}
                        value={skill}
                        className="text-gray-300 flex-1"
                        onSave={(value) => {
                          const newSkills = [...templateData.skills];
                          newSkills[index] = value;
                          setResumeData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                        }}
                      />
                      <button
                        onClick={() => {
                          const newSkills = templateData.skills.filter(
                            (_, i) => i !== index
                          );
                          setResumeData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                        }}
                        className="opacity-0 text-red-400 hover:text-red-300"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddToSection("skills")}
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-800 hover:bg-opacity-20 mt-1 px-2 py-1 rounded transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add skill
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  LANGUAGES
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• English (Fluent)</div>
                  <div>• Spanish (Conversational)</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  CERTIFICATIONS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Professional Development</div>
                  <div>• Industry Certification</div>
                  <div>• Technical Training</div>
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2 text-xs uppercase tracking-wide">
                  INTERESTS
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Professional Growth</div>
                  <div>• Team Collaboration</div>
                  <div>• Innovation</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-2/3 p-3 overflow-y-auto">
              <div className="mb-3">
                <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide border-b border-slate-300 pb-1">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  <EditableText
                    field="personalInfo.summary"
                    value={templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                    className="text-gray-600"
                    multiline={4}
                    onSave={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wide border-b border-slate-300 pb-2">
                  WORK EXPERIENCE
                </div>
                <div className="text-xs text-gray-600 space-y-4">
                  {templateData.experience.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold text-gray-800 text-xs break-words">
                            <EditableText
                              field={`experience.${exp.id}.position`}
                              value={exp.position}
                              className="text-gray-800"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((e) =>
                                    e.id === exp.id
                                      ? { ...e, position: value }
                                      : e
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div className="font-medium text-gray-600 text-xs break-words flex items-center gap-2">
                            <EditableText
                              field={`experience.${exp.id}.company`}
                              value={exp.company}
                              className="text-gray-600"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((e) =>
                                    e.id === exp.id
                                      ? { ...e, company: value }
                                      : e
                                  ),
                                }))
                              }
                            />
                            <span className="text-gray-400">•</span>
                            <EditableText
                              field={`experience.${exp.id}.duration`}
                              value={exp.duration}
                              className="text-gray-600"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((e) =>
                                    e.id === exp.id
                                      ? { ...e, duration: value }
                                      : e
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveFromSection("experience", exp.id)
                          }
                          className="opacity-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded ml-2 transition-all"
                          title="Remove experience"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <EditableAchievementList
                        achievements={exp.achievements}
                        experienceId={exp.id}
                        className="mt-2"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddToSection("experience")}
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 mt-4 px-4 py-2 rounded-md border border-blue-300 hover:border-blue-500 transition-all shadow-sm w-full justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Work Experience
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wide border-b border-slate-300 pb-2">
                  EDUCATION
                </div>
                <div className="text-xs text-gray-600 space-y-3">
                  {(Array.isArray(templateData.education)
                    ? templateData.education
                    : [templateData.education]
                  ).map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold text-gray-800 text-xs">
                            <EditableText
                              field={`education.${edu.id || index}.degree`}
                              value={edu.degree}
                              className="text-gray-800"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  education: Array.isArray(prev.education)
                                    ? prev.education.map((e) =>
                                        e.id === edu.id
                                          ? { ...e, degree: value }
                                          : e
                                      )
                                    : [{ ...prev.education, degree: value }],
                                }))
                              }
                            />
                          </div>
                          <div className="text-gray-600 flex items-center gap-2">
                            <EditableText
                              field={`education.${edu.id || index}.school`}
                              value={edu.school}
                              className="text-gray-600"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  education: Array.isArray(prev.education)
                                    ? prev.education.map((e) =>
                                        e.id === edu.id
                                          ? { ...e, school: value }
                                          : e
                                      )
                                    : [{ ...prev.education, school: value }],
                                }))
                              }
                            />
                            <span className="text-gray-400">•</span>
                            <EditableText
                              field={`education.${edu.id || index}.year`}
                              value={edu.year}
                              className="text-gray-600"
                              onSave={(value) =>
                                setResumeData((prev) => ({
                                  ...prev,
                                  education: Array.isArray(prev.education)
                                    ? prev.education.map((e) =>
                                        e.id === edu.id
                                          ? { ...e, year: value }
                                          : e
                                      )
                                    : [{ ...prev.education, year: value }],
                                }))
                              }
                            />
                          </div>
                        </div>
                        {Array.isArray(templateData.education) &&
                          templateData.education.length > 1 && (
                            <button
                              onClick={() =>
                                handleRemoveFromSection("education", edu.id)
                              }
                              className="opacity-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded ml-2 transition-all"
                              title="Remove education"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddToSection("education")}
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 mt-3 px-4 py-2 rounded-md border border-blue-300 hover:border-blue-500 transition-all shadow-sm w-full justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    Add Education
                  </button>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide border-b border-slate-300 pb-1">
                  KEY ACHIEVEMENTS
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>🏆 Outstanding Performance Recognition</div>
                  <div>🏆 Team Leadership Excellence</div>
                  <div>🏆 Innovation and Problem-Solving Award</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "saanvi-patel-2":
        return (
          <div className="h-full p-4 text-sm leading-relaxed bg-white overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="text-center mb-4 pb-2 border-b-2 border-slate-700">
              <div className="font-bold text-lg text-slate-700 tracking-wider break-words">
                <EditableText
                  field="personalInfo.name_template2"
                  value={templateData.name}
                  className="text-slate-700"
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, name: value },
                    }))
                  }
                />
              </div>
              <div className="text-sm text-gray-600 mt-1 font-medium break-words">
                <EditableText
                  field="personalInfo.title_template2"
                  value={templateData.title}
                  className="text-gray-600"
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, title: value },
                    }))
                  }
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all flex justify-center items-center gap-1">
                <EditableText
                  field="personalInfo.location_template2"
                  value={templateData.location}
                  className="text-gray-500"
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: value },
                    }))
                  }
                />
                •
                <EditableText
                  field="personalInfo.phone_template2"
                  value={templateData.phone}
                  className="text-gray-500"
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: value },
                    }))
                  }
                />
                •
                <EditableText
                  field="personalInfo.email_template2"
                  value={templateData.email}
                  className="text-gray-500"
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-3">
              <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide">
                PROFESSIONAL SUMMARY
              </div>
              <div className="text-xs text-gray-600 leading-relaxed break-words">
                <EditableText
                  field="personalInfo.summary_template2"
                  value={templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                  className="text-gray-600"
                  multiline={4}
                  onSave={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, summary: value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Core Competencies */}
            <div className="mb-3">
              <div className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide">
                CORE COMPETENCIES
              </div>
              <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2 gap-y-1">
                {templateData.skills.map((skill, index) => (
                  <div key={index} className="break-words">
                    • {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                PROFESSIONAL EXPERIENCE
              </div>
              <div className="text-xs text-gray-600 space-y-3">
                {templateData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="font-semibold text-gray-800 text-sm">
                      {exp.position}
                    </div>
                    <div className="font-medium text-gray-600">
                      {exp.company} • {exp.duration}
                    </div>
                    <div className="mt-1 space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i}>
                          • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                EDUCATION
              </div>
              <div className="text-xs text-gray-600">
                <div className="font-semibold text-gray-800 text-sm">
                  {templateData.education.degree}
                </div>
                <div className="text-gray-600">
                  {templateData.education.school} •{" "}
                  {templateData.education.year}
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-4">
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                KEY ACHIEVEMENTS
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>🏆 Excellence in Performance and Results</div>
                <div>🏆 Leadership and Team Development</div>
                <div>🏆 Innovation and Process Improvement</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                ADDITIONAL INFORMATION
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  • Available for immediate start and flexible scheduling
                </div>
                <div>• Strong analytical and problem-solving capabilities</div>
                <div>• Excellent communication and interpersonal skills</div>
              </div>
            </div>
          </div>
        );

      case "saanvi-patel-3":
        return (
          <div className="h-full flex bg-white overflow-hidden">
            {/* Left Column - Green Sidebar */}
            <div className="w-2/5 bg-emerald-600 text-white p-2 text-xs overflow-y-auto">
              <div className="text-center mb-2">
                <div
                  className="w-8 h-8 bg-white rounded-full mx-auto mb-1 shadow-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={handlePhotoClick}
                  title="Click to upload photo"
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-3 w-3 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-xs leading-none break-words">
                  {templateData.name}
                </div>
                <div className="text-xs mt-1 font-medium opacity-90 break-words">
                  {templateData.title.toUpperCase()}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-white font-bold mb-1 text-xs uppercase tracking-wide">
                  CONTACT
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1 break-all">
                    <span>📧</span> {templateData.email}
                  </div>
                  <div className="flex items-center gap-1 break-words">
                    <span>📱</span> {templateData.phone}
                  </div>
                  <div className="flex items-center gap-1 break-all">
                    <span>🌐</span> linkedin.com/in/{firstName.toLowerCase()}
                  </div>
                  <div className="flex items-center gap-1 break-words">
                    <span>📍</span> {templateData.location}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px]">
                  <div className="font-semibold">
                    {templateData.education.degree}
                  </div>
                  <div className="opacity-90">
                    {templateData.education.school}
                  </div>
                  <div className="opacity-90">
                    {templateData.education.year}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  SKILLS
                </div>
                <div className="text-[5px] space-y-0.5">
                  {templateData.skills.map((skill, index) => (
                    <div key={index}>• {skill}</div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-1.5 text-[6px] uppercase tracking-wide">
                  LANGUAGES
                </div>
                <div className="text-[5px] space-y-0.5">
                  <div>• English (Fluent)</div>
                  <div>• Spanish (Conversational)</div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="w-3/5 p-2 text-xs overflow-y-auto">
              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600">
                  {templateData.experience.map((exp, index) => (
                    <div key={index} className="mb-1.5">
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-emerald-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  KEY ACHIEVEMENTS
                </div>
                <div className="text-[5px] text-gray-600 space-y-0.5">
                  <div>🏆 Outstanding Performance Award</div>
                  <div>🏆 Team Leadership Excellence</div>
                  <div>🏆 Innovation Recognition</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-emerald-700 mb-1 text-[7px] uppercase tracking-wide">
                  ADDITIONAL INFO
                </div>
                <div className="text-[5px] text-gray-600 space-y-0.5">
                  <div>• Available for flexible scheduling</div>
                  <div>• Strong analytical and problem-solving skills</div>
                  <div>• Excellent communication abilities</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "template-4":
        return (
          <div className="h-full p-3 text-xs bg-gray-50 leading-tight overflow-y-auto overflow-x-hidden">
            <div className="text-center mb-2 border-b-2 border-blue-600 pb-1">
              <div className="font-bold text-sm text-gray-800 tracking-wider break-words">
                {templateData.name.toUpperCase()}
              </div>
              <div className="text-blue-600 font-semibold text-xs mt-0.5 break-words">
                {templateData.title.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all">
                {templateData.email} • {templateData.phone} •{" "}
                {templateData.location}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-xs uppercase tracking-wide">
                  TECHNICAL SKILLS
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2">
                  {templateData.skills.map((skill, index) => (
                    <div key={index} className="break-words">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                  EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600 space-y-1">
                  {templateData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-blue-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px] text-gray-600">
                  <div className="font-semibold text-gray-800">
                    {templateData.education.degree}
                  </div>
                  <div className="text-gray-600">
                    {templateData.education.school} •{" "}
                    {templateData.education.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "template-5":
      case "template-6":
        return (
          <div className="h-full p-3 text-xs bg-white leading-tight overflow-y-auto overflow-x-hidden">
            <div className="text-center mb-2 border-b-2 border-gray-800 pb-1">
              <div className="font-bold text-sm text-gray-800 tracking-wider break-words">
                {templateData.name.toUpperCase()}
              </div>
              <div className="text-gray-600 text-xs mt-0.5 font-medium break-words">
                {templateData.title.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1 break-all">
                {templateData.email} • {templateData.phone} •{" "}
                {templateData.location}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-xs uppercase tracking-wide">
                  PROFESSIONAL SUMMARY
                </div>
                <div className="text-xs text-gray-600 leading-relaxed break-words">
                  {templateData.summary.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-xs uppercase tracking-wide">
                  CORE COMPETENCIES
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2">
                  {templateData.skills.map((skill, index) => (
                    <div key={index} className="break-words">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                  PROFESSIONAL EXPERIENCE
                </div>
                <div className="text-[5px] text-gray-600 space-y-1">
                  {templateData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">
                        {exp.position}
                      </div>
                      <div className="font-medium text-gray-600">
                        {exp.company} • {exp.duration}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i}>
                            • {achievement.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                  EDUCATION
                </div>
                <div className="text-[5px] text-gray-600">
                  <div className="font-semibold text-gray-800">
                    {templateData.education.degree}
                  </div>
                  <div className="text-gray-600">
                    {templateData.education.school} •{" "}
                    {templateData.education.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderTemplate("saanvi-patel-1");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TextSelectionMenu onEnhance={handleEnhanceText} />

      {/* Full-screen Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-12 shadow-2xl text-center max-w-lg mx-4 border border-blue-200">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                  <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                  <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                  <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your resume looks great!
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              Now let&apos;s secure the bag! 💰
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                variant="ghost"
                onClick={handlePrev}
                className="text-gray-600 hover:text-gray-900 gap-1 lg:gap-2 text-sm lg:text-base"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-base lg:text-lg font-semibold text-gray-900">
                Resume Builder
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {isFromUpload && (
                <Badge className="bg-green-50 text-green-700 border-green-200 hidden sm:flex text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {enhancedChanges.length} AI Enhancements
                </Badge>
              )}
              <Button
                variant="outline"
                className="gap-1 lg:gap-2 text-xs lg:text-sm"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1 lg:gap-2 text-xs lg:text-sm"
                size="sm"
              >
                <Download className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white gap-1 lg:gap-2 text-xs lg:text-sm"
                size="sm"
              >
        
                <span className="hidden sm:inline">
                  {isGenerating ? "Finishing..." : "Finish"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div
          className={`grid grid-cols-1 ${
            sidebarCollapsed
              ? "lg:grid-cols-1"
              : isEditing
              ? "md:grid-cols-3 lg:grid-cols-3"
              : "md:grid-cols-3 lg:grid-cols-3"
          } gap-4 lg:gap-6 transition-all duration-300`}
        >
          {/* Left Sidebar - Resume Sections */}
          <div
            className={`${
              sidebarCollapsed
                ? "hidden lg:block lg:w-12"
                : "col-span-1 md:col-span-1 lg:col-span-1"
            } order-2 md:order-1 lg:order-1 transition-all duration-300`}
          >
            {sidebarCollapsed ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-2">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            ) : (
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3 lg:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm lg:text-base font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Resume Sections
                    </CardTitle>
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors lg:block hidden"
                      title="Collapse sidebar"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 lg:space-y-3">
                  <ResumeSection
                    title="Profile Photo"
                    icon={<Camera className="h-4 w-4" />}
                    isCompleted={!!profilePhoto}
                    onClick={handlePhotoClick}
                  />
                  <ResumeSection
                    title="Personal Info"
                    icon={<User className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("personalInfo")}
                    onAdd={() => handleAddToSection("personalInfo")}
                  />
                  <ResumeSection
                    title="Professional Summary"
                    icon={<Star className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("summary")}
                  />
                  <ResumeSection
                    title="Education"
                    icon={<FileText className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("education")}
                    onAdd={() => handleAddToSection("education")}
                  />
                  <ResumeSection
                    title="Work Experience"
                    icon={<Zap className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("experience")}
                    onAdd={() => handleAddToSection("experience")}
                  />
                  <ResumeSection
                    title="Projects"
                    icon={<FileText className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("projects")}
                    onAdd={() => handleAddToSection("projects")}
                  />
                  <ResumeSection
                    title="Skills"
                    icon={<Target className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("skills")}
                    onAdd={() => handleAddToSection("skills")}
                  />
                  <ResumeSection
                    title="Certifications"
                    icon={<Star className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("certifications")}
                    onAdd={() => handleAddToSection("certifications")}
                  />
                  <ResumeSection
                    title="Languages"
                    icon={<Target className="h-4 w-4" />}
                    isCompleted={true}
                    onClick={() => handleSectionClick("languages")}
                    onAdd={() => handleAddToSection("languages")}
                  />
                </CardContent>
              </Card>
            )}
            {/* ATS Score Card */}
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                <div className="text-sm font-medium text-blue-800 mb-1">
                  ATS Compatibility
                </div>
                <div className="text-xs text-blue-600">Excellent score!</div>
                <div className="mt-4 flex justify-center">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          </div>

          {/* Center - Resume Preview */}
          <div
            className={`${
              sidebarCollapsed
                ? "lg:col-span-1"
                : isEditing
                ? "col-span-1 md:col-span-1 lg:col-span-1"
                : "col-span-1 md:col-span-2 lg:col-span-2"
            } order-1 md:order-2 lg:order-2 transition-all duration-300`}
          >
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-sm lg:text-base font-semibold text-gray-900">
                    Resume Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      onClick={handleDownload}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      <Wand2 className="h-3 w-3" />
                      AI Enhance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={handlePrev}
                    >
                      <Settings className="h-3 w-3" />
                      Templates
                    </Button>
                  </div>
                  {currentTemplate && (
                    <div className="text-sm text-gray-600 mt-2">
                      Current template: <span className="font-medium">{currentTemplate.name}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="bg-gray-50 p-2 lg:p-4 rounded-lg">
                  <div
                    className="bg-white border border-gray-200 shadow-lg mx-auto overflow-hidden"
                    style={{
                      aspectRatio: "0.707",
                      maxWidth: "100%",
                      width: "100%",
                      minHeight: isMobile ? "400px" : "600px",
                      maxHeight: isMobile ? "500px" : "850px",
                    }}
                  >
                    <div className="h-full overflow-y-auto overflow-x-hidden">
                      <PDFPreview
                        key={JSON.stringify(resumeData)}
                        templateId={selectedTemplate}
                        width="100%"
                        height="100%"
                        data={resumeData}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Edit Panel */}
          {isEditing && (
            <div className="col-span-1 order-3 transition-all duration-300">
              <Card className="bg-white shadow-lg border-2 border-blue-200 sticky top-20">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Edit3 className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-base font-bold text-gray-900">
                        Edit {isEditing === "personalInfo" ? "Personal Info" :
                             isEditing === "summary" ? "Summary" :
                             isEditing.charAt(0).toUpperCase() + isEditing.slice(1)}
                      </CardTitle>
                    </div>
                    <button
                      onClick={() => setIsEditing(null)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                      title="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[calc(100vh-180px)] overflow-y-auto p-4">
                  {isEditing === "personalInfo" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <Input
                          value={resumeData.personalInfo.name}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, name: e.target.value }
                          }))}
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
                        <Input
                          value={resumeData.personalInfo.title}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, title: e.target.value }
                          }))}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <Input
                          type="tel"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <Input
                          value={resumeData.personalInfo.location}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  )}

                  {isEditing === "summary" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                        <Textarea
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, summary: e.target.value }
                          }))}
                          placeholder="Write a brief professional summary..."
                          rows={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">2-3 sentences about your career goals and specialization</p>
                      </div>
                    </div>
                  )}

                  {isEditing === "education" && (
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={edu.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">Education {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveFromSection("education", edu.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].degree = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Degree"
                          />
                          <Input
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].school = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Institution"
                          />
                          <Input
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].year = e.target.value;
                              setResumeData(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Year"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddToSection("education")}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  )}

                  {isEditing === "experience" && (
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">Experience {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveFromSection("experience", exp.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].company = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                            placeholder="Company"
                          />
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].position = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                            placeholder="Position"
                          />
                          <Input
                            value={exp.duration}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].duration = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                            placeholder="2020 - Present"
                          />
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Achievements</label>
                            {exp.achievements.map((ach, achIndex) => (
                              <div key={achIndex} className="flex gap-2 mb-2">
                                <Textarea
                                  value={ach}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[index].achievements[achIndex] = e.target.value;
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                  }}
                                  rows={2}
                                  className="flex-1"
                                />
                                <button
                                  onClick={() => {
                                    const newExp = [...resumeData.experience];
                                    newExp[index].achievements.splice(achIndex, 1);
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <Button
                              onClick={() => {
                                const newExp = [...resumeData.experience];
                                newExp[index].achievements.push("New achievement");
                                setResumeData(prev => ({ ...prev, experience: newExp }));
                              }}
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Achievement
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddToSection("experience")}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  )}

                  {isEditing === "projects" && (
                    <div className="space-y-4">
                      {resumeData.projects.map((project, index) => (
                        <div key={project.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">Project {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveFromSection("projects", project.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            value={project.name}
                            onChange={(e) => {
                              const newProjects = [...resumeData.projects];
                              newProjects[index].name = e.target.value;
                              setResumeData(prev => ({ ...prev, projects: newProjects }));
                            }}
                            placeholder="Project Name"
                          />
                          <Textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...resumeData.projects];
                              newProjects[index].description = e.target.value;
                              setResumeData(prev => ({ ...prev, projects: newProjects }));
                            }}
                            placeholder="Project description"
                            rows={3}
                          />
                          <Input
                            value={project.technologies.join(", ")}
                            onChange={(e) => {
                              const newProjects = [...resumeData.projects];
                              newProjects[index].technologies = e.target.value.split(",").map(t => t.trim());
                              setResumeData(prev => ({ ...prev, projects: newProjects }));
                            }}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddToSection("projects")}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  )}

                  {isEditing === "skills" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                        {resumeData.skills.map((skill, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...resumeData.skills];
                                newSkills[index] = e.target.value;
                                setResumeData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              placeholder="Skill"
                            />
                            <button
                              onClick={() => {
                                const newSkills = resumeData.skills.filter((_, i) => i !== index);
                                setResumeData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <Button
                          onClick={() => handleAddToSection("skills")}
                          variant="outline"
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>
                      </div>
                    </div>
                  )}

                  {isEditing === "certifications" && (
                    <div className="space-y-4">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={cert.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">Certification {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveFromSection("certifications", cert.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            value={cert.name}
                            onChange={(e) => {
                              const newCerts = [...resumeData.certifications];
                              newCerts[index].name = e.target.value;
                              setResumeData(prev => ({ ...prev, certifications: newCerts }));
                            }}
                            placeholder="Certification Name"
                          />
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const newCerts = [...resumeData.certifications];
                              newCerts[index].issuer = e.target.value;
                              setResumeData(prev => ({ ...prev, certifications: newCerts }));
                            }}
                            placeholder="Issuing Organization"
                          />
                          <Input
                            value={cert.year}
                            onChange={(e) => {
                              const newCerts = [...resumeData.certifications];
                              newCerts[index].year = e.target.value;
                              setResumeData(prev => ({ ...prev, certifications: newCerts }));
                            }}
                            placeholder="Year"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddToSection("certifications")}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  )}

                  {isEditing === "languages" && (
                    <div className="space-y-4">
                      {resumeData.languages.map((lang, index) => (
                        <div key={lang.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">Language {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveFromSection("languages", lang.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            value={lang.name}
                            onChange={(e) => {
                              const newLangs = [...resumeData.languages];
                              newLangs[index].name = e.target.value;
                              setResumeData(prev => ({ ...prev, languages: newLangs }));
                            }}
                            placeholder="Language"
                          />
                          <Input
                            value={lang.level}
                            onChange={(e) => {
                              const newLangs = [...resumeData.languages];
                              newLangs[index].level = e.target.value;
                              setResumeData(prev => ({ ...prev, languages: newLangs }));
                            }}
                            placeholder="Proficiency Level"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddToSection("languages")}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Language
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* AI Improvements Panel - Only show for upload flow */}
        {isFromUpload && (
          <div className="mt-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                  <CheckCircle className="h-5 w-5" />
                  AI Improvements Applied
                </CardTitle>
                <CardDescription>
                  Here&apos;s what we enhanced in your resume
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {aiImprovements.map((improvement, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-green-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          {improvement.type === "enhancement" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <span className="font-medium text-sm">
                          {improvement.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {improvement.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {improvement.count} improvements
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resume Preview
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div
                    className="bg-white border border-gray-200 shadow-lg mx-auto"
                    style={{
                      aspectRatio: "0.707",
                      maxWidth: "100%",
                      width: "100%",
                      minHeight: "600px",
                      maxHeight: "800px",
                    }}
                  >
                    <div className="h-full overflow-y-auto overflow-x-hidden">
                      <PDFPreview
                        key={JSON.stringify(resumeData)}
                        templateId={selectedTemplate}
                        width="100%"
                        height="100%"
                        data={resumeData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Resume Section Component
const ResumeSection = ({ title, icon, isCompleted, onClick, onAdd }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={onClick}
        className="flex items-center gap-2 sm:gap-3 p-3 md:p-2 lg:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
      >
        <div
          className={`w-7 h-7 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {React.cloneElement(icon, { className: "h-3 w-3 sm:h-4 sm:w-4" })}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm md:text-xs lg:text-sm text-gray-900 truncate">
            {title}
          </div>
          <div
            className={`text-xs hidden sm:block ${
              isCompleted ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isCompleted ? "Completed" : "Incomplete"}
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isCompleted ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
      </div>
      {onAdd && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className={`w-full mt-1 flex items-center justify-center gap-1 p-2 md:p-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">
            Add{" "}
            {title.includes("Experience")
              ? "Experience"
              : title.includes("Education")
              ? "Education"
              : title.includes("Skills")
              ? "Skill"
              : "Item"}
          </span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
    </div>
  );
};

export default function EnhancedResume() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedResumeContent />
    </Suspense>
  );
}
