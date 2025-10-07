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
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { allTemplates } from "@/components/pdf-templates";
import dynamic from 'next/dynamic';
import { enhanceResume, createResumeFromPrompt } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";
import Image from "next/image";

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
  const [selectedTemplate, setSelectedTemplate] = useState("internship-1-with-photo");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enhanced filter states
  const [filters, setFilters] = useState({
    category: "all", // 'internship', 'job', 'all'
    headshot: "all", // 'with', 'without', 'all'
    style: "all", // 'modern', 'traditional', 'creative', 'all'
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
    isRecommended: index < 4, // First 4 templates are recommended
    style: template.category === 'internship' ? 'modern' : 'professional',
  }));

  const handleTemplateSelect = (templateId) => {
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
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      headshot: "all",
      style: "all",
    });
  };

  const filteredTemplates = templates.filter((template) => {
    if (filters.category !== "all" && template.category !== filters.category) {
      return false;
    }
    if (filters.headshot !== "all") {
      if (filters.headshot === "with" && !template.hasPhoto) return false;
      if (filters.headshot === "without" && template.hasPhoto) return false;
    }
    if (filters.style !== "all" && template.style !== filters.style) {
      return false;
    }
    return true;
  });

  const handleContinue = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setError(null);

    try {
      const isFromUpload = searchParams.get("from") === "upload";

      if (isFromUpload) {
        // If from upload flow, call enhance API
        const resumeId = sessionStorage.getItem('uploadedResumeId');
        if (!resumeId) {
          throw new Error('Resume ID not found. Please upload your resume again.');
        }

        const response = await enhanceResume(resumeId);

        if (response.success) {
          // Store the enhanced data and navigate
          sessionStorage.setItem('enhancedResumeData', JSON.stringify(response.data));
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
        // If from AI prompt flow, call createResumeFromPrompt API
        const userPrompt = sessionStorage.getItem('userPrompt') || searchParams.get("prompt");
        if (!userPrompt) {
          throw new Error('Prompt not found. Please go back and enter your details.');
        }

        const response = await createResumeFromPrompt(
          userPrompt,
          'My Resume',
          selectedTemplate
        );

        if (response.success) {
          // Store the resume data and navigate
          sessionStorage.setItem('createdResumeId', response.data.resume_id);
          sessionStorage.setItem('createdResumeData', JSON.stringify(response.data));
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
      router.push("/resume-feedback?" + searchParams.toString());
    } else {
      router.push("/ai-prompt?" + searchParams.toString());
    }
  };

  const selectedTemplateData = filteredTemplates.find(t => t.id === selectedTemplate);

  return (
    <DashboardLayout>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: colorTokens.bgLight,
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Banner */}
          <div className="relative py-6 px-8 overflow-hidden flex items-center mb-6" style={{
            backgroundImage: 'url(/header-banner.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100px',
            boxShadow: '0 4px 20px 0 #2370FF66',
            borderRadius: '16px'
          }}>
            <div className="relative z-10">
              <h1 className="text-white font-bold" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontSize: '32px', lineHeight: '1.2' }}>
                Choose Your Perfect Template
              </h1>
              <p className="text-white mt-2" style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)', fontSize: '16px' }}>
                Select a template that best showcases your professional journey
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div
                className="bg-white rounded-2xl p-6 sticky top-8"
                style={{
                  border: '1px solid #F1F3F7',
                  boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: colorTokens.title }}
                  >
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm hover:underline"
                    style={{ color: colorTokens.secondary600 }}
                  >
                    Clear
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3
                      className="font-semibold mb-3 flex items-center gap-2"
                      style={{ color: colorTokens.title }}
                    >
                      <Briefcase className="h-4 w-4" />
                      Category
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category === "internship"}
                          onChange={(e) =>
                            handleFilterChange(
                              "category",
                              e.target.checked ? "internship" : "all"
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm" style={{ color: colorTokens.paragraph }}>Internship</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category === "job"}
                          onChange={(e) =>
                            handleFilterChange(
                              "category",
                              e.target.checked ? "job" : "all"
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm" style={{ color: colorTokens.paragraph }}>Professional</span>
                      </label>
                    </div>
                  </div>

                  {/* Photo Filter */}
                  <div>
                    <h3
                      className="font-semibold mb-3 flex items-center gap-2"
                      style={{ color: colorTokens.title }}
                    >
                      <User className="h-4 w-4" />
                      Photo
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.headshot === "with"}
                          onChange={(e) =>
                            handleFilterChange(
                              "headshot",
                              e.target.checked ? "with" : "all"
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm" style={{ color: colorTokens.paragraph }}>With photo</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.headshot === "without"}
                          onChange={(e) =>
                            handleFilterChange(
                              "headshot",
                              e.target.checked ? "without" : "all"
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm" style={{ color: colorTokens.paragraph }}>Without photo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              {/* Selected Template Preview - Center */}
              <div className="flex-1">
                <div
                  className="bg-white rounded-2xl p-6 sticky top-8"
                  style={{
                    border: '1px solid #F1F3F7',
                    boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="mb-4">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: colorTokens.title }}
                    >
                      {selectedTemplateData?.name || "Selected Template"}
                    </h3>
                    <p className="text-sm" style={{ color: colorTokens.paragraph }}>
                      {selectedTemplateData?.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                        backgroundColor: selectedTemplateData?.hasPhoto ? '#E9F1FF' : '#F1F3F7',
                        color: colorTokens.title
                      }}>
                        {selectedTemplateData?.hasPhoto ? "With Photo" : "No Photo"}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                        backgroundColor: '#F1F3F7',
                        color: colorTokens.title
                      }}>
                        {selectedTemplateData?.category === 'internship' ? 'Internship' : 'Professional'}
                      </span>
                      {selectedTemplateData?.isRecommended && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1" style={{
                          backgroundColor: colorTokens.secondary600,
                          color: 'white'
                        }}>
                          <Star className="h-3 w-3" />
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      height: '600px',
                      backgroundColor: colorTokens.bgLight,
                      border: '1px solid #E1E4ED'
                    }}
                  >
                    <PDFPreview
                      templateId={selectedTemplate}
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
              </div>

              {/* Template Carousel - Right Side */}
              <div className="w-full lg:w-80">
                <div
                  className="space-y-3 overflow-y-auto pr-2"
                  style={{
                    maxHeight: '700px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                  }}
                >
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      id={`template-${template.id}`}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`bg-white rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? "scale-105"
                          : "hover:shadow-md"
                      }`}
                      style={{
                        border: selectedTemplate === template.id
                          ? `2px solid ${colorTokens.secondary600}`
                          : '1px solid #F1F3F7',
                        boxShadow: selectedTemplate === template.id
                          ? '0 4px 12px 0 rgba(35, 112, 255, 0.25)'
                          : '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail */}
                        <div
                          className="w-16 h-24 rounded overflow-hidden flex-shrink-0"
                          style={{
                            backgroundColor: colorTokens.bgLight,
                            border: '1px solid #E1E4ED'
                          }}
                        >
                          <PDFPreview
                            templateId={template.id}
                            width="100%"
                            height="100%"
                          />
                        </div>

                        {/* Template Info */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-bold text-sm mb-1 truncate"
                            style={{
                              color: selectedTemplate === template.id
                                ? colorTokens.secondary600
                                : colorTokens.title
                            }}
                          >
                            {template.name}
                          </h4>
                          <p className="text-xs line-clamp-2 mb-2" style={{ color: colorTokens.paragraph }}>
                            {template.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                              backgroundColor: template.hasPhoto ? '#E9F1FF' : '#F1F3F7',
                              color: colorTokens.title
                            }}>
                              {template.hasPhoto ? "Photo" : "No Photo"}
                            </span>
                            {template.isRecommended && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{
                                backgroundColor: colorTokens.secondary600,
                                color: 'white'
                              }}>
                                <Star className="h-2 w-2" />
                                Top
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Selection Checkmark */}
                        {selectedTemplate === template.id && (
                          <div className="flex-shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: colorTokens.secondary600,
                              }}
                            >
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8 bg-white rounded-lg p-6" style={{
            border: '1px solid #F1F3F7',
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <button
              onClick={handlePrev}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                border: '1px solid #E9F1FF',
                background: 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                color: '#474FA3',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedTemplate || loading}
              className="px-8 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: !selectedTemplate || loading
                  ? '#9CA3AF'
                  : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                cursor: !selectedTemplate || loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
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