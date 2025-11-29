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
import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ResumeBreadcrumbs from "@/components/ResumeBreadcrumbs";
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
  GitCompare,
  Info,
} from "lucide-react";
import { TextSelectionMenu } from "@/components/TextSelectionMenu";
import { allTemplates, getTemplateById } from "@/components/pdf-templates";
import dynamic from 'next/dynamic';
import { pdf } from '@react-pdf/renderer';
import * as Templates from '@/components/pdf-templates';
import { getResume, saveResumeAssets } from "@/services/resumeService";
import { getJobsWithResumeId } from "@/services/jobService";
import { handleApiError, logError } from "@/utils/errorHandler";
import html2canvas from 'html2canvas';

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
};

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

const buttonTextStyles = {
  color: '#FFFFFF',
  textAlign: 'center',
  textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '125%',
  letterSpacing: '-2%'
};

const inputStyles = {
  width: "100%",
  height: 56,
  minHeight: 56,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 6,
  paddingBottom: 6,
  backgroundColor: colorTokens.bgLight,
  borderRadius: 16,
  border: 'none',
  boxShadow: "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
  outline: "1px solid #C7D6ED",
  fontSize: 14,
  color: "rgb(15, 38, 120)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  lineHeight: "125%",
  letterSpacing: "-0.32px",
};

const textareaStyles = {
  width: "100%",
  minHeight: 120,
  padding: 16,
  backgroundColor: colorTokens.bgLight,
  borderRadius: 16,
  border: 'none',
  boxShadow: "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
  outline: "1px solid #C7D6ED",
  fontSize: 14,
  color: "rgb(15, 38, 120)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  lineHeight: "125%",
  letterSpacing: "-0.32px",
  resize: 'vertical'
};

const labelStyles = {
  color: colorTokens.title,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "Inter, sans-serif",
  lineHeight: "20px",
  marginBottom: 12,
  display: "block"
};

const dateInputStyles = {
  ...inputStyles,
  colorScheme: "light",
  cursor: "pointer",
};

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

// Comparison helper components
const CompareField = ({ label, original, enhanced, isOriginal }) => {
  const value = isOriginal ? original : enhanced;
  const otherValue = isOriginal ? enhanced : original;

  let bgColor = 'transparent';
  let textColor = colorTokens.title;
  let badge = null;

  if (value !== otherValue) {
    if (!value && otherValue) {
      // Addition (green)
      bgColor = isOriginal ? 'transparent' : '#E2F8EA';
      textColor = isOriginal ? colorTokens.paragraph : '#166534';
      if (!isOriginal) {
        badge = { text: 'Added', color: '#fff', bg: '#16a34a' };
      }
    } else if (value && !otherValue) {
      // Deletion (red)
      bgColor = isOriginal ? '#FACDD0' : 'transparent';
      textColor = isOriginal ? '#991b1b' : colorTokens.paragraph;
      if (isOriginal) {
        badge = { text: 'Removed', color: '#fff', bg: '#dc2626' };
      }
    } else if (value !== otherValue) {
      // Modified (yellow) - for small field changes
      bgColor = '#FAEDBF';
      textColor = '#92400e';
      badge = { text: 'Modified', color: '#fff', bg: '#d97706' };
    }
  }

  // Determine border color based on badge type
  let borderColor = '#E1E4EB';
  if (badge) {
    if (badge.bg === '#16a34a') borderColor = '#86efac'; // Added - green
    else if (badge.bg === '#dc2626') borderColor = '#f87171'; // Removed - red
    else if (badge.bg === '#d97706') borderColor = '#fcd34d'; // Modified - yellow
  }

  return (
    <div style={{
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      marginBottom: '4px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {badge && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          padding: '2px 8px',
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: '8px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottomLeftRadius: '6px'
        }}>
          {badge.text}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <p style={{
          color: colorTokens.paragraph,
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 600
        }}>{label}:</p>
      </div>
      <p style={{
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }}>{value || '-'}</p>
    </div>
  );
};

const CompareText = ({ original, enhanced, isOriginal }) => {
  const value = isOriginal ? original : enhanced;
  const otherValue = isOriginal ? enhanced : original;

  let bgColor = 'transparent';
  let textColor = colorTokens.title;
  let badge = null;

  if (value !== otherValue) {
    if (!value && otherValue) {
      // Addition (green)
      bgColor = isOriginal ? 'transparent' : '#E2F8EA';
      textColor = isOriginal ? colorTokens.paragraph : '#166534';
      if (!isOriginal) {
        badge = { text: 'Added', color: '#fff', bg: '#16a34a' };
      }
    } else if (value && !otherValue) {
      // Deletion (red)
      bgColor = isOriginal ? '#FACDD0' : 'transparent';
      textColor = isOriginal ? '#991b1b' : colorTokens.paragraph;
      if (isOriginal) {
        badge = { text: 'Removed', color: '#fff', bg: '#dc2626' };
      }
    } else if (value !== otherValue) {
      // AI Enhanced (blue)
      bgColor = '#C3D0FF';
      textColor = '#1e3a8a';
      badge = { text: 'AI Enhanced', color: '#fff', bg: '#2370FF' };
    }
  }

  // Determine border color based on badge type
  let borderColor = '#E1E4EB';
  if (badge) {
    if (badge.bg === '#16a34a') borderColor = '#86efac'; // Added - green
    else if (badge.bg === '#dc2626') borderColor = '#f87171'; // Removed - red
    else if (badge.bg === '#2370FF') borderColor = '#93c5fd'; // AI Enhanced - blue
  }

  return (
    <div style={{
      padding: '12px',
      borderRadius: '6px',
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {badge && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          padding: '2px 8px',
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: '8px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottomLeftRadius: '6px'
        }}>
          {badge.text}
        </div>
      )}
      <p style={{
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        lineHeight: '1.6',
        paddingRight: badge ? '70px' : '0'
      }}>{value || '-'}</p>
    </div>
  );
};

const CompareListItem = ({ original, enhanced, isOriginal }) => {
  const value = isOriginal ? original : enhanced;
  const otherValue = isOriginal ? enhanced : original;

  let bgColor = 'transparent';
  let textColor = colorTokens.title;
  let bulletColor = colorTokens.paragraph;
  let badge = null;

  if (value !== otherValue) {
    if (!value && otherValue) {
      // Addition (green)
      bgColor = isOriginal ? 'transparent' : '#E2F8EA';
      textColor = isOriginal ? colorTokens.paragraph : '#166534';
      bulletColor = isOriginal ? colorTokens.paragraph : '#166534';
      if (!isOriginal) {
        badge = { text: 'New', color: '#fff', bg: '#16a34a' };
      }
    } else if (value && !otherValue) {
      // Deletion (red)
      bgColor = isOriginal ? '#FACDD0' : 'transparent';
      textColor = isOriginal ? '#991b1b' : colorTokens.paragraph;
      bulletColor = isOriginal ? '#991b1b' : colorTokens.paragraph;
      if (isOriginal) {
        badge = { text: 'Removed', color: '#fff', bg: '#dc2626' };
      }
    } else if (value !== otherValue) {
      // AI Enhanced (blue)
      bgColor = '#C3D0FF';
      textColor = '#1e3a8a';
      bulletColor = '#1e3a8a';
      badge = { text: 'AI Enhanced', color: '#fff', bg: '#2370FF' };
    }
  }

  // Determine border color based on badge type
  let borderColor = '#E1E4EB';
  if (badge) {
    if (badge.bg === '#16a34a') borderColor = '#86efac'; // New - green
    else if (badge.bg === '#dc2626') borderColor = '#f87171'; // Removed - red
    else if (badge.bg === '#2370FF') borderColor = '#93c5fd'; // AI Enhanced - blue
  }

  if (!value) return null;

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '6px 8px',
      borderRadius: '6px',
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      marginBottom: '4px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <span style={{
        color: bulletColor,
        fontSize: '12px',
        marginTop: '2px',
        flexShrink: 0
      }}>•</span>
      {badge && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          padding: '2px 8px',
          backgroundColor: badge.bg,
          color: badge.color,
          fontSize: '8px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottomLeftRadius: '4px'
        }}>
          {badge.text}
        </div>
      )}
      <p style={{
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        lineHeight: '1.5',
        flex: 1,
        paddingRight: badge ? '70px' : '0'
      }}>{value}</p>
    </div>
  );
};

