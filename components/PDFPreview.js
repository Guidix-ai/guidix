"use client";

import React, { useState, useEffect } from "react";
import * as Templates from "./pdf-templates";

// Sample internship resume data for preview
const sampleInternshipData = {
  personalInfo: {
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Computer Science Student",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 987-6543",
    location: "Boston, MA",
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
    photo: "/api/placeholder/120/120",
  },
  summary:
    "Motivated Computer Science student with strong foundation in programming, algorithms, and web development. Seeking internship opportunities to apply academic knowledge and gain hands-on experience in software development.",
  experience: [
    {
      position: "Teaching Assistant",
      company: "University Computer Science Department",
      location: "Boston, MA",
      startDate: "2024-01",
      endDate: "Present",
      achievements: [
        "Assisted professor in teaching Introduction to Programming course with 150+ students",
        "Conducted weekly lab sessions and office hours to help students understand key concepts",
        "Graded assignments and provided constructive feedback to improve student learning",
      ],
    },
    {
      position: "Web Development Intern",
      company: "Local Startup Inc.",
      location: "Boston, MA",
      startDate: "2023-06",
      endDate: "2023-08",
      achievements: [
        "Developed responsive landing pages using HTML, CSS, and JavaScript",
        "Collaborated with design team to implement user interface improvements",
        "Participated in daily stand-ups and sprint planning meetings",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "Boston University",
      year: "Expected May 2025",
      gpa: "3.7",
    },
  ],
  skills: [
    "Python",
    "Java",
    "JavaScript",
    "HTML/CSS",
    "React",
    "Git",
    "SQL",
    "Data Structures",
    "Algorithms",
    "Problem Solving",
  ],
  projects: [
    {
      name: "Student Course Planner",
      description:
        "Web application to help students plan their course schedules with conflict detection",
      technologies: ["React", "Node.js", "MongoDB"],
    },
    {
      name: "Recipe Finder App",
      description:
        "Mobile-friendly application that suggests recipes based on available ingredients",
      technologies: ["JavaScript", "REST API", "Bootstrap"],
    },
  ],
  certifications: [
    {
      name: "Python Programming Certification",
      issuer: "Coursera",
      year: "2024",
    },
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Intermediate" },
  ],
};

// Sample professional resume data for preview
const sampleResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
    photo: "/api/placeholder/120/120",
  },
  summary:
    "Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable applications and driving technical innovation in fast-paced environments.",
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "New York, NY",
      startDate: "2022",
      endDate: "Present",
      responsibilities: [
        "Led development of microservices architecture serving 100k+ users",
        "Mentored junior developers and conducted code reviews",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
      achievements: [
        "Increased system performance by 40% through optimization",
        "Reduced bug reports by 50% through improved testing practices",
      ],
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2020",
      endDate: "2022",
      responsibilities: [
        "Developed responsive web applications using React and Node.js",
        "Collaborated with cross-functional teams to deliver features",
        "Maintained and improved existing codebase",
      ],
      achievements: ["Built feature that increased user engagement by 25%"],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      institution: "University of Technology",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.8",
      honors: "Magna Cum Laude",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Agile/Scrum",
    "Team Leadership",
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      startDate: "2023",
      endDate: "2023",
    },
    {
      name: "Task Management App",
      description:
        "Collaborative task management application with real-time updates",
      technologies: ["React", "Firebase", "Material-UI"],
      startDate: "2022",
      endDate: "2022",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Conversational" },
  ],
  achievements: [
    "Led team that won company hackathon for innovative AI solution",
    "Spoke at 3 technical conferences on modern web development",
    "Contributed to 5+ open-source projects with 1000+ stars",
  ],
};

