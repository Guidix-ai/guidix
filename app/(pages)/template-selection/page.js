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
        className="min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%)',
          paddingBottom: '140px'
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

          {/* Main Layout: Filters Left, Templates Right */}
          <div className="flex gap-6" style={{ position: 'relative' }}>
            {/* Left Sidebar - Sticky Filters */}
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={{ position: 'sticky', top: '80px', zIndex: 10 }}>
                <div className="bg-white rounded-xl p-5" style={{
                  border: '1px solid #F1F3F7',
                  boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)',
                  maxHeight: 'calc(100vh - 100px)',
                  overflowY: 'auto'
                }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold" style={{
                      color: '#000E41',
                      fontSize: '16px'
                    }}>
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
                    <label className="text-sm font-semibold mb-3 block" style={{ color: '#002A79' }}>
                      Category
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleFilterChange("category", "all")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                        style={{
                          background: filters.category === "all" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.category === "all" ? '#FFFFFF' : '#474FA3',
                          border: filters.category === "all" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.category === "all"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.category === "all" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        All Templates
                      </button>
                      <button
                        onClick={() => handleFilterChange("category", "internship")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
                        style={{
                          background: filters.category === "internship" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.category === "internship" ? '#FFFFFF' : '#474FA3',
                          border: filters.category === "internship" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.category === "internship"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.category === "internship" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        <Briefcase className="h-4 w-4" />
                        Internship
                      </button>
                      <button
                        onClick={() => handleFilterChange("category", "job")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
                        style={{
                          background: filters.category === "job" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.category === "job" ? '#FFFFFF' : '#474FA3',
                          border: filters.category === "job" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.category === "job"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.category === "job" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        <Briefcase className="h-4 w-4" />
                        Professional
                      </button>
                    </div>
                  </div>

                  {/* Photo Filter */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block" style={{ color: '#002A79' }}>
                      Photo
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleFilterChange("headshot", "all")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                        style={{
                          background: filters.headshot === "all" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.headshot === "all" ? '#FFFFFF' : '#474FA3',
                          border: filters.headshot === "all" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.headshot === "all"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.headshot === "all" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleFilterChange("headshot", "with")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
                        style={{
                          background: filters.headshot === "with" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.headshot === "with" ? '#FFFFFF' : '#474FA3',
                          border: filters.headshot === "with" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.headshot === "with"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.headshot === "with" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        <User className="h-4 w-4" />
                        With Photo
                      </button>
                      <button
                        onClick={() => handleFilterChange("headshot", "without")}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                        style={{
                          background: filters.headshot === "without" ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' : 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                          color: filters.headshot === "without" ? '#FFFFFF' : '#474FA3',
                          border: filters.headshot === "without" ? '1px solid rgba(35, 112, 255, 0.30)' : '1px solid #D5E4FF',
                          boxShadow: filters.headshot === "without"
                            ? '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset'
                            : '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                          textShadow: filters.headshot === "without" ? '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)' : 'none'
                        }}
                      >
                        Without Photo
                      </button>
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
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <div
                      className="bg-white rounded-xl overflow-hidden"
                      style={{
                        border: selectedTemplate === template.id
                          ? `2px solid ${colorTokens.secondary600}`
                          : '1px solid #F1F3F7',
                        boxShadow: selectedTemplate === template.id
                          ? '0 0 6px 0 rgba(35, 112, 255, 0.3), 0 2px 3px 0 rgba(35, 112, 255, 0.15), 0 2px 6px 0 rgba(35, 112, 255, 0.15), inset 0 -2px 3px 0 rgba(35, 112, 255, 0.1)'
                          : '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Template Preview */}
                      <div className="relative" style={{
                        height: '450px',
                        background: colorTokens.bgLight,
                        overflow: 'hidden'
                      }}>
                        <PDFPreview
                          templateId={template.id}
                          width="100%"
                          height="100%"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end p-4"
                          style={{ transition: 'opacity 0.2s ease' }}
                        >
                          <button className="w-full text-sm font-medium"
                            style={{
                              display: "inline-flex",
                              padding: "10px 16px",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "8px",
                              background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                              boxShadow: "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                              color: "#FFFFFF",
                              textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
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
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                              style={{
                                background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                                color: '#FFFFFF',
                                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)'
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
            </div>
          </div>

        </div>
      </div>

      {/* Floating Continue Button */}
      <div style={{
        position: 'fixed',
        bottom: '120px',
        right: '2rem',
        zIndex: 50
      }}>
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate || loading}
          className={`flex items-center gap-2 ${
            !selectedTemplate || loading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          style={{
            display: "inline-flex",
            padding: "12px 20px",
            alignItems: "center",
            borderRadius: "8px",
            background: !selectedTemplate || loading
              ? '#9CA3AF'
              : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
            boxShadow: !selectedTemplate || loading
              ? 'none'
              : "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
            color: "#FFFFFF",
            textAlign: "center",
            textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "125%",
            letterSpacing: "-0.36px",
            transition: "all 0.3s ease"
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

      {/* Breadcrumbs */}
      {searchParams.get("from") === "ai" && (
        <ResumeBreadcrumbs currentStep={3} totalSteps={4} />
      )}
      {searchParams.get("from") === "upload" && (
        <ResumeBreadcrumbs
          currentStep={5}
          totalSteps={6}
          steps={[
            { id: 1, label: 'Info', route: '/resume-confirmation?path=upload' },
            { id: 2, label: 'Upload', route: '/upload-resume' },
            { id: 3, label: 'Analyzing', route: '#' },
            { id: 4, label: 'Review', route: '/resume-review' },
            { id: 5, label: 'Template', route: '#' },
            { id: 6, label: 'Editor', route: '#' }
          ]}
        />
      )}
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