// Dummy data for comparison when actual data is not available
const dummyOriginalData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    location: ""
  },
  summary: "Software developer with experience in web development.",
  experience: [
    {
      position: "Software Developer",
      company: "Tech Corp",
      location: "New York, NY",
      duration: "2020 - 2023",
      achievements: [
        "Developed web applications",
        "Worked on team projects",
        "Fixed bugs and issues"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Tech",
      year: "2020"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built an online store with basic features"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "jQuery"],
  certifications: [
    { name: "JavaScript Basics" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Basic" }
  ]
};

const dummyEnhancedData = {
  personalInfo: {
    name: "John Doe",
    email: "john.professional@email.com",
    phone: "+1 234 567 8900",
    location: "New York, NY"
  },
  summary: "Results-driven Software Engineer with 3+ years of experience in full-stack web development, specializing in building scalable applications and delivering high-quality solutions.",
  experience: [
    {
      position: "Senior Software Developer",
      company: "Tech Corp",
      location: "New York, NY",
      duration: "2020 - 2023",
      achievements: [
        "Architected and developed 5+ enterprise-level web applications using modern frameworks, resulting in 40% improvement in user engagement",
        "Collaborated with cross-functional teams of 10+ members to deliver projects 20% ahead of schedule",
        "Implemented CI/CD pipelines reducing deployment time by 60%"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Tech",
      year: "2020"
    }
  ],
  projects: [
    {
      name: "Enterprise E-commerce Platform",
      description: "Architected and developed a scalable e-commerce solution handling 10K+ daily transactions with 99.9% uptime"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker"],
  certifications: [
    { name: "AWS Certified Developer" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "French", proficiency: "Intermediate" }
  ]
};

function EnhancedResumeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState("Advika Sharma");
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const photoInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [tempFormData, setTempFormData] = useState(null);
  const [originalResumeData, setOriginalResumeData] = useState(null);
  const [enhancedResumeData, setEnhancedResumeData] = useState(null);

  const isFromUpload = searchParams.get("from") === "upload";
  const isFromAI = searchParams.get("from") === "ai";
  const selectedTemplate = searchParams.get("template") || "internship-1-with-photo";

  // State for resumeId to prevent hydration mismatch
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId"));

  // Get template metadata
  const currentTemplate = getTemplateById(selectedTemplate);

  // Load resumeId from sessionStorage or URL after hydration
  useEffect(() => {
    const urlResumeId = searchParams.get("resumeId");

    if (urlResumeId) {
      console.log('📋 Resume ID from URL params:', urlResumeId);
      setResumeId(urlResumeId);
      // Store in sessionStorage for later use
      sessionStorage.setItem('resumeIdUsedForJobs', urlResumeId);
      sessionStorage.setItem('createdResumeId', urlResumeId);
      sessionStorage.setItem('uploadedResumeId', urlResumeId);
    } else {
      // Fallback to sessionStorage after hydration
      const storedId = sessionStorage.getItem('createdResumeId') ||
                      sessionStorage.getItem('uploadedResumeId') ||
                      sessionStorage.getItem('resumeIdUsedForJobs');
      if (storedId) {
        console.log('📋 Resume ID from sessionStorage:', storedId);
        setResumeId(storedId);
      } else {
        console.warn('⚠️ No resume ID found in URL or sessionStorage');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Load Inter font
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    googleFontsLink.rel = 'stylesheet';
    document.head.appendChild(googleFontsLink);

    const style = document.createElement('style');
    style.innerHTML = `
      * {
        font-family: 'Inter', sans-serif !important;
      }
      body {
        font-family: 'Inter', sans-serif !important;
      }
      button, input, select, textarea {
        font-family: 'Inter', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

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
            console.log('📦 Loaded from enhancedResumeData sessionStorage');
          }

          // Also try to get original resume data from sessionStorage if not in the main data
          // First try 'originalResumeData', then fall back to 'uploadedResumeData' (from upload page)
          if (resumeDataFromAPI && !resumeDataFromAPI.original_resume) {
            let storedOriginal = sessionStorage.getItem('originalResumeData');

            // If not found, try to get from uploadedResumeData which contains the parsed original resume
            if (!storedOriginal) {
              const uploadedData = sessionStorage.getItem('uploadedResumeData');
              if (uploadedData) {
                try {
                  const parsedUploadedData = JSON.parse(uploadedData);
                  // uploadedResumeData contains original_resume array from upload API
                  if (parsedUploadedData.original_resume) {
                    resumeDataFromAPI.original_resume = parsedUploadedData.original_resume;
                    console.log('📦 Merged original_resume from uploadedResumeData sessionStorage');
                  }
                } catch (e) {
                  console.error('Failed to parse uploadedResumeData from sessionStorage', e);
                }
              }
            } else {
              try {
                const originalData = JSON.parse(storedOriginal);
                // Merge original data into the API response if not already present
                if (originalData) {
                  resumeDataFromAPI.original_resume = originalData;
                  console.log('📦 Merged originalResumeData from sessionStorage');
                }
              } catch (e) {
                console.error('Failed to parse originalResumeData from sessionStorage', e);
              }
            }
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
          console.log('📥 Raw API Data:', resumeDataFromAPI);

          // Check if we have structure data (from resume-creation API - AI Prompt flow)
          if (resumeDataFromAPI.structure) {
            const transformedData = transformAPIStructureToUI(resumeDataFromAPI.structure);
            if (transformedData) {
              console.log('✅ Transformed Data from structure:', transformedData);
              setResumeData(transformedData);
              if (transformedData.personalInfo?.name) {
                setUserName(transformedData.personalInfo.name);
              }
            }
          }
          // Check if we have both enhanced_resume and original_resume data (Upload flow after enhancement)
          else if (resumeDataFromAPI.enhanced_resume || resumeDataFromAPI.original_resume) {
            // Process enhanced resume if available
            if (resumeDataFromAPI.enhanced_resume && Array.isArray(resumeDataFromAPI.enhanced_resume)) {
              const transformedEnhanced = transformAPIStructureToUI(resumeDataFromAPI.enhanced_resume);
              if (transformedEnhanced) {
                console.log('✅ Transformed Data from enhanced_resume:', transformedEnhanced);
                setResumeData(transformedEnhanced);
                setEnhancedResumeData(transformedEnhanced);
                if (transformedEnhanced.personalInfo?.name) {
                  setUserName(transformedEnhanced.personalInfo.name);
                }
              }
            }

            // Process original resume if available
            if (resumeDataFromAPI.original_resume && Array.isArray(resumeDataFromAPI.original_resume)) {
              const transformedOriginal = transformAPIStructureToUI(resumeDataFromAPI.original_resume);
              if (transformedOriginal) {
                console.log('✅ Transformed Data from original_resume (for comparison):', transformedOriginal);
                setOriginalResumeData(transformedOriginal);

                // If we don't have enhanced data, use original as main data
                if (!resumeDataFromAPI.enhanced_resume) {
                  setResumeData(transformedOriginal);
                  if (transformedOriginal.personalInfo?.name) {
                    setUserName(transformedOriginal.personalInfo.name);
                  }
                }
              }
            }
          }
          // If no structure, assume it's already in the correct format
          else {
            setResumeData(resumeDataFromAPI);
            if (resumeDataFromAPI.personalInfo?.name) {
              setUserName(resumeDataFromAPI.personalInfo.name);
            }
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

  // Transform API structure to UI format
  const transformAPIStructureToUI = (apiStructure) => {
    if (!apiStructure || !Array.isArray(apiStructure)) {
      return null;
    }

    const transformed = {
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        photo: null,
        summary: "",
      },
      experience: [],
      skills: [],
      education: [],
      certifications: [],
      languages: [],
      projects: [],
    };

    apiStructure.forEach((section) => {
      switch (section.section) {
        case "contact_info":
          const contactDetails = section.details || {};
          transformed.personalInfo = {
            ...transformed.personalInfo,
            name: contactDetails.name || contactDetails.full_name || "",
            email: contactDetails.email || "",
            phone: contactDetails.phone || "",
            location: contactDetails.location || "",
            linkedin: contactDetails.linkedin_url || contactDetails.linkedin || "",
            github: contactDetails.github_url || contactDetails.github || contactDetails.portfolio_url || "",
            website: contactDetails.portfolio_url || contactDetails.website || "",
          };
          break;

        case "profile_summary":
          transformed.personalInfo.summary = section.details || "";
          break;

        case "skills":
          // Append to existing skills (API might return multiple skill sections)
          const newSkills = Array.isArray(section.details) ? section.details : [];
          transformed.skills = [...transformed.skills, ...newSkills];
          break;

        case "education":
          // Append to existing education entries (API might return multiple education sections)
          const newEducation = (Array.isArray(section.details) ? section.details : []).map((edu, index) => {
            let degree = edu.degree || "";

            // Fix duplication in degree field (e.g., "Bachelor of Technology in Civil Engineering in Technology in Civil Engineering")
            // Pattern: "X in Y in Z" where Y contains part of Z -> should just be "X in Z"
            if (degree.includes(" in ")) {
              const parts = degree.split(" in ");
              if (parts.length >= 3) {
                // If we have multiple "in" splits, likely have duplication
                // Check if the last part appears in earlier parts
                const lastPart = parts[parts.length - 1].trim();
                const middlePart = parts[parts.length - 2].trim();

                // If middle part is contained in or is similar to last part, remove middle part
                if (lastPart.toLowerCase().includes(middlePart.toLowerCase()) ||
                    middlePart.toLowerCase().includes(lastPart.toLowerCase())) {
                  // Reconstruct without the duplicate middle part
                  degree = parts.slice(0, -2).join(" in ") + " in " + lastPart;
                }
              }
            }

            return {
              id: transformed.education.length + index + 1,
              degree: degree,
              school: edu.university || edu.institution || edu.school || "",
              year: edu.graduation_date || edu.end_date || edu.year || "",
              gpa: edu.gpa_or_percentage || edu.gpa || "",
            };
          });
          transformed.education = [...transformed.education, ...newEducation];
          break;

        case "experience":
          // Append to existing experiences (API might return multiple experience sections)
          const newExperiences = (Array.isArray(section.details) ? section.details : []).map((exp, index) => {
            let achievements = [];

            // Handle different formats of achievements
            if (exp.highlights && Array.isArray(exp.highlights)) {
              achievements = exp.highlights;
            } else if (exp.achievements && Array.isArray(exp.achievements)) {
              achievements = exp.achievements;
            } else if (exp.description) {
              // If description is a string, wrap it in array
              achievements = [exp.description];
            }

            return {
              id: transformed.experience.length + index + 1,
              company: exp.company || "",
              position: exp.title || exp.position || exp.role || "",
              duration: exp.dates || exp.duration || "",
              location: exp.location || "",
              achievements: achievements,
            };
          });
          transformed.experience = [...transformed.experience, ...newExperiences];
          break;

        case "projects":
          // Append to existing projects (API might return multiple project sections)
          const newProjects = (Array.isArray(section.details) ? section.details : []).map((proj, index) => {
            // Combine description with highlights if available
            let fullDescription = proj.description || "";
            if (proj.highlights && Array.isArray(proj.highlights)) {
              const highlightsText = proj.highlights.join(". ");
              fullDescription = fullDescription ? `${fullDescription}. ${highlightsText}` : highlightsText;
            }

            return {
              id: transformed.projects.length + index + 1,
              name: proj.title || proj.project_name || proj.name || "",
              description: fullDescription,
              technologies: proj.tools_and_skills || proj.technologies || [],
              startDate: proj.start_date || proj.startDate || "",
              endDate: proj.end_date || proj.endDate || "",
              liveLink: proj.live_link || proj.liveLink || proj.url || "",
            };
          });
          transformed.projects = [...transformed.projects, ...newProjects];
          break;

        case "certifications":
          // Append to existing certifications (API might return multiple certification sections)
          const newCertifications = (Array.isArray(section.details) ? section.details : []).map((cert, index) => ({
            id: transformed.certifications.length + index + 1,
            name: cert.name || cert.certification_name || "",
            issuer: cert.issuer || cert.organization || "",
            year: cert.date || cert.year || "",
          }));
          transformed.certifications = [...transformed.certifications, ...newCertifications];
          break;

        case "languages":
          // Append to existing languages (API might return multiple language sections)
          const newLanguages = (Array.isArray(section.details) ? section.details : []).map((lang, index) => ({
            id: transformed.languages.length + index + 1,
            name: lang.language || lang.name || "",
            level: lang.proficiency || lang.level || "",
          }));
          transformed.languages = [...transformed.languages, ...newLanguages];
          break;

        default:
          console.log(`Unknown section type: ${section.section}`);
      }
    });

    return transformed;
  };

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
        startDate: "",
        endDate: "",
        liveLink: "",
      },
      {
        id: 2,
        name: "Real-time Chat Application",
        description: "Developed a real-time messaging app using WebSockets and Redis for instant communication",
        technologies: ["Socket.io", "Redis", "Express", "React"],
        startDate: "",
        endDate: "",
        liveLink: "",
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
        // Only update tempFormData - don't auto-save to resumeData
        // Changes will be saved to resumeData when user clicks "Save Changes"
        if (tempFormData) {
          setTempFormData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              photo: base64String,
            },
          }));
        }
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

  // Download the UPDATED resume (includes all user edits)
  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      console.log('📥 Starting download process...');
      console.log('Template ID:', selectedTemplate);
      console.log('Resume data:', resumeData);
      console.log('Available Templates:', Object.keys(Templates));

      // Map template ID to component name (includes UUID mappings)
      const componentMap = {
        // UUID mappings - Job Templates
        'aa97e710-4457-46fb-ac6f-1765ad3a6d43': 'ATSTemplateWithoutPhoto',
        '41aab622-839d-454e-bf99-9d5a2ce027ec': 'ATSTemplateWithPhoto',
        // UUID mappings - Internship Templates
        'b3c8f1a2-5d7e-4f9b-a1c3-8e2f5d9b7a4c': 'InternshipTemplateWithoutPhoto',
        'd5e9a3f1-7b2c-4e8d-9f1a-6c3b8d2e5f7a': 'InternshipTemplateWithPhoto',
        // Legacy string IDs (for backward compatibility)
        'ats-template-with-photo': 'ATSTemplateWithPhoto',
        'ats-template-without-photo': 'ATSTemplateWithoutPhoto',
        'internship-template-with-photo': 'InternshipTemplateWithPhoto',
        'internship-template-without-photo': 'InternshipTemplateWithoutPhoto',
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
      console.log('Mapped component name:', componentName);

      if (!componentName) {
        console.error('❌ Template mapping failed');
        console.error('Selected template:', selectedTemplate);
        console.error('Available mappings:', Object.keys(componentMap));
        throw new Error(`Template "${selectedTemplate}" not found in component map`);
      }

      const TemplateComponent = Templates[componentName];
      console.log('Template component loaded:', !!TemplateComponent);

      if (!TemplateComponent) {
        console.error('❌ Component not found in Templates object');
        console.error('Looking for:', componentName);
        console.error('Available components:', Object.keys(Templates));
        throw new Error(`Component "${componentName}" not found in Templates`);
      }

      // Transform resume data to match template expectations
      const nameParts = (resumeData.personalInfo?.name || 'User').split(' ');
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
          github: resumeData.personalInfo?.github || '',
          photo: resumeData.personalInfo?.photo || profilePhoto || '',
        },
        summary: resumeData.personalInfo?.summary || resumeData.summary || '',
        experience: (resumeData.experience || []).map(exp => ({
          position: exp.position || 'Position',
          company: exp.company || 'Company',
          location: exp.location || resumeData.personalInfo?.location || '',
          startDate: exp.duration ? exp.duration.split(' - ')[0]?.trim() : (exp.startDate || 'Start'),
          endDate: exp.duration ? (exp.duration.split(' - ')[1]?.trim() || 'Present') : (exp.endDate || 'Present'),
          responsibilities: exp.achievements || exp.responsibilities || [],
        })),
        education: (resumeData.education || []).map(edu => {
          // Check if degree already contains " in " (e.g., "Bachelor of Technology in Civil Engineering")
          const degreeContainsField = edu.degree && edu.degree.match(/\s+in\s+/i);

          // If degree already contains the field, don't extract fieldOfStudy separately
          const extractedField = degreeContainsField
            ? ''
            : (edu.degree ? edu.degree.replace(/Bachelor of Technology in |Bachelor of Science in |Bachelor of Engineering in |Bachelor of Arts in |Bachelor of /gi, '') : 'Computer Science');

          return {
            degree: edu.degree || 'Bachelor of Science',
            fieldOfStudy: edu.fieldOfStudy || extractedField,
            institution: edu.school || edu.institution || 'University',
            startDate: edu.startDate || (edu.year ? (parseInt(edu.year) - 4).toString() : '2016'),
            endDate: edu.endDate || edu.year || '2020',
            gpa: edu.gpa || '',
          };
        }),
        skills: resumeData.skills || [],
        projects: (resumeData.projects || []).map(proj => ({
          name: proj.name || 'Project',
          description: proj.description || '',
          technologies: proj.technologies || [],
          startDate: proj.startDate || proj.date || '',
          endDate: proj.endDate || '',
          liveLink: proj.liveLink || '',
        })),
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        achievements: resumeData.achievements || [],
      };

      console.log('🔄 Generating PDF...');
      console.log('Transformed data:', transformedData);

      // Generate PDF with error handling
      let blob;
      try {
        blob = await pdf(<TemplateComponent resumeData={transformedData} />).toBlob();
        console.log('✅ PDF blob created, size:', blob.size, 'bytes');
      } catch (pdfError) {
        console.error('❌ PDF generation failed:', pdfError);
        console.error('PDF error details:', {
          message: pdfError.message,
          stack: pdfError.stack,
          componentName: componentName,
          dataKeys: Object.keys(transformedData)
        });
        throw new Error(`PDF generation failed: ${pdfError.message}`);
      }

      // Download PDF
      try {
        const fileName = `${resumeData.personalInfo?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`;
        console.log('💾 Creating download link for:', fileName);

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);

        console.log('✅ Download triggered successfully:', fileName);
        setIsGenerating(false);

        // Show success message
        alert(`Resume downloaded successfully as ${fileName}`);

      } catch (downloadError) {
        console.error('❌ Download trigger failed:', downloadError);
        throw new Error(`Failed to trigger download: ${downloadError.message}`);
      }

    } catch (error) {
      console.error('❌ Download process error:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        selectedTemplate: selectedTemplate,
        resumeDataKeys: Object.keys(resumeData),
        templatesAvailable: Object.keys(Templates)
      });

      setIsGenerating(false);

      // Show detailed error to user
      alert(`Download failed!\n\nError: ${error.message}\n\nPlease check the console for details and try again.`);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('🎯 Finish button clicked');

      // Get resumeId from URL params or sessionStorage
      const currentResumeId = searchParams.get("resumeId") ||
                              sessionStorage.getItem('resumeIdUsedForJobs') ||
                              sessionStorage.getItem('createdResumeId') ||
                              sessionStorage.getItem('uploadedResumeId');

      console.log('🔍 Checking resumeId sources:');
      console.log('  - URL params:', searchParams.get("resumeId"));
      console.log('  - resumeIdUsedForJobs:', sessionStorage.getItem('resumeIdUsedForJobs'));
      console.log('  - createdResumeId:', sessionStorage.getItem('createdResumeId'));
      console.log('  - uploadedResumeId:', sessionStorage.getItem('uploadedResumeId'));
      console.log('  - Final resumeId:', currentResumeId);

      // Check if we have a resumeId
      if (!currentResumeId) {
        console.error('❌ No resumeId found in any source');
        setError('Resume ID not found. Please try again from the template selection page.');
        setIsGenerating(false);
        return;
      }

      console.log('📤 Using resume_id:', currentResumeId);

      // Store resumeId in sessionStorage before API call
      sessionStorage.setItem('resumeIdUsedForJobs', currentResumeId);

      // Call the getJobsWithResumeId API (commenting out for now as per new API)
      // const response = await getJobsWithResumeId(currentResumeId, 20, 0, false);

      // Navigate to resume-complete page (the API call will happen there)
      console.log('✅ Navigating to resume-complete with resumeId stored');
      router.push("/resume-complete");

    } catch (err) {
      console.error('❌ Error in handleGenerate:', err);
      const errorMessage = handleApiError(err);
      logError('EnhancedResumePage - Finish', err);
      setError(errorMessage);
      setIsGenerating(false);
    }
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
            startDate: "",
            endDate: "",
            liveLink: "",
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
    // Switch to the appropriate tab in the new system
    handleTabClick(sectionName);
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

  // Tab system handlers
  // Section order state - default order
  const [sectionOrder, setSectionOrder] = useState([
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages"
  ]);

  // Temporary section order for editing (follows same pattern as tempFormData)
  const [tempSectionOrder, setTempSectionOrder] = useState(null);

  // Conditionally include Compare tab only for upload flow
  const tabs = [
    { id: "preview", label: "Preview", icon: Eye },
    ...(isFromUpload ? [{ id: "compare", label: "Compare", icon: GitCompare }] : []),
    { id: "arrangeSections", label: "Arrange Sections", icon: FileText },
    { id: "personalInfo", label: "Personal Info", icon: User },
    { id: "summary", label: "Professional Summary", icon: Star },
    { id: "education", label: "Education", icon: FileText },
    { id: "experience", label: "Work Experience", icon: Zap },
    { id: "projects", label: "Projects", icon: FileText },
    { id: "skills", label: "Skills", icon: Target },
    { id: "certifications", label: "Certifications", icon: Star },
    { id: "languages", label: "Languages", icon: Target },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === "preview" || tabId === "compare") {
      setActiveTab(tabId);
      // Don't clear tempFormData - keep it so edits persist when switching back to edit tabs
    } else {
      // Only initialize tempFormData if it doesn't exist yet
      // This preserves unsaved changes when switching between edit tabs
      if (!tempFormData) {
        setTempFormData(JSON.parse(JSON.stringify(resumeData)));
        // Also initialize profilePhoto from resumeData
        setProfilePhoto(resumeData?.personalInfo?.photo || null);
      }
      // Initialize tempSectionOrder when entering arrangeSections tab
      if (tabId === "arrangeSections" && !tempSectionOrder) {
        setTempSectionOrder([...sectionOrder]);
      }
      setActiveTab(tabId);
    }
  };

  const handleSaveForm = () => {
    if (tempFormData) {
      setResumeData(tempFormData);

      // Persist to sessionStorage to maintain data across sessions
      if (isFromUpload) {
        sessionStorage.setItem('enhancedResumeData', JSON.stringify(tempFormData));
      } else if (isFromAI) {
        sessionStorage.setItem('createdResumeData', JSON.stringify(tempFormData));
      }
    }
    // Save section order changes
    if (tempSectionOrder) {
      setSectionOrder(tempSectionOrder);
      setTempSectionOrder(null);
    }
    setActiveTab("preview");
    setTempFormData(null);
  };

  const handleCancelForm = () => {
    // Revert photo to the saved version
    setProfilePhoto(resumeData?.personalInfo?.photo || null);
    setActiveTab("preview");
    setTempFormData(null);
    setTempSectionOrder(null);
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
                <h2 className="font-bold mb-2" style={{fontSize: '13px', color: '#2563eb', marginBottom: '8px'}}>
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
              <h3 className="font-bold uppercase" style={{fontSize: '13px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Professional Summary</h3>
              <div style={{fontSize: '10px', color: '#374151', lineHeight: '1.5'}}>
                <EditableText field="personalInfo.summary" value={templateData.summary} className="text-gray-700" multiline={true} onSave={(value) => setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, summary: value}}))} />
              </div>
            </div>

            {/* Experience */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '13px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Experience</h3>
              {templateData.experience.map((exp, index) => (
                <div key={exp.id || index} style={{marginBottom: '10px'}}>
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
              <h3 className="font-bold uppercase" style={{fontSize: '13px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Skills</h3>
              <div style={{fontSize: '10px', color: '#374151', lineHeight: '1.5'}}>{templateData.skills.join(" • ")}</div>
            </div>

            {/* Education */}
            <div style={{marginBottom: '15px'}}>
              <h3 className="font-bold uppercase" style={{fontSize: '13px', color: '#2563eb', marginBottom: '8px', letterSpacing: '1px'}}>Education</h3>
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

  // Create progress bar element based on flow
  const progressBarElement = isFromAI ? (
    <ResumeBreadcrumbs currentStep={4} totalSteps={4} inNavbar={true} />
  ) : isFromUpload ? (
    <ResumeBreadcrumbs
      currentStep={6}
      totalSteps={6}
      inNavbar={true}
      steps={[
        { id: 1, label: 'Info', route: '/resume-confirmation?path=upload' },
        { id: 2, label: 'Upload', route: '/upload-resume' },
        { id: 3, label: 'Analyzing', route: '#' },
        { id: 4, label: 'Review', route: '#' },
        { id: 5, label: 'Template', route: '#' },
        { id: 6, label: 'Editor', route: '#' }
      ]}
    />
  ) : null;

  return (
    <DashboardLayout progressBar={progressBarElement}>
      <TextSelectionMenu onEnhance={handleEnhanceText} />

      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <style jsx>{`
        input::placeholder,
        textarea::placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-moz-placeholder,
        textarea::-moz-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input:-ms-input-placeholder,
        textarea:-ms-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
      `}</style>

      <style jsx>{`
        /* Custom scrollbar for tab navigation - Hidden but still scrollable */
        :global(.tab-scroll-container::-webkit-scrollbar) {
          display: none;
        }
        :global(.tab-scroll-container) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        /* Focus styles for input and textarea fields */
        :global(input:focus),
        :global(textarea:focus) {
          outline: 1px solid rgb(35, 112, 255) !important;
        }
      `}</style>

      <div className="w-full pb-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div
            className="rounded-xl shadow-sm border p-1 tab-scroll-container"
            style={{
              borderColor: "#E9F1FF",
              backgroundColor: "#E9F1FF",
              overflowX: "auto"
            }}
          >
            <div className="flex gap-2" style={{ minWidth: "max-content" }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg transition-all whitespace-nowrap"
                    style={{
                      background: isActive ? "#FFFFFF" : "transparent",
                      color: isActive ? "#002A79" : "#6477B4",
                      borderRadius: "8px",
                      border: isActive ? "1px solid #FFF" : "1px solid transparent",
                      boxShadow: isActive
                        ? "2px 2px 8px -2px rgba(0, 19, 88, 0.08)"
                        : "none",
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: '125%',
                      letterSpacing: '-0.32px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.opacity = "0.8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.opacity = "1";
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "preview" ? (
          <div className="w-full">
            {/* Preview Tab - Show Resume Preview */}
            <Card className="bg-white" style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F3F7',
              boxShadow: shadowBoxStyle,
              borderRadius: '16px'
            }}>
              <CardHeader className="p-4 border-b" style={{ borderColor: '#F1F3F7' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle style={{
                    color: colorTokens.title,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    Resume Preview
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleDownload}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: isGenerating ? '#9CA3AF' : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                        fontSize: '13px'
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span className="hidden sm:inline">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">PDF</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: isGenerating ? '#9CA3AF' : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                        fontSize: '13px'
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isGenerating ? "Finishing..." : "Finish"}</span>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-start" style={{ backgroundColor: colorTokens.bgLight, padding: '16px', borderRadius: '16px', gap: '16px' }}>
                  {/* ATS Score Panel - Left */}
                  <Card
                    className="hidden lg:block bg-white"
                    style={{
                      width: "230px",
                      flexShrink: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #F1F3F7',
                      boxShadow: shadowBoxStyle,
                      borderRadius: '16px',
                      position: 'sticky',
                      top: '80px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <CardHeader className="pb-3 border-b" style={{ borderColor: '#F1F3F7' }}>
                      <CardTitle style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600
                      }}>
                        ATS Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="text-center">
                        <div style={{
                          fontSize: '48px',
                          fontWeight: 700,
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1'
                        }}><span style={{ color: '#002A79' }}>94</span><span style={{ color: 'rgb(35, 112, 255)' }}>%</span></div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#002A79',
                          fontFamily: 'Inter, sans-serif',
                          marginTop: '8px',
                          marginBottom: '16px'
                        }}>Excellent score!</div>
                        <div style={{
                          width: '100%',
                          backgroundColor: colorTokens.bgLight,
                          borderRadius: '9999px',
                          height: '8px',
                          marginBottom: '20px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <div
                            style={{
                              background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                              height: '8px',
                              borderRadius: '9999px',
                              width: '94%'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div style={{ borderTop: '1px solid #F1F3F7', paddingTop: '16px' }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          marginBottom: '10px'
                        }}>Score Breakdown</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: colorTokens.paragraph, fontFamily: 'Inter, sans-serif' }}>Keywords Match</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#22C55E', fontFamily: 'Inter, sans-serif' }}>92%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: colorTokens.paragraph, fontFamily: 'Inter, sans-serif' }}>Formatting</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#22C55E', fontFamily: 'Inter, sans-serif' }}>96%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: colorTokens.paragraph, fontFamily: 'Inter, sans-serif' }}>Content Quality</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#22C55E', fontFamily: 'Inter, sans-serif' }}>94%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: colorTokens.paragraph, fontFamily: 'Inter, sans-serif' }}>Structure</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#F59E0B', fontFamily: 'Inter, sans-serif' }}>65%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resume Preview - Center */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="overflow-hidden"
                      style={{
                        width: isMobile ? "100%" : "100%",
                        height: "auto",
                        aspectRatio: "210/297",
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #F1F3F7',
                        boxShadow: shadowBoxStyle,
                      }}
                    >
                      <PDFPreview
                        templateId={selectedTemplate}
                        width="100%"
                        height="100%"
                        sectionOrder={sectionOrder}
                        resumeData={resumeData}
                      />
                    </div>
                  </div>

                  {/* Suggestions Panel - Right */}
                  <Card
                    className="hidden lg:block bg-white"
                    style={{
                      width: "300px",
                      flexShrink: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #F1F3F7',
                      boxShadow: shadowBoxStyle,
                      borderRadius: '16px',
                      position: 'sticky',
                      top: '80px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <CardHeader className="pb-3 border-b" style={{ borderColor: '#F1F3F7' }}>
                      <CardTitle style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600
                      }}>
                        Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {/* What's Good */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '10px'
                        }}>
                          <CheckCircle style={{ width: '16px', height: '16px', color: '#22C55E' }} />
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colorTokens.title,
                            fontFamily: 'Inter, sans-serif'
                          }}>What&apos;s Good</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#F0FDF4',
                            borderRadius: '8px',
                            border: '1px solid #DCFCE7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#166534', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Strong action verbs used in experience section
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#F0FDF4',
                            borderRadius: '8px',
                            border: '1px solid #DCFCE7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#166534', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Clear and concise professional summary
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#F0FDF4',
                            borderRadius: '8px',
                            border: '1px solid #DCFCE7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#166534', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Skills section is well-organized
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* What Needs Improvement */}
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '10px'
                        }}>
                          <AlertCircle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colorTokens.title,
                            fontFamily: 'Inter, sans-serif'
                          }}>Needs Improvement</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#FFFBEB',
                            borderRadius: '8px',
                            border: '1px solid #FEF3C7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#92400E', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Add more quantifiable achievements
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#FFFBEB',
                            borderRadius: '8px',
                            border: '1px solid #FEF3C7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#92400E', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Consider adding relevant certifications
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#FFFBEB',
                            borderRadius: '8px',
                            border: '1px solid #FEF3C7'
                          }}>
                            <span style={{ fontSize: '12px', color: '#92400E', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Include more industry keywords
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === "compare" ? (
          <div className="w-full">
            {(!originalResumeData || !enhancedResumeData) && (
              <div style={{
                backgroundColor: '#E9F1FF',
                border: '1px solid #2370FF',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <AlertCircle style={{ color: colorTokens.secondary600, width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{
                    color: colorTokens.title,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Preview Mode - Demo Data
                  </p>
                  <p style={{
                    color: colorTokens.paragraph,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    lineHeight: '1.5'
                  }}>
                    This is a demonstration of the comparison feature. Your actual resume data will appear here once available.
                  </p>
                </div>
              </div>
            )}

            {/* Legend - Enhanced Design */}
            <Card className="bg-white" style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F3F7',
              borderRadius: '16px',
              boxShadow: shadowBoxStyle,
              marginBottom: '24px',
              overflow: 'hidden'
            }}>
              <CardHeader className="p-4 border-b" style={{
                borderColor: '#F1F3F7',
                background: 'linear-gradient(135deg, #F8F9FF 0%, #FFFFFF 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info style={{ width: '18px', height: '18px', color: colorTokens.secondary600 }} />
                  <CardTitle style={{
                    color: colorTokens.title,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Comparison Guide
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent style={{
                padding: '16px 20px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px'
                }}>
                {/* AI Enhancement - Blue */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: colorTokens.bgLight,
                  borderRadius: '8px',
                  border: '1px solid #D6E3FF'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#C3D0FF',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1e3a8a'
                  }}>~</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.title,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>AI Enhanced</div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.paragraph,
                      fontWeight: 400,
                      marginTop: '2px'
                    }}>Optimized content</div>
                  </div>
                </div>

                {/* Added - Green */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: colorTokens.bgLight,
                  borderRadius: '8px',
                  border: '1px solid #D6E3FF'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#E2F8EA',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#166534'
                  }}>+</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.title,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>Added</div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.paragraph,
                      fontWeight: 400,
                      marginTop: '2px'
                    }}>New content</div>
                  </div>
                </div>


                {/* Modified - Yellow */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: colorTokens.bgLight,
                  borderRadius: '8px',
                  border: '1px solid #D6E3FF'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FAEDBF',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#92400e'
                  }}>≠</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.title,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>Modified</div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.paragraph,
                      fontWeight: 400,
                      marginTop: '2px'
                    }}>Changed value</div>
                  </div>
                </div>

                {/* Removed - Red */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: colorTokens.bgLight,
                  borderRadius: '8px',
                  border: '1px solid #D6E3FF'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FACDD0',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#991b1b'
                  }}>−</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.title,
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>Removed</div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: colorTokens.paragraph,
                      fontWeight: 400,
                      marginTop: '2px'
                    }}>Deleted content</div>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Resume Column */}
                <Card className="bg-white" style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F1F3F7',
                  boxShadow: shadowBoxStyle,
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <CardHeader className="p-4 border-b" style={{
                    borderColor: '#F1F3F7',
                    background: 'linear-gradient(135deg, #F8F9FF 0%, #FFFFFF 100%)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText style={{ width: '18px', height: '18px', color: colorTokens.paragraph }} />
                      <CardTitle style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '15px',
                        fontWeight: 600
                      }}>
                        Original Resume
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {/* Personal Info Comparison */}
                    <div className="mb-6">
                      <h3 style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '10px'
                      }}>Personal Information</h3>
                      <div className="space-y-2">
                        <CompareField
                          label="Name"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.name}
                          enhanced={resumeData.personalInfo?.name}
                          isOriginal={true}
                        />
                        <CompareField
                          label="Email"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.email}
                          enhanced={resumeData.personalInfo?.email}
                          isOriginal={true}
                        />
                        <CompareField
                          label="Phone"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.phone}
                          enhanced={resumeData.personalInfo?.phone}
                          isOriginal={true}
                        />
                      </div>
                    </div>

                    {/* Summary Comparison */}
                    {((originalResumeData || dummyOriginalData).summary || resumeData.summary) && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Professional Summary</h3>
                        <CompareText
                          original={(originalResumeData || dummyOriginalData).summary}
                          enhanced={resumeData.summary}
                          isOriginal={true}
                        />
                      </div>
                    )}

                    {/* Experience Comparison */}
                    {(originalResumeData || dummyOriginalData).experience?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Work Experience</h3>
                        {(originalResumeData || dummyOriginalData).experience.map((exp, index) => (
                          <div key={index} className="mb-4 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Position"
                              original={exp.position}
                              enhanced={resumeData.experience?.[index]?.position}
                              isOriginal={true}
                            />
                            <CompareField
                              label="Company"
                              original={exp.company}
                              enhanced={resumeData.experience?.[index]?.company}
                              isOriginal={true}
                            />
                            <div className="mt-2">
                              <p style={{
                                color: colorTokens.paragraph,
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: '4px'
                              }}>Responsibilities:</p>
                              {exp.achievements?.map((achievement, aIndex) => (
                                <CompareListItem
                                  key={aIndex}
                                  original={achievement}
                                  enhanced={resumeData.experience?.[index]?.achievements?.[aIndex]}
                                  isOriginal={true}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education Comparison */}
                    {(originalResumeData || dummyOriginalData).education?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Education</h3>
                        {(originalResumeData || dummyOriginalData).education.map((edu, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Degree"
                              original={edu.degree}
                              enhanced={resumeData.education?.[index]?.degree}
                              isOriginal={true}
                            />
                            <CompareField
                              label="Field"
                              original={edu.field}
                              enhanced={resumeData.education?.[index]?.field}
                              isOriginal={true}
                            />
                            <CompareField
                              label="Institution"
                              original={edu.institution}
                              enhanced={resumeData.education?.[index]?.institution}
                              isOriginal={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects Comparison */}
                    {(originalResumeData || dummyOriginalData).projects?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Projects</h3>
                        {(originalResumeData || dummyOriginalData).projects.map((proj, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Project Name"
                              original={proj.name}
                              enhanced={resumeData.projects?.[index]?.name}
                              isOriginal={true}
                            />
                            <CompareText
                              original={proj.description}
                              enhanced={resumeData.projects?.[index]?.description}
                              isOriginal={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills Comparison */}
                    {(originalResumeData || dummyOriginalData).skills?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Skills</h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {(originalResumeData || dummyOriginalData).skills.map((skill, index) => {
                            const enhancedHasSkill = resumeData.skills?.includes(skill);
                            const isRemoved = !enhancedHasSkill;
                            return (
                              <div
                                key={index}
                                style={{
                                  position: 'relative',
                                  padding: '8px 14px',
                                  paddingRight: isRemoved ? '20px' : '14px',
                                  borderRadius: '6px',
                                  backgroundColor: isRemoved ? '#FACDD0' : '#F8F9FF',
                                  border: `1px solid ${isRemoved ? '#f87171' : '#E1E4EB'}`,
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: isRemoved ? '#991b1b' : colorTokens.title,
                                  fontWeight: 500,
                                  overflow: 'hidden'
                                }}
                              >
                                {skill}
                                {isRemoved && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '-1px',
                                    right: '-1px',
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#dc2626',
                                    borderBottomLeftRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#fff'
                                  }}>
                                    −
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Certifications Comparison */}
                    {(originalResumeData || dummyOriginalData).certifications?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Certifications</h3>
                        {(originalResumeData || dummyOriginalData).certifications.map((cert, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Certification"
                              original={cert.name}
                              enhanced={resumeData.certifications?.[index]?.name}
                              isOriginal={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Languages Comparison */}
                    {(originalResumeData || dummyOriginalData).languages?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Languages</h3>
                        {(originalResumeData || dummyOriginalData).languages.map((lang, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Language"
                              original={lang.name}
                              enhanced={resumeData.languages?.[index]?.name}
                              isOriginal={true}
                            />
                            <CompareField
                              label="Proficiency"
                              original={lang.proficiency}
                              enhanced={resumeData.languages?.[index]?.proficiency}
                              isOriginal={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Resume Column */}
                <Card className="bg-white" style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F1F3F7',
                  boxShadow: shadowBoxStyle,
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <CardHeader className="p-4 border-b" style={{
                    borderColor: '#F1F3F7',
                    background: 'linear-gradient(135deg, #F8F9FF 0%, #FFFFFF 100%)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles style={{ width: '18px', height: '18px', color: colorTokens.secondary600 }} />
                      <CardTitle style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '15px',
                        fontWeight: 600
                      }}>
                        Current Resume
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {/* Personal Info Comparison */}
                    <div className="mb-6">
                      <h3 style={{
                        color: colorTokens.title,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '10px'
                      }}>Personal Information</h3>
                      <div className="space-y-2">
                        <CompareField
                          label="Name"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.name}
                          enhanced={resumeData.personalInfo?.name}
                          isOriginal={false}
                        />
                        <CompareField
                          label="Email"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.email}
                          enhanced={resumeData.personalInfo?.email}
                          isOriginal={false}
                        />
                        <CompareField
                          label="Phone"
                          original={(originalResumeData || dummyOriginalData).personalInfo?.phone}
                          enhanced={resumeData.personalInfo?.phone}
                          isOriginal={false}
                        />
                      </div>
                    </div>

                    {/* Summary Comparison */}
                    {((originalResumeData || dummyOriginalData).summary || resumeData.summary) && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Professional Summary</h3>
                        <CompareText
                          original={(originalResumeData || dummyOriginalData).summary}
                          enhanced={resumeData.summary}
                          isOriginal={false}
                        />
                      </div>
                    )}

                    {/* Experience Comparison */}
                    {resumeData.experience?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Work Experience</h3>
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="mb-4 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Position"
                              original={(originalResumeData || dummyOriginalData).experience?.[index]?.position}
                              enhanced={exp.position}
                              isOriginal={false}
                            />
                            <CompareField
                              label="Company"
                              original={(originalResumeData || dummyOriginalData).experience?.[index]?.company}
                              enhanced={exp.company}
                              isOriginal={false}
                            />
                            <div className="mt-2">
                              <p style={{
                                color: colorTokens.paragraph,
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: '4px'
                              }}>Responsibilities:</p>
                              {exp.achievements?.map((achievement, aIndex) => (
                                <CompareListItem
                                  key={aIndex}
                                  original={(originalResumeData || dummyOriginalData).experience?.[index]?.achievements?.[aIndex]}
                                  enhanced={achievement}
                                  isOriginal={false}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education Comparison */}
                    {resumeData.education?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Education</h3>
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Degree"
                              original={(originalResumeData || dummyOriginalData).education?.[index]?.degree}
                              enhanced={edu.degree}
                              isOriginal={false}
                            />
                            <CompareField
                              label="Field"
                              original={(originalResumeData || dummyOriginalData).education?.[index]?.field}
                              enhanced={edu.field}
                              isOriginal={false}
                            />
                            <CompareField
                              label="Institution"
                              original={(originalResumeData || dummyOriginalData).education?.[index]?.institution}
                              enhanced={edu.institution}
                              isOriginal={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects Comparison */}
                    {resumeData.projects?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Projects</h3>
                        {resumeData.projects.map((proj, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Project Name"
                              original={(originalResumeData || dummyOriginalData).projects?.[index]?.name}
                              enhanced={proj.name}
                              isOriginal={false}
                            />
                            <CompareText
                              original={(originalResumeData || dummyOriginalData).projects?.[index]?.description}
                              enhanced={proj.description}
                              isOriginal={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills Comparison */}
                    {resumeData.skills?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Skills</h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {resumeData.skills.map((skill, index) => {
                            const originalHasSkill = (originalResumeData || dummyOriginalData).skills?.includes(skill);
                            const isAdded = !originalHasSkill;
                            return (
                              <div
                                key={index}
                                style={{
                                  position: 'relative',
                                  padding: '8px 14px',
                                  paddingRight: isAdded ? '20px' : '14px',
                                  borderRadius: '6px',
                                  backgroundColor: isAdded ? '#E2F8EA' : '#F8F9FF',
                                  border: `1px solid ${isAdded ? '#86efac' : '#E1E4EB'}`,
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: isAdded ? '#166534' : colorTokens.title,
                                  fontWeight: 500,
                                  overflow: 'hidden'
                                }}
                              >
                                {skill}
                                {isAdded && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '-1px',
                                    right: '-1px',
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#16a34a',
                                    borderBottomLeftRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#fff'
                                  }}>
                                    +
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Certifications Comparison */}
                    {resumeData.certifications?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Certifications</h3>
                        {resumeData.certifications.map((cert, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Certification"
                              original={(originalResumeData || dummyOriginalData).certifications?.[index]?.name}
                              enhanced={cert.name}
                              isOriginal={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Languages Comparison */}
                    {resumeData.languages?.length > 0 && (
                      <div className="mb-6">
                        <h3 style={{
                          color: colorTokens.title,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '10px'
                        }}>Languages</h3>
                        {resumeData.languages.map((lang, index) => (
                          <div key={index} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FF' }}>
                            <CompareField
                              label="Language"
                              original={(originalResumeData || dummyOriginalData).languages?.[index]?.name}
                              enhanced={lang.name}
                              isOriginal={false}
                            />
                            <CompareField
                              label="Proficiency"
                              original={(originalResumeData || dummyOriginalData).languages?.[index]?.proficiency}
                              enhanced={lang.proficiency}
                              isOriginal={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Form Tabs - Show Section Form */}
            <Card className="bg-white" style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F3F7',
              boxShadow: shadowBoxStyle,
              borderRadius: '16px'
            }}>
              <CardHeader className="pb-3 lg:pb-4 border-b" style={{ borderColor: '#F1F3F7' }}>
                <div className="flex items-center justify-between">
                  <CardTitle style={{
                    color: colorTokens.title,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    Edit {tabs.find(t => t.id === activeTab)?.label}
                  </CardTitle>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelForm}
                      className="px-4 py-2 rounded-lg transition-all hover:opacity-90"
                      style={{
                        border: '1px solid #E1E4EB',
                        background: '#F8F9FF',
                        color: '#6477B4',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveForm}
                      className="px-4 py-2 rounded-lg transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        fontSize: '13px'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="w-full max-w-4xl mx-auto">
                  {/* Form content based on active tab */}
                  {activeTab === "personalInfo" && tempFormData && (
                    <div className="space-y-4">
                      {/* Photo Upload - Only show if template supports it */}
                      {currentTemplate?.hasPhoto && (
                        <div>
                          <label style={labelStyles}>Profile Photo</label>
                          <div
                            onClick={handlePhotoClick}
                            style={{
                              ...inputStyles,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              cursor: 'pointer',
                              minHeight: '100px',
                              padding: '16px'
                            }}
                          >
                            <div
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '2px solid #E1E4EB',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#FFFFFF',
                                flexShrink: 0
                              }}
                            >
                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt="Profile"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <Camera style={{ height: '32px', width: '32px', color: '#9CA3AF' }} />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{
                                fontSize: '13px',
                                color: colorTokens.paragraph,
                                marginBottom: '4px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500
                              }}>
                                {profilePhoto ? 'Click to change photo' : 'Click to upload photo'}
                              </p>
                              <p style={{
                                fontSize: '12px',
                                color: '#9CA3AF',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Recommended: Square image, max 5MB
                              </p>
                            </div>
                          </div>
                          {profilePhoto && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setProfilePhoto(null);
                                // Only update tempFormData - don't auto-save to resumeData
                                setTempFormData(prev => ({
                                  ...prev,
                                  personalInfo: { ...prev.personalInfo, photo: null }
                                }));
                              }}
                              style={{
                                marginTop: '8px',
                                fontSize: '12px',
                                color: '#EF4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                fontFamily: 'Inter, sans-serif'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.color = '#DC2626'}
                              onMouseOut={(e) => e.currentTarget.style.color = '#EF4444'}
                            >
                              Remove photo
                            </button>
                          )}
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ display: 'none' }}
                          />
                        </div>
                      )}

                      <div>
                        <label style={labelStyles}>Full Name</label>
                        <input
                          type="text"
                          value={tempFormData.personalInfo.name}
                          onChange={(e) => setTempFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, name: e.target.value }
                          }))}
                          placeholder="Your Name"
                          style={inputStyles}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyles}>Title/Position</label>
                          <input
                            type="text"
                            value={tempFormData.personalInfo.title}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, title: e.target.value }
                            }))}
                            placeholder="Software Engineer"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>Email</label>
                          <input
                            type="email"
                            value={tempFormData.personalInfo.email}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value }
                            }))}
                            placeholder="your.email@example.com"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>Phone</label>
                          <input
                            type="tel"
                            value={tempFormData.personalInfo.phone}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value }
                            }))}
                            placeholder="+1 (555) 123-4567"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>Location</label>
                          <input
                            type="text"
                            value={tempFormData.personalInfo.location}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, location: e.target.value }
                            }))}
                            placeholder="City, Country"
                            style={inputStyles}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyles}>LinkedIn (Optional)</label>
                          <input
                            type="url"
                            value={tempFormData.personalInfo.linkedin || ''}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                            }))}
                            placeholder="https://linkedin.com/in/yourprofile"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>GitHub (Optional)</label>
                          <input
                            type="url"
                            value={tempFormData.personalInfo.github || ''}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, github: e.target.value }
                            }))}
                            placeholder="https://github.com/yourusername"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>Portfolio (Optional)</label>
                          <input
                            type="url"
                            value={tempFormData.personalInfo.portfolio || ''}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                            }))}
                            placeholder="https://yourportfolio.com"
                            style={inputStyles}
                          />
                        </div>
                        <div>
                          <label style={labelStyles}>Other Link (Optional)</label>
                          <input
                            type="url"
                            value={tempFormData.personalInfo.website || ''}
                            onChange={(e) => setTempFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, website: e.target.value }
                            }))}
                            placeholder="https://yourwebsite.com"
                            style={inputStyles}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "summary" && tempFormData && (
                    <div className="space-y-4">
                      <div>
                        <label style={labelStyles}>Professional Summary</label>
                        <textarea
                          value={tempFormData.personalInfo.summary}
                          onChange={(e) => setTempFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, summary: e.target.value }
                          }))}
                          placeholder="Write a brief professional summary..."
                          rows={8}
                          style={textareaStyles}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "arrangeSections" && tempSectionOrder && (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <p style={{
                          ...labelStyles,
                          marginBottom: '10px'
                        }}>
                          Drag and drop sections to reorder them on your resume. Header and Summary will remain at the top.
                        </p>
                      </div>
                      <div className="space-y-2">
                        {tempSectionOrder.map((sectionId, index) => {
                          const sectionLabels = {
                            experience: "Work Experience",
                            education: "Education",
                            projects: "Projects",
                            skills: "Skills",
                            certifications: "Certifications",
                            languages: "Languages"
                          };

                          return (
                            <div
                              key={sectionId}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/html", index.toString());
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const dragIndex = parseInt(e.dataTransfer.getData("text/html"));
                                const dropIndex = index;

                                if (dragIndex === dropIndex) return;

                                const newOrder = [...tempSectionOrder];
                                const [removed] = newOrder.splice(dragIndex, 1);
                                newOrder.splice(dropIndex, 0, removed);
                                setTempSectionOrder(newOrder);
                              }}
                              className="cursor-move transition-all"
                              style={{
                                minHeight: 56,
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 12,
                                paddingBottom: 12,
                                backgroundColor: colorTokens.bgLight,
                                borderRadius: 16,
                                border: 'none',
                                boxShadow: "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
                                outline: "1px solid #C7D6ED",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div style={{
                                  fontSize: '18px',
                                  color: 'rgb(15, 38, 120)',
                                  opacity: 0.5
                                }}>
                                  ⋮⋮
                                </div>
                                <div style={{
                                  flex: 1,
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: "rgb(15, 38, 120)",
                                  letterSpacing: "-0.32px",
                                }}>
                                  {sectionLabels[sectionId]}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: 'rgb(15, 38, 120)',
                                  fontFamily: 'Inter, sans-serif',
                                  opacity: 0.6
                                }}>
                                  Position {index + 1}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "education" && tempFormData && (
                    <div className="space-y-4">
                      {tempFormData.education.map((edu, index) => (
                        <div key={edu.id || index} className="p-4 rounded-lg space-y-3" style={{ border: '1px solid #E1E4EB', background: '#F8F9FF' }}>
                          <div className="flex justify-between items-center">
                            <h4 style={{ color: colorTokens.title, fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Education {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newEducation = tempFormData.education.filter((_, i) => i !== index);
                                setTempFormData(prev => ({ ...prev, education: newEducation }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div>
                            <label style={labelStyles}>Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEducation = [...tempFormData.education];
                                newEducation[index].degree = e.target.value;
                                setTempFormData(prev => ({ ...prev, education: newEducation }));
                              }}
                              placeholder="Bachelor of Science in Computer Science"
                              style={inputStyles}
                            />
                          </div>
                          <div>
                            <label style={labelStyles}>School/University</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => {
                                const newEducation = [...tempFormData.education];
                                newEducation[index].school = e.target.value;
                                setTempFormData(prev => ({ ...prev, education: newEducation }));
                              }}
                              placeholder="University Name"
                              style={inputStyles}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label style={labelStyles}>Start Date</label>
                              <input
                                type="month"
                                value={edu.startDate || ''}
                                onChange={(e) => {
                                  const newEducation = [...tempFormData.education];
                                  newEducation[index].startDate = e.target.value;
                                  setTempFormData(prev => ({ ...prev, education: newEducation }));
                                }}
                                placeholder="2020-09"
                                style={dateInputStyles}
                              />
                            </div>
                            <div>
                              <label style={labelStyles}>End Date</label>
                              <input
                                type="month"
                                value={edu.endDate || ''}
                                onChange={(e) => {
                                  const newEducation = [...tempFormData.education];
                                  newEducation[index].endDate = e.target.value;
                                  setTempFormData(prev => ({ ...prev, education: newEducation }));
                                }}
                                placeholder="2024-05"
                                style={dateInputStyles}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({
                            ...prev,
                            education: [...prev.education, { id: Date.now(), degree: '', school: '', startDate: '', endDate: '' }]
                          }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Education
                      </button>
                    </div>
                  )}

                  {activeTab === "experience" && tempFormData && (
                    <div className="space-y-4">
                      {tempFormData.experience.map((exp, index) => (
                        <div key={exp.id || index} className="p-4 rounded-lg space-y-3" style={{ border: '1px solid #E1E4EB', background: '#F8F9FF' }}>
                          <div className="flex justify-between items-center">
                            <h4 style={{ color: colorTokens.title, fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Experience {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newExperience = tempFormData.experience.filter((_, i) => i !== index);
                                setTempFormData(prev => ({ ...prev, experience: newExperience }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div>
                            <label style={labelStyles}>Position</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const newExperience = [...tempFormData.experience];
                                newExperience[index].position = e.target.value;
                                setTempFormData(prev => ({ ...prev, experience: newExperience }));
                              }}
                              placeholder="Senior Software Engineer"
                              style={inputStyles}
                            />
                          </div>
                          <div>
                            <label style={labelStyles}>Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const newExperience = [...tempFormData.experience];
                                newExperience[index].company = e.target.value;
                                setTempFormData(prev => ({ ...prev, experience: newExperience }));
                              }}
                              placeholder="Company Name"
                              style={inputStyles}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label style={labelStyles}>Start Date</label>
                              <input
                                type="month"
                                value={exp.startDate || ''}
                                onChange={(e) => {
                                  const newExperience = [...tempFormData.experience];
                                  newExperience[index].startDate = e.target.value;
                                  // Update duration field as well
                                  const endDate = newExperience[index].endDate;
                                  newExperience[index].duration = e.target.value && endDate ?
                                    `${e.target.value} - ${endDate}` :
                                    e.target.value ? `${e.target.value} - Present` : '';
                                  setTempFormData(prev => ({ ...prev, experience: newExperience }));
                                }}
                                placeholder="2022-01"
                                style={dateInputStyles}
                              />
                            </div>
                            <div>
                              <label style={labelStyles}>End Date (Leave empty if current)</label>
                              <input
                                type="month"
                                value={exp.endDate || ''}
                                onChange={(e) => {
                                  const newExperience = [...tempFormData.experience];
                                  newExperience[index].endDate = e.target.value;
                                  // Update duration field as well
                                  const startDate = newExperience[index].startDate;
                                  newExperience[index].duration = startDate && e.target.value ?
                                    `${startDate} - ${e.target.value}` :
                                    startDate ? `${startDate} - Present` : '';
                                  setTempFormData(prev => ({ ...prev, experience: newExperience }));
                                }}
                                placeholder="2024-12"
                                style={dateInputStyles}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={labelStyles}>Achievements</label>
                            {exp.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex gap-2 mb-2">
                                <textarea
                                  value={achievement}
                                  onChange={(e) => {
                                    const newExperience = [...tempFormData.experience];
                                    newExperience[index].achievements[achIndex] = e.target.value;
                                    setTempFormData(prev => ({ ...prev, experience: newExperience }));
                                  }}
                                  placeholder="Achievement description"
                                  rows={2}
                                  style={textareaStyles}
                                />
                                <button
                                  onClick={() => {
                                    const newExperience = [...tempFormData.experience];
                                    newExperience[index].achievements = newExperience[index].achievements.filter((_, i) => i !== achIndex);
                                    setTempFormData(prev => ({ ...prev, experience: newExperience }));
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newExperience = [...tempFormData.experience];
                                newExperience[index].achievements.push('');
                                setTempFormData(prev => ({ ...prev, experience: newExperience }));
                              }}
                              className="text-sm px-3 py-1 rounded transition-all hover:opacity-90"
                              style={{ color: '#6477B4' }}
                            >
                              + Add Achievement
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({
                            ...prev,
                            experience: [...prev.experience, { id: Date.now(), position: '', company: '', startDate: '', endDate: '', achievements: [''] }]
                          }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Experience
                      </button>
                    </div>
                  )}

                  {activeTab === "projects" && tempFormData && (
                    <div className="space-y-4">
                      {tempFormData.projects.map((project, index) => (
                        <div key={project.id || index} className="p-4 rounded-lg space-y-3" style={{ border: '1px solid #E1E4EB', background: '#F8F9FF' }}>
                          <div className="flex justify-between items-center">
                            <h4 style={{ color: colorTokens.title, fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Project {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newProjects = tempFormData.projects.filter((_, i) => i !== index);
                                setTempFormData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div>
                            <label style={labelStyles}>Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => {
                                const newProjects = [...tempFormData.projects];
                                newProjects[index].name = e.target.value;
                                setTempFormData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="E-Commerce Platform"
                              style={inputStyles}
                            />
                          </div>
                          <div>
                            <label style={labelStyles}>Description</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...tempFormData.projects];
                                newProjects[index].description = e.target.value;
                                setTempFormData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="Brief description of the project"
                              rows={3}
                              style={textareaStyles}
                            />
                          </div>
                          <div>
                            <label style={labelStyles}>Technologies (comma separated)</label>
                            <input
                              type="text"
                              value={project.technologies?.join(', ') || ''}
                              onChange={(e) => {
                                const newProjects = [...tempFormData.projects];
                                newProjects[index].technologies = e.target.value.split(',').map(t => t.trim());
                                setTempFormData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="React, Node.js, MongoDB"
                              style={inputStyles}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label style={labelStyles}>Start Date</label>
                              <input
                                type="month"
                                value={project.startDate || ''}
                                onChange={(e) => {
                                  const newProjects = [...tempFormData.projects];
                                  newProjects[index].startDate = e.target.value;
                                  setTempFormData(prev => ({ ...prev, projects: newProjects }));
                                }}
                                placeholder="2023-01"
                                style={dateInputStyles}
                              />
                            </div>
                            <div>
                              <label style={labelStyles}>End Date (Leave empty if ongoing)</label>
                              <input
                                type="month"
                                value={project.endDate || ''}
                                onChange={(e) => {
                                  const newProjects = [...tempFormData.projects];
                                  newProjects[index].endDate = e.target.value;
                                  setTempFormData(prev => ({ ...prev, projects: newProjects }));
                                }}
                                placeholder="2023-12"
                                style={dateInputStyles}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={labelStyles}>Live Link (Optional)</label>
                            <input
                              type="url"
                              value={project.liveLink || ''}
                              onChange={(e) => {
                                console.log('🔗 Live Link changed:', e.target.value);
                                const newProjects = [...tempFormData.projects];
                                newProjects[index].liveLink = e.target.value;
                                console.log('🔗 Updated project:', newProjects[index]);
                                setTempFormData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="https://yourproject.com"
                              style={inputStyles}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({
                            ...prev,
                            projects: [...prev.projects, { id: Date.now(), name: '', description: '', technologies: [], startDate: '', endDate: '', liveLink: '' }]
                          }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Project
                      </button>
                    </div>
                  )}

                  {activeTab === "skills" && tempFormData && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: colorTokens.title }}>Skills</label>
                      {tempFormData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...tempFormData.skills];
                              newSkills[index] = e.target.value;
                              setTempFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            placeholder="Skill name"
                            style={inputStyles}
                          />
                          <button
                            onClick={() => {
                              const newSkills = tempFormData.skills.filter((_, i) => i !== index);
                              setTempFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            className="px-3 py-2 rounded-lg transition-all hover:bg-red-100"
                            style={{ color: '#EF4444' }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Skill
                      </button>
                    </div>
                  )}

                  {activeTab === "certifications" && tempFormData && (
                    <div className="space-y-4">
                      {tempFormData.certifications.map((cert, index) => (
                        <div key={cert.id || index} className="p-4 rounded-lg space-y-3" style={{ border: '1px solid #E1E4EB', background: '#F8F9FF' }}>
                          <div className="flex justify-between items-center">
                            <h4 style={{ color: colorTokens.title, fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Certification {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newCerts = tempFormData.certifications.filter((_, i) => i !== index);
                                setTempFormData(prev => ({ ...prev, certifications: newCerts }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div>
                            <label style={labelStyles}>Certification Name</label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => {
                                const newCerts = [...tempFormData.certifications];
                                newCerts[index].name = e.target.value;
                                setTempFormData(prev => ({ ...prev, certifications: newCerts }));
                              }}
                              placeholder="AWS Certified Developer"
                              style={inputStyles}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label style={labelStyles}>Issuer</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => {
                                  const newCerts = [...tempFormData.certifications];
                                  newCerts[index].issuer = e.target.value;
                                  setTempFormData(prev => ({ ...prev, certifications: newCerts }));
                                }}
                                placeholder="Amazon Web Services"
                                style={inputStyles}
                              />
                            </div>
                            <div>
                              <label style={labelStyles}>Year</label>
                              <input
                                type="text"
                                value={cert.year}
                                onChange={(e) => {
                                  const newCerts = [...tempFormData.certifications];
                                  newCerts[index].year = e.target.value;
                                  setTempFormData(prev => ({ ...prev, certifications: newCerts }));
                                }}
                                placeholder="2023"
                                style={inputStyles}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({
                            ...prev,
                            certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', year: '' }]
                          }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Certification
                      </button>
                    </div>
                  )}

                  {activeTab === "languages" && tempFormData && (
                    <div className="space-y-4">
                      {tempFormData.languages.map((lang, index) => (
                        <div key={lang.id || index} className="p-4 rounded-lg space-y-3" style={{ border: '1px solid #E1E4EB', background: '#F8F9FF' }}>
                          <div className="flex justify-between items-center">
                            <h4 style={{ color: colorTokens.title, fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Language {index + 1}</h4>
                            <button
                              onClick={() => {
                                const newLangs = tempFormData.languages.filter((_, i) => i !== index);
                                setTempFormData(prev => ({ ...prev, languages: newLangs }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label style={labelStyles}>Language</label>
                              <input
                                type="text"
                                value={lang.name}
                                onChange={(e) => {
                                  const newLangs = [...tempFormData.languages];
                                  newLangs[index].name = e.target.value;
                                  setTempFormData(prev => ({ ...prev, languages: newLangs }));
                                }}
                                placeholder="English"
                                style={inputStyles}
                              />
                            </div>
                            <div>
                              <label style={labelStyles}>Proficiency Level</label>
                              <input
                                type="text"
                                value={lang.level}
                                onChange={(e) => {
                                  const newLangs = [...tempFormData.languages];
                                  newLangs[index].level = e.target.value;
                                  setTempFormData(prev => ({ ...prev, languages: newLangs }));
                                }}
                                placeholder="Fluent"
                                style={inputStyles}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setTempFormData(prev => ({
                            ...prev,
                            languages: [...prev.languages, { id: Date.now(), name: '', level: '' }]
                          }));
                        }}
                        className="w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid #E1E4EB',
                          background: '#F8F9FF',
                          color: '#6477B4',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Language
                      </button>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* OLD LAYOUT - HIDDEN FOR NOW */}
        <div style={{ display: 'none' }}>
        <div
          className="grid grid-cols-1 gap-4 lg:gap-6 transition-all duration-300"
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
              <div className="bg-white p-2" style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #F1F3F7',
                boxShadow: shadowBoxStyle,
                borderRadius: '16px'
              }}>
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-full p-2 hover:bg-gray-50 rounded transition-colors"
                  style={{ color: colorTokens.paragraph }}
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            ) : (
              <Card className="bg-white" style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #F1F3F7',
                boxShadow: shadowBoxStyle,
                borderRadius: '16px'
              }}>
                <CardHeader className="pb-3 lg:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2" style={{
                      color: colorTokens.title,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500
                    }}>
                      <FileText className="h-4 w-4" style={{ color: colorTokens.secondary600 }} />
                      Resume Sections
                    </CardTitle>
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="p-1 hover:bg-gray-50 rounded transition-colors lg:block hidden"
                      style={{ color: colorTokens.paragraph }}
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
                : "col-span-1 md:col-span-2 lg:col-span-2"
            } order-1 md:order-2 lg:order-2 transition-all duration-300`}
          >
            <Card className="bg-white" style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F3F7',
              boxShadow: shadowBoxStyle,
              borderRadius: '16px'
            }}>
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle style={{
                    color: colorTokens.title,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500
                  }}>
                    Resume Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-2 transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: isGenerating ? '#9CA3AF' : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                        fontSize: '12px'
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-2 transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        fontSize: '12px'
                      }}
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>AI Enhance</span>
                    </button>
                    <button
                      onClick={handlePrev}
                      className="flex items-center gap-1 px-3 py-2 transition-all hover:opacity-90"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(35, 112, 255, 0.30)',
                        background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                        boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                        ...buttonTextStyles,
                        fontSize: '12px'
                      }}
                    >
                      <Settings className="h-3 w-3" />
                      <span>Templates</span>
                    </button>
                  </div>
                  {currentTemplate && (
                    <div className="text-sm text-gray-600 mt-2">
                      Current template: <span className="font-medium">{currentTemplate.name}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="bg-gray-50 p-2 lg:p-4 rounded-lg flex justify-center">
                  <div
                    className="bg-white border border-gray-200 shadow-lg overflow-hidden"
                    style={{
                      aspectRatio: "210/297",
                      width: isMobile ? "100%" : "620px",
                      height: "auto",
                    }}
                  >
                    <PDFPreview
                      key={JSON.stringify(resumeData)}
                      templateId={selectedTemplate}
                      width="100%"
                      height="100%"
                      sectionOrder={sectionOrder}
                      resumeData={resumeData}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        </div> {/* END OLD LAYOUT - HIDDEN */}


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
                        sectionOrder={sectionOrder}
                        resumeData={resumeData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
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