const PDFPreview = ({
  templateId,
  resumeData,
  width = 300,
  height = 400,
  sectionOrder = [
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages",
  ],
}) => {
  const [mounted, setMounted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canvasImage, setCanvasImage] = useState(null);
  const canvasRef = React.useRef(null);

  // Use ref to track previous values and prevent infinite loops
  const prevResumeDataRef = React.useRef();
  const prevSectionOrderRef = React.useRef();
  const prevTemplateIdRef = React.useRef();

  // Determine if this is an internship template and use appropriate sample data
  const isInternshipTemplate = templateId?.includes("internship");
  const defaultResumeData = isInternshipTemplate
    ? sampleInternshipData
    : sampleResumeData;
  const actualResumeData = resumeData || defaultResumeData;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize sectionOrder to prevent infinite loops
  const sectionOrderKey = React.useMemo(() => {
    const key = sectionOrder?.join(",") || "";
    console.log("🔑 sectionOrderKey computed:", key);
    return key;
  }, [sectionOrder]);

  // Transform resume data
  const transformedResumeData = React.useMemo(() => {
    if (!actualResumeData) return defaultResumeData;

    // Check if this is enhanced-resume format (has name instead of firstName/lastName)
    if (
      actualResumeData.personalInfo &&
      actualResumeData.personalInfo.name &&
      !actualResumeData.personalInfo.firstName
    ) {
      const nameParts = (actualResumeData.personalInfo.name || "").split(" ");
      return {
        personalInfo: {
          ...actualResumeData.personalInfo,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || nameParts[0] || "",
        },
        summary:
          actualResumeData.personalInfo?.summary ||
          actualResumeData.summary ||
          "",
        experience: (actualResumeData.experience || []).map((exp) => ({
          position: exp.position,
          company: exp.company,
          location:
            exp.location || actualResumeData.personalInfo?.location || "",
          startDate: exp.duration
            ? exp.duration.split(" - ")[0].trim()
            : exp.startDate || "Present",
          endDate: exp.duration
            ? (exp.duration.split(" - ")[1] || "Present").trim()
            : exp.endDate || "Present",
          responsibilities: exp.achievements || exp.responsibilities || [],
        })),
        education: (actualResumeData.education || []).map((edu) => ({
          degree: edu.degree || "Bachelor of Science",
          fieldOfStudy:
            edu.fieldOfStudy ||
            (edu.degree
              ? edu.degree.replace(/Bachelor of Science in |Bachelor of /gi, "")
              : "Computer Science"),
          institution: edu.school || edu.institution || "University",
          startDate:
            edu.startDate ||
            (edu.year ? (parseInt(edu.year) - 4).toString() : "2016"),
          endDate: edu.endDate || edu.year || "2020",
          gpa: edu.gpa || "",
        })),
        skills: actualResumeData.skills || [],
        projects: (actualResumeData.projects || []).map((proj) => ({
          name: proj.name || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
          startDate: proj.startDate || "",
          endDate: proj.endDate || "",
          liveLink: proj.liveLink || "",
        })),
        certifications: (actualResumeData.certifications || []).map((cert) => ({
          name: cert.name || "",
          issuer: cert.issuer || "",
          date: cert.date || cert.year || "",
        })),
        languages: (actualResumeData.languages || []).map((lang) => ({
          language: lang.language || lang.name || "",
          proficiency: lang.proficiency || lang.level || "",
        })),
      };
    }

    return actualResumeData;
  }, [actualResumeData]);

  useEffect(() => {
    console.log(
      "📊 PDFPreview useEffect triggered - mounted:",
      mounted,
      "templateId:",
      templateId
    );
    if (!mounted || !templateId) {
      console.log(
        "⚠️ Early return - mounted:",
        mounted,
        "templateId:",
        templateId
      );
      return;
    }

    // Check if anything actually changed
    const resumeDataStr = JSON.stringify(actualResumeData);
    const sectionOrderStr = sectionOrderKey;
    console.log("🔍 Checking for changes...");

    if (
      prevResumeDataRef.current === resumeDataStr &&
      prevSectionOrderRef.current === sectionOrderStr &&
      prevTemplateIdRef.current === templateId
    ) {
      console.log("✅ No changes detected, skipping regeneration");
      return; // Nothing changed, don't regenerate
    }

    console.log("🔄 Changes detected, regenerating PDF...");
    // Update refs
    prevResumeDataRef.current = resumeDataStr;
    prevSectionOrderRef.current = sectionOrderStr;
    prevTemplateIdRef.current = templateId;

    const generatePDF = async () => {
      try {
        console.log("🎨 Starting PDF generation for template:", templateId);
        setIsLoading(true);
        setError(null);

        // Add timeout safety
        const timeoutId = setTimeout(() => {
          console.error("⏱️ PDF generation timeout - taking too long!");
          setError("PDF generation timed out");
          setIsLoading(false);
        }, 10000); // 10 second timeout

        // Map template ID to component name
        const componentMap = {
          // UUID mappings - Job Templates
          "aa97e710-4457-46fb-ac6f-1765ad3a6d43": "ATSTemplateWithoutPhoto",
          "41aab622-839d-454e-bf99-9d5a2ce027ec": "ATSTemplateWithPhoto",
          // UUID mappings - Internship Templates
          "b3c8f1a2-5d7e-4f9b-a1c3-8e2f5d9b7a4c": "InternshipTemplateWithoutPhoto",
          "d5e9a3f1-7b2c-4e8d-9f1a-6c3b8d2e5f7a": "InternshipTemplateWithPhoto",
          // Legacy string IDs (for backward compatibility)
          "ats-template-with-photo": "ATSTemplateWithPhoto",
          "ats-template-without-photo": "ATSTemplateWithoutPhoto",
          "internship-template-with-photo": "InternshipTemplateWithPhoto",
          "internship-template-without-photo": "InternshipTemplateWithoutPhoto",
          "saanvi-patel-1": "InternshipTemplate1WithoutPhoto",
          "saanvi-patel-2": "InternshipTemplate2WithoutPhoto",
          "saanvi-patel-3": "InternshipTemplate3WithoutPhoto",
          "saanvi-patel-1-with-photo": "InternshipTemplate1WithPhoto",
          "saanvi-patel-2-with-photo": "InternshipTemplate2WithPhoto",
          "saanvi-patel-3-with-photo": "InternshipTemplate3WithPhoto",
          "internship-1-with-photo": "InternshipTemplate1WithPhoto",
          "internship-2-with-photo": "InternshipTemplate2WithPhoto",
          "internship-3-with-photo": "InternshipTemplate3WithPhoto",
          "internship-1-without-photo": "InternshipTemplate1WithoutPhoto",
          "internship-2-without-photo": "InternshipTemplate2WithoutPhoto",
          "internship-3-without-photo": "InternshipTemplate3WithoutPhoto",
          "job-1-with-photo": "JobTemplate1WithPhoto",
          "job-2-with-photo": "JobTemplate2WithPhoto",
          "job-3-with-photo": "JobTemplate3WithPhoto",
          "job-1-without-photo": "JobTemplate1WithoutPhoto",
          "job-2-without-photo": "JobTemplate2WithoutPhoto",
          "job-3-without-photo": "JobTemplate3WithoutPhoto",
        };

        const componentName = componentMap[templateId];
        if (!componentName) {
          throw new Error(`Template ${templateId} not found`);
        }

        const TemplateComponent = Templates[componentName];
        if (!TemplateComponent) {
          throw new Error(`Component ${componentName} not found`);
        }

        // Dynamically import react-pdf renderer
        const { pdf } = await import("@react-pdf/renderer");
        const blob = await pdf(
          <TemplateComponent
            resumeData={transformedResumeData}
            sectionOrder={sectionOrder}
          />
        ).toBlob();
        clearTimeout(timeoutId); // Clear timeout on success
        const url = URL.createObjectURL(blob);
        console.log("✅ PDF generated successfully");
        setPdfUrl(url);
        setIsLoading(false);
      } catch (err) {
        clearTimeout(timeoutId); // Clear timeout on error
        console.error("❌ Error generating PDF:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    generatePDF();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, actualResumeData, mounted, sectionOrderKey]);

  if (!mounted || isLoading) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ width, height }}
      >
        <div className="text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-red-50 border border-red-200 rounded"
        style={{ width, height }}
      >
        <div className="text-red-500 text-sm text-center p-4">
          Error loading template: {error}
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ width, height }}
      >
        <div className="text-gray-500">No template selected</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .pdf-preview-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          background: white;
          overflow: hidden !important;
        }

        .pdf-preview-inner {
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          position: absolute;
          top: -5px;
          left: -20px;
          overflow: hidden !important;
        }

        .pdf-preview-inner iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: white;
        }
      `}</style>
      <div className="pdf-preview-wrapper">
        <div className="pdf-preview-inner">
          <iframe
            src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            title="PDF Preview"
          />
        </div>
      </div>
    </>
  );
};

export default PDFPreview;
