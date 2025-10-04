"use client";
import styles from "@/app/styles/pages/template-selection.module.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Crown,
  Star,
  User,
  Users,
  Palette,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { allTemplates, templateCategories } from "@/components/pdf-templates";
import dynamic from 'next/dynamic';
import { enhanceResume, createResumeFromPrompt } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";

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
          background:
            "linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-3xl shadow-lg mb-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))",
              }}
            >
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Choose Your Perfect Template
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Select a template that best showcases your professional journey
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border-2 sticky top-8"
                style={{ borderColor: "var(--brand-secondary)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm hover:underline"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Clear
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3
                      className="font-semibold mb-3 flex items-center gap-2"
                      style={{ color: "var(--brand-primary)" }}
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
                        <span className="text-sm text-gray-700">Internship</span>
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
                        <span className="text-sm text-gray-700">Professional</span>
                      </label>
                    </div>
                  </div>

                  {/* Photo Filter */}
                  <div>
                    <h3
                      className="font-semibold mb-3 flex items-center gap-2"
                      style={{ color: "var(--brand-primary)" }}
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
                        <span className="text-sm text-gray-700">With photo</span>
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
                        <span className="text-sm text-gray-700">Without photo</span>
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
                  className="bg-white rounded-2xl shadow-xl border-4 p-6 sticky top-8"
                  style={{ borderColor: "var(--brand-primary)" }}
                >
                  <div className="mb-4">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {selectedTemplateData?.name || "Selected Template"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedTemplateData?.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge
                        variant={selectedTemplateData?.hasPhoto ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {selectedTemplateData?.hasPhoto ? "With Photo" : "No Photo"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedTemplateData?.category === 'internship' ? 'Internship' : 'Professional'}
                      </Badge>
                      {selectedTemplateData?.isRecommended && (
                        <Badge
                          className="text-xs"
                          style={{
                            background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))",
                            color: "white"
                          }}
                        >
                          <Star className="h-3 w-3 inline mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div
                    className="bg-gray-50 rounded-xl overflow-hidden border-2"
                    style={{
                      height: '600px',
                      borderColor: "var(--brand-secondary-light)"
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
                      className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? "shadow-lg scale-105"
                          : "hover:shadow-md"
                      }`}
                      style={{
                        borderColor:
                          selectedTemplate === template.id
                            ? "var(--brand-primary)"
                            : "#e5e7eb",
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail */}
                        <div
                          className="w-16 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0 border"
                          style={{ borderColor: "#e5e7eb" }}
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
                            className={`font-bold text-sm mb-1 truncate ${
                              selectedTemplate === template.id ? '' : ''
                            }`}
                            style={{
                              color: selectedTemplate === template.id
                                ? "var(--brand-primary)"
                                : "#374151"
                            }}
                          >
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            <Badge
                              variant={template.hasPhoto ? "default" : "secondary"}
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {template.hasPhoto ? "Photo" : "No Photo"}
                            </Badge>
                            {template.isRecommended && (
                              <Badge
                                className="text-[10px] px-1.5 py-0.5"
                                style={{
                                  background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))",
                                  color: "white"
                                }}
                              >
                                <Star className="h-2 w-2 inline mr-0.5" />
                                Top
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Selection Checkmark */}
                        {selectedTemplate === template.id && (
                          <div className="flex-shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))",
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
          <div className="flex justify-between items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={loading}
              className="bg-white px-8 py-4 rounded-xl font-bold border-2 transition-all duration-300 flex items-center gap-3"
              style={{
                borderColor: "var(--brand-secondary)",
                color: "var(--brand-primary)",
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              Previous
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedTemplate || loading}
              className="px-8 py-4 rounded-xl font-bold text-white border-2 border-transparent transition-all duration-300 flex items-center gap-3 shadow-md disabled:opacity-50"
              style={{
                background: selectedTemplate && !loading
                  ? "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))"
                  : "#9ca3af",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
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