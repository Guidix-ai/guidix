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

  // Enhanced filter states
  const [filters, setFilters] = useState({
    category: "all",
    headshot: "all",
    style: "all",
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

  return (
    <DashboardLayout>
      <div
        className="min-h-screen pb-12"
        style={{
          background: 'linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 md:mb-8" style={{
            border: '1px solid #F1F3F7',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold" style={{ color: colorTokens.title }}>
                Filter Templates
              </h2>
              <button
                onClick={clearFilters}
                className="text-sm font-medium hover:underline self-start sm:self-auto"
                style={{ color: colorTokens.secondary600 }}
              >
                Clear All Filters
              </button>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Category Pills */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block" style={{ color: colorTokens.title }}>
                  Category
                </label>
                <div className="flex gap-2 scroll-x-only">
                  <button
                    onClick={() => handleFilterChange("category", "all")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.category === "all" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.category === "all" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.category === "all" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("category", "internship")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.category === "internship" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.category === "internship" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.category === "internship" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    <Briefcase className="h-3.5 w-3.5 inline-block mr-1.5" />
                    Internship
                  </button>
                  <button
                    onClick={() => handleFilterChange("category", "job")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.category === "job" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.category === "job" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.category === "job" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    <Briefcase className="h-3.5 w-3.5 inline-block mr-1.5" />
                    Professional
                  </button>
                </div>
              </div>

              {/* Photo Pills */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block" style={{ color: colorTokens.title }}>
                  Photo
                </label>
                <div className="flex gap-2 scroll-x-only">
                  <button
                    onClick={() => handleFilterChange("headshot", "all")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.headshot === "all" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.headshot === "all" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.headshot === "all" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("headshot", "with")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.headshot === "with" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.headshot === "with" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.headshot === "with" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    <User className="h-3.5 w-3.5 inline-block mr-1.5" />
                    With Photo
                  </button>
                  <button
                    onClick={() => handleFilterChange("headshot", "without")}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: filters.headshot === "without" ? colorTokens.secondary600 : '#FFFFFF',
                      color: filters.headshot === "without" ? '#FFFFFF' : colorTokens.paragraph,
                      border: `1.5px solid ${filters.headshot === "without" ? colorTokens.secondary600 : '#E1E4EB'}`
                    }}
                  >
                    Without Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                id={`template-${template.id}`}
                onClick={() => handleTemplateSelect(template.id)}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{
                    border: selectedTemplate === template.id
                      ? `3px solid ${colorTokens.secondary600}`
                      : '1px solid #F1F3F7',
                    boxShadow: selectedTemplate === template.id
                      ? '0 8px 24px rgba(35, 112, 255, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {/* Template Preview */}
                  <div className="relative" style={{ height: '300px', background: colorTokens.bgLight }}>
                    <PDFPreview
                      templateId={template.id}
                      width="100%"
                      height="100%"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: colorTokens.secondary600,
                          color: '#FFFFFF'
                        }}
                      >
                        Select Template
                      </button>
                    </div>
                    {/* Selected Badge */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            backgroundColor: colorTokens.secondary600,
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Recommended Badge */}
                    {template.isRecommended && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                          style={{
                            backgroundColor: '#FFD700',
                            color: '#002A79'
                          }}
                        >
                          <Star className="h-3 w-3 fill-current" />
                          Top Pick
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3
                      className="font-bold text-base mb-1 truncate"
                      style={{
                        color: selectedTemplate === template.id
                          ? colorTokens.secondary600
                          : colorTokens.title
                      }}
                    >
                      {template.name}
                    </h3>
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: colorTokens.paragraph }}>
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: template.hasPhoto ? '#E9F1FF' : '#F1F3F7',
                        color: colorTokens.title
                      }}>
                        {template.hasPhoto ? "With Photo" : "No Photo"}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: '#F1F3F7',
                        color: colorTokens.title
                      }}>
                        {template.category === 'internship' ? 'Internship' : 'Professional'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colorTokens.title }}>
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
                  color: '#FFFFFF'
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handlePrev}
              disabled={loading}
              className="px-6 py-3.5 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                border: '2px solid #E1E4EB',
                background: '#FFFFFF',
                color: colorTokens.paragraph,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedTemplate || loading}
              className="px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                background: !selectedTemplate || loading
                  ? '#9CA3AF'
                  : `linear-gradient(135deg, ${colorTokens.secondary600} 0%, ${colorTokens.secondary700} 100%)`,
                boxShadow: !selectedTemplate || loading
                  ? 'none'
                  : '0 4px 16px rgba(35, 112, 255, 0.3)',
                color: '#FFFFFF',
                cursor: !selectedTemplate || loading ? 'not-allowed' : 'pointer',
                opacity: !selectedTemplate || loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Editor
                  <ArrowRight className="h-5 w-5" />
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
