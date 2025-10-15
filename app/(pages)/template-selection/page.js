"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Star,
  User,
  Briefcase,
} from "lucide-react";
import { DashboardLayout, useSidebar } from "@/components/layout/dashboard-layout";
import { allTemplates } from "@/components/pdf-templates";
import dynamic from 'next/dynamic';
import { enhanceResume, createResumeFromPrompt } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";
import ResumeBreadcrumbs from "@/components/ResumeBreadcrumbs";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
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

function TemplateSelectionContent() {
  const [selectedTemplate, setSelectedTemplate] = useState("aa97e710-4457-46fb-ac6f-1765ad3a6d43");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get sidebar collapsed state
  const { collapsed } = useSidebar();

  // Enhanced filter states - using arrays for multi-select
  const [filters, setFilters] = useState({
    categories: [],
    headshots: [],
  });

  useEffect(() => {
    // Get user name from prompt or use default
    const prompt = searchParams.get("prompt") || "";
    const nameMatch = prompt.match(/I'm\s+\*\*([A-Za-z]+)\*\*/);
    const extractedName = nameMatch ? nameMatch[1] : "there";
    setUserName(extractedName);
  }, [searchParams]);

  // Enhanced templates with PDF templates
  const templates = allTemplates.map((template, index) => ({
    ...template,
    isRecommended: index < 4,
    style: template.category === 'internship' ? 'modern' : 'professional',
  }));

  const handleTemplateSelect = (templateId) => {
    console.log('✅ Template Selected - UUID:', templateId);
    setSelectedTemplate(templateId);

    // Scroll to the selected template in the carousel
    setTimeout(() => {
      const element = document.getElementById(`template-${templateId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentArray = prev[filterType];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [filterType]: newArray,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      headshots: [],
    });
  };

  const filteredTemplates = templates.filter((template) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(template.category)) {
      return false;
    }
    // Headshot filter
    if (filters.headshots.length > 0) {
      if (filters.headshots.includes("with") && !template.hasPhoto) return false;
      if (filters.headshots.includes("without") && template.hasPhoto) return false;
      // If both are selected, show all
      if (filters.headshots.includes("with") && filters.headshots.includes("without")) return true;
    }
    return true;
  });

  const handleContinue = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Sending template UUID to backend:', selectedTemplate);

      const isFromUpload = searchParams.get("from") === "upload";

      if (isFromUpload) {
        // If from upload flow, call enhance API with selected template
        const resumeId = sessionStorage.getItem('uploadedResumeId');
        if (!resumeId) {
          throw new Error('Resume ID not found. Please upload your resume again.');
        }

        console.log('📤 Calling enhanceResume API with UUID:', selectedTemplate);
        const response = await enhanceResume(resumeId, selectedTemplate); // Pass template ID

        if (response.success) {
          // Store the enhanced data and navigate
          sessionStorage.setItem('enhancedResumeData', JSON.stringify(response.data));
          sessionStorage.setItem('selectedTemplateId', selectedTemplate); // Store template ID
          const params = new URLSearchParams(searchParams);
          params.set("template", selectedTemplate);
          params.set("resumeId", resumeId);
          params.set("from", "upload");
          router.push(`/enhanced-resume?${params.toString()}`);
        } else {
          setError(response.message || 'Failed to enhance resume');
          setLoading(false);
        }
      } else {
        // If from AI prompt flow, call createResumeFromPrompt API with selected template
        const userPrompt = sessionStorage.getItem('userPrompt') || searchParams.get("prompt");
        if (!userPrompt) {
          throw new Error('Prompt not found. Please go back and enter your details.');
        }

        console.log('📤 Calling createResumeFromPrompt API with UUID:', selectedTemplate);
        const response = await createResumeFromPrompt(
          userPrompt,
          'My Resume',
          selectedTemplate // Pass the selected template ID
        );

        if (response.success) {
          // Store the resume data and navigate
          sessionStorage.setItem('createdResumeId', response.data.resume_id);
          sessionStorage.setItem('createdResumeData', JSON.stringify(response.data));
          sessionStorage.setItem('selectedTemplateId', selectedTemplate); // Store template ID
          const params = new URLSearchParams(searchParams);
          params.set("template", selectedTemplate);
          params.set("resumeId", response.data.resume_id);
          params.set("from", "ai");
          router.push(`/enhanced-resume?${params.toString()}`);
        } else {
          setError(response.message || 'Failed to create resume');
          setLoading(false);
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      logError('TemplateSelectionPage', err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handlePrev = () => {
    const isFromUpload = searchParams.get("from") === "upload";
    if (isFromUpload) {
      router.push("/resume-review");
    } else {
      router.push("/ai-prompt");
    }
  };

  const selectedTemplateData = filteredTemplates.find(t => t.id === selectedTemplate);

  // Determine step based on flow
  const isFromUpload = searchParams.get("from") === "upload";
  const currentStep = isFromUpload ? 5 : 3;
  const totalSteps = isFromUpload ? 7 : 6;

  // Prepare progress bar
  const progressBarElement = isFromUpload ? (
    <ResumeBreadcrumbs
      currentStep={5}
      totalSteps={6}
      inNavbar={true}
      steps={[
        { id: 1, label: "Info", route: "/resume-confirmation?path=upload" },
        { id: 2, label: "Upload", route: "/upload-resume" },
        { id: 3, label: "Analyzing", route: "#" },
        { id: 4, label: "Review", route: "/resume-review" },
        { id: 5, label: "Template", route: "#" },
        { id: 6, label: "Editor", route: "#" },
      ]}
    />
  ) : (
    <ResumeBreadcrumbs currentStep={3} totalSteps={4} inNavbar={true} />
  );

  return (
    <DashboardLayout progressBar={progressBarElement}>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%)",
          paddingBottom: "140px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Banner */}
          <div
            className="relative py-6 px-8 overflow-hidden flex items-center mb-6"
            style={{
              backgroundImage: "url(/header-banner.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100px",
              boxShadow: "0 4px 20px 0 #2370FF66",
              borderRadius: "16px",
            }}
          >
            <div className="relative z-10">
              <h1
                className="text-white font-bold"
                style={{
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: "32px",
                  lineHeight: "1.2",
                }}
              >
                Choose Your Perfect Template
              </h1>
            </div>
          </div>

          {/* Main Layout: Filters Left, Templates Right */}
          <div className="flex gap-6" style={{ position: "relative" }}>
            {/* Left Sidebar - Sticky Filters */}
            <div style={{ width: "280px", flexShrink: 0 }}>
              <div style={{ position: "sticky", top: "80px", zIndex: 10 }}>
                <div
                  className="bg-white rounded-xl p-5"
                  style={{
                    border: "1px solid #F1F3F7",
                    boxShadow:
                      "0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)",
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      className="font-semibold"
                      style={{
                        color: "#0f2678",
                        fontSize: "14px",
                      }}
                    >
                      Filters
                    </h2>
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium hover:opacity-70 transition-all"
                      style={{ color: colorTokens.secondary600 }}
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-5">
                    <label
                      className="text-sm font-semibold mb-3 block"
                      style={{ color: "#0F2678", fontSize: "14px" }}
                    >
                      Category
                    </label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="18"
                            height="18"
                            rx="5"
                            fill={
                              filters.categories.includes("internship")
                                ? "#2370FF"
                                : "#FFFFFF"
                            }
                            stroke={
                              filters.categories.includes("internship")
                                ? "#2370FF"
                                : "#C0CCDE"
                            }
                            strokeWidth="2"
                          />
                          {filters.categories.includes("internship") && (
                            <path
                              d="M14 7L8.5 12.5L6 10"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={filters.categories.includes("internship")}
                          onChange={() =>
                            handleFilterChange("categories", "internship")
                          }
                        />
                        <span
                          style={{
                            color: "#6477B4",
                            fontSize: "12px",
                            fontWeight: 400,
                          }}
                        >
                          Internship
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="18"
                            height="18"
                            rx="5"
                            fill={
                              filters.categories.includes("job")
                                ? "#2370FF"
                                : "#FFFFFF"
                            }
                            stroke={
                              filters.categories.includes("job")
                                ? "#2370FF"
                                : "#C0CCDE"
                            }
                            strokeWidth="2"
                          />
                          {filters.categories.includes("job") && (
                            <path
                              d="M14 7L8.5 12.5L6 10"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={filters.categories.includes("job")}
                          onChange={() =>
                            handleFilterChange("categories", "job")
                          }
                        />
                        <span
                          style={{
                            color: "#6477B4",
                            fontSize: "12px",
                            fontWeight: 400,
                          }}
                        >
                          Professional
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Photo Filter */}
                  <div>
                    <label
                      className="text-sm font-semibold mb-3 block"
                      style={{ color: "#0F2678", fontSize: "14px" }}
                    >
                      Photo
                    </label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="18"
                            height="18"
                            rx="5"
                            fill={
                              filters.headshots.includes("with")
                                ? "#2370FF"
                                : "#FFFFFF"
                            }
                            stroke={
                              filters.headshots.includes("with")
                                ? "#2370FF"
                                : "#C0CCDE"
                            }
                            strokeWidth="2"
                          />
                          {filters.headshots.includes("with") && (
                            <path
                              d="M14 7L8.5 12.5L6 10"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={filters.headshots.includes("with")}
                          onChange={() =>
                            handleFilterChange("headshots", "with")
                          }
                        />
                        <span
                          style={{
                            color: "#6477B4",
                            fontSize: "12px",
                            fontWeight: 400,
                          }}
                        >
                          With Photo
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="18"
                            height="18"
                            rx="5"
                            fill={
                              filters.headshots.includes("without")
                                ? "#2370FF"
                                : "#FFFFFF"
                            }
                            stroke={
                              filters.headshots.includes("without")
                                ? "#2370FF"
                                : "#C0CCDE"
                            }
                            strokeWidth="2"
                          />
                          {filters.headshots.includes("without") && (
                            <path
                              d="M14 7L8.5 12.5L6 10"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={filters.headshots.includes("without")}
                          onChange={() =>
                            handleFilterChange("headshots", "without")
                          }
                        />
                        <span
                          style={{
                            color: "#6477B4",
                            fontSize: "12px",
                            fontWeight: 400,
                          }}
                        >
                          Without Photo
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Templates Grid */}
            <div style={{ flex: 1 }}>
              {/* Templates Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    id={`template-${template.id}`}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="group cursor-pointer"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <div
                      className="bg-white rounded-xl overflow-hidden"
                      style={{
                        border:
                          selectedTemplate === template.id
                            ? `2px solid ${colorTokens.secondary600}`
                            : "1px solid #F1F3F7",
                        boxShadow:
                          selectedTemplate === template.id
                            ? "0 0 6px 0 rgba(35, 112, 255, 0.3), 0 2px 3px 0 rgba(35, 112, 255, 0.15), 0 2px 6px 0 rgba(35, 112, 255, 0.15), inset 0 -2px 3px 0 rgba(35, 112, 255, 0.1)"
                            : "0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Template Preview */}
                      <div
                        className="relative"
                        style={{
                          height: "520px",
                          background: colorTokens.bgLight,
                          overflow: "hidden",
                        }}
                      >
                        <PDFPreview
                          templateId={template.id}
                          width="100%"
                          height="100%"
                        />
                        {/* Overlay on hover - with full template info */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4"
                          style={{ transition: "opacity 0.3s ease" }}
                        >
                          {/* Backdrop blur layer - only on bottom */}
                          <div
                            className="absolute bottom-0 left-0 right-0"
                            style={{
                              height: '60%',
                              backdropFilter: 'blur(12px)',
                              WebkitBackdropFilter: 'blur(12px)',
                              maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
                            }}
                          ></div>
                          {/* Dark gradient overlay - entire card */}
                          <div
                            className="absolute bottom-0 left-0 right-0 top-0"
                            style={{
                              background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.75) 20%, rgba(0,0,0,0.62) 30%, rgba(0,0,0,0.48) 40%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0.02) 90%, rgba(0,0,0,0) 100%)',
                            }}
                          ></div>
                          <div className="relative z-10">
                            <h3
                              className="text-white font-bold text-lg mb-2"
                              style={{
                                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                              }}
                            >
                              {template.name}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span
                                className="px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  color: colorTokens.title,
                                }}
                              >
                                {template.hasPhoto ? "With Photo" : "No Photo"}
                              </span>
                              <span
                                className="px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  color: colorTokens.title,
                                }}
                              >
                                {template.category === "internship"
                                  ? "Internship"
                                  : "Professional"}
                              </span>
                            </div>
                            <p
                              className="text-white text-sm mb-3 leading-relaxed"
                              style={{
                                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                              }}
                            >
                              {template.description}
                            </p>
                            <button
                              className="w-full text-sm font-medium"
                              style={{
                                display: "inline-flex",
                                padding: "10px 16px",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "8px",
                                background:
                                  "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                                boxShadow:
                                  "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                                color: "#FFFFFF",
                                textShadow:
                                  "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "125%",
                                letterSpacing: "-0.28px",
                              }}
                            >
                              Select Template
                            </button>
                          </div>
                        </div>
                        {/* Selected Badge */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-3 right-3">
                            <img
                              src="/template-tick.svg"
                              alt="Selected"
                              width={32}
                              height={32}
                              style={{
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                              }}
                            />
                          </div>
                        )}
                        {/* Recommended Badge */}
                        {template.isRecommended && (
                          <div className="absolute top-3 left-3">
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                              style={{
                                background:
                                  "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                                color: "#FFFFFF",
                                boxShadow:
                                  "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                                textShadow:
                                  "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                              }}
                            >
                              <Star className="h-3 w-3 fill-current" />
                              Top Pick
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results Message */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📄</div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: colorTokens.title }}
                  >
                    No templates found
                  </h3>
                  <p className="mb-6" style={{ color: colorTokens.paragraph }}>
                    Try adjusting your filters to see more templates
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-lg font-medium transition-all"
                    style={{
                      background: colorTokens.secondary600,
                      color: "#FFFFFF",
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Continue Button */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? collapsed
              ? 'calc((100vw - 96px) / 2 + 96px)'  // Collapsed: center of (viewport - sidebar)
              : 'calc((100vw - 272px) / 2 + 272px)' // Expanded: center of (viewport - sidebar)
            : '50%',
          transform: "translateX(-50%)",
          zIndex: 50,
          transition: 'left 0.3s ease'
        }}
      >
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate || loading}
          className={`flex items-center gap-2 ${
            !selectedTemplate || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            display: "inline-flex",
            padding: "12px 20px",
            alignItems: "center",
            borderRadius: "8px",
            background:
              !selectedTemplate || loading
                ? "#9CA3AF"
                : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
            boxShadow:
              !selectedTemplate || loading
                ? "none"
                : "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
            color: "#FFFFFF",
            textAlign: "center",
            textShadow:
              "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "125%",
            letterSpacing: "-0.36px",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Continue to Editor
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default function TemplateSelection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateSelectionContent />
    </Suspense>
  );
}
