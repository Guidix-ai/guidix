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
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Crown,
  Star,
  User,
  Users,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function TemplateSelection() {
  const [selectedTemplate, setSelectedTemplate] = useState("saanvi-patel-1");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("there");

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    headshot: "all", // 'with', 'without', 'all'
    columns: "all", // '1', '2', 'all'
    style: "all", // 'traditional', 'creative', 'contemporary', 'all'
  });

  useEffect(() => {
    // Get user name from prompt or use default
    const prompt = searchParams.get("prompt") || "";
    const nameMatch = prompt.match(/I'm\s+\*\*([A-Za-z]+)\*\*/);
    const extractedName = nameMatch ? nameMatch[1] : "there";
    setUserName(extractedName);
  }, [searchParams]);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1536) {
        setItemsPerPage(3); // 2xl screens - 3 cards with sidebar
      } else if (window.innerWidth >= 1280) {
        setItemsPerPage(2); // xl screens - 2 cards (sidebar takes space)
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // md and lg screens - 2 cards
      } else {
        setItemsPerPage(1); // sm and below - 1 card
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, itemsPerPage]);

  const templates = [
    {
      id: "saanvi-patel-1",
      name: "Saanvi Patel",
      description: "Modern single-column template with photo",
      hasPhoto: true,
      columns: 1,
      style: "contemporary",
      colors: [
        "#1e40af",
        "#16a34a",
        "#7c3aed",
        "#ea580c",
        "#dc2626",
        "#1e3a8a",
        "multicolor",
      ],
      isRecommended: true,
    },
    {
      id: "saanvi-patel-2",
      name: "Saanvi Patel",
      description: "Clean traditional layout without photo",
      hasPhoto: false,
      columns: 1,
      style: "traditional",
      colors: [
        "#374151",
        "#16a34a",
        "#7c2d12",
        "#0369a1",
        "#7c3aed",
        "#1e40af",
        "multicolor",
      ],
      isRecommended: true,
    },
    {
      id: "saanvi-patel-3",
      name: "Professional Modern",
      description: "Clean two-column design with photo",
      hasPhoto: true,
      columns: 2,
      style: "contemporary",
      colors: [
        "#1e40af",
        "#374151",
        "#6b7280",
        "#1f2937",
        "#9ca3af",
        "#3b82f6",
        "multicolor",
      ],
      isRecommended: true,
    },
    {
      id: "template-4",
      name: "Harvard Classic",
      description: "Professional academic-style layout",
      hasPhoto: false,
      columns: 1,
      style: "traditional",
      colors: [
        "#1e40af",
        "#374151",
        "#6b7280",
        "#1f2937",
        "#9ca3af",
        "#3b82f6",
        "multicolor",
      ],
      isRecommended: false,
    },
    {
      id: "template-5",
      name: "Executive Professional",
      description: "Premium two-column layout with photo",
      hasPhoto: true,
      columns: 2,
      style: "contemporary",
      colors: [
        "#374151",
        "#1e40af",
        "#6b7280",
        "#1f2937",
        "#9ca3af",
        "#3b82f6",
        "multicolor",
      ],
      isRecommended: false,
    },
    {
      id: "template-6",
      name: "Classic Business",
      description: "Traditional professional layout",
      hasPhoto: false,
      columns: 1,
      style: "traditional",
      colors: [
        "#374151",
        "#1e40af",
        "#7c2d12",
        "#0369a1",
        "#16a34a",
        "#7c3aed",
        "multicolor",
      ],
      isRecommended: false,
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    if (filters.headshot !== "all") {
      if (filters.headshot === "with" && !template.hasPhoto) return false;
      if (filters.headshot === "without" && template.hasPhoto) return false;
    }
    if (
      filters.columns !== "all" &&
      template.columns.toString() !== filters.columns
    )
      return false;
    if (filters.style !== "all" && template.style !== filters.style)
      return false;
    return true;
  });

  // Carousel navigation functions
  const nextSlide = () => {
    const maxIndex = Math.max(0, filteredTemplates.length - itemsPerPage);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    const maxIndex = Math.max(0, filteredTemplates.length - itemsPerPage);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      headshot: "all",
      columns: "all",
      style: "all",
    });
  };

  const handleAdvancedEdit = (templateId) => {
    const params = new URLSearchParams(searchParams);
    params.set("template", templateId);
    params.set("loadingType", "2");
    router.push(`/loading-screen?${params.toString()}`);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      const params = new URLSearchParams(searchParams);
      params.set("template", selectedTemplate);
      params.set("loadingType", "2");
      router.push(`/loading-screen?${params.toString()}`);
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

  return (
    <DashboardLayout>
      <div>
        <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6),
              0 0 60px rgba(147, 51, 234, 0.4);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-pulse {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInFromLeft 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInFromRight 0.8s ease-out;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .hover\\:scale-105:hover {
          transform: translateY(-2px);
        }
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::before {
          content: ";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
        /* Prevent any horizontal overflow */
        * {
          max-width: 100%;
          overflow-wrap: break-word;
        }
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow-sm mb-3">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Choose Your Template
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a professional template that matches your style.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-8 overflow-hidden">
            {/* Filters Sidebar */}
            <div className="w-full xl:w-64 xl:flex-shrink-0 overflow-hidden">
              <div className="xl:sticky xl:top-0">
                <div
                  className="bg-white rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "var(--brand-secondary)" }}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <h2
                      className="text-sm sm:text-base lg:text-lg font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Filters
                    </h2>
                    <button
                      onClick={clearFilters}
                      className="text-xs sm:text-sm hover:underline transition-colors duration-300"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Clear Filters
                    </button>
                  </div>

                  {/* Responsive Filter Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                    {/* Headshot Filter */}
                    <div>
                      <h3
                        className="font-semibold mb-2 lg:mb-3"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        Headshot
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
                          <span className="text-sm text-gray-700">
                            With photo
                          </span>
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
                          <span className="text-sm text-gray-700">
                            Without photo
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Columns Filter */}
                    <div>
                      <h3
                        className="font-semibold mb-2 lg:mb-3"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        Columns
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.columns === "1"}
                            onChange={(e) =>
                              handleFilterChange(
                                "columns",
                                e.target.checked ? "1" : "all"
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            1 Column
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.columns === "2"}
                            onChange={(e) =>
                              handleFilterChange(
                                "columns",
                                e.target.checked ? "2" : "all"
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            2 Columns
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Style Filter */}
                    <div>
                      <h3
                        className="font-semibold mb-2 lg:mb-3"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        Style
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.style === "traditional"}
                            onChange={(e) =>
                              handleFilterChange(
                                "style",
                                e.target.checked ? "traditional" : "all"
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Traditional
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.style === "creative"}
                            onChange={(e) =>
                              handleFilterChange(
                                "style",
                                e.target.checked ? "creative" : "all"
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Creative
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.style === "contemporary"}
                            onChange={(e) =>
                              handleFilterChange(
                                "style",
                                e.target.checked ? "contemporary" : "all"
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Contemporary
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Templates Carousel */}
            <div className="flex-1 min-w-0 overflow-hidden">
              {/* Simple Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {filteredTemplates.length} Templates Available
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className="flex items-center justify-center w-8 h-8 bg-white rounded border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={
                        currentIndex >=
                        Math.max(0, filteredTemplates.length - itemsPerPage)
                      }
                      className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 bg-white hover:shadow-md ${
                      selectedTemplate === template.id
                        ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                            {/* Selection indicator */}
                            {selectedTemplate === template.id && (
                              <div className="absolute top-3 right-3 z-20">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white text-xs font-bold">
                                    ✓
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Recommended badge */}
                            {template.isRecommended && (
                              <div className="absolute top-3 left-3 z-20">
                                <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                                  ⭐ Popular
                                </div>
                              </div>
                            )}

                            {/* Template Preview */}
                            <div className="relative aspect-[8.5/11] bg-gray-50 rounded-t-xl overflow-hidden">
                              {/* Template 1: Modern Two-Column with Photo */}
                              {template.id === "saanvi-patel-1" && (
                                <div className="h-full flex bg-white p-2 text-[4px] leading-tight">
                                  {/* Left Sidebar - Dark Blue */}
                                  <div className="w-1/3 bg-slate-700 text-white p-1.5 rounded-sm mr-1.5">
                                    <div className="text-center mb-2">
                                      <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1 border border-white"></div>
                                      <div className="font-bold text-white text-[5px] leading-none">
                                        SAANVI
                                      </div>
                                      <div className="font-bold text-white text-[5px] leading-none">
                                        PATEL
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 mt-0.5">
                                        RETAIL SALES ASSOCIATE
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="text-white font-bold mb-0.5 text-[4px] uppercase tracking-wide">
                                        CONTACT
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 space-y-0.5">
                                        <div>📧 saanvi.p@email.com</div>
                                        <div>📱 (91) 98123-4567</div>
                                        <div>🌐 linkedin.com/in/saanvi</div>
                                        <div>📍 New Delhi, India</div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="text-white font-bold mb-0.5 text-[4px] uppercase tracking-wide">
                                        SKILLS
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 space-y-0.5">
                                        <div>• Customer Service Excellence</div>
                                        <div>• Sales & Marketing Strategy</div>
                                        <div>• Team Leadership</div>
                                        <div>• Problem Solving</div>
                                        <div>• Effective Communication</div>
                                        <div>• Visual Merchandising</div>
                                        <div>• Inventory Management</div>
                                        <div>• POS Systems</div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="text-white font-bold mb-0.5 text-[4px] uppercase tracking-wide">
                                        LANGUAGES
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 space-y-0.5">
                                        <div>• English (Fluent)</div>
                                        <div>• Hindi (Native)</div>
                                        <div>• Punjabi (Conversational)</div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="text-white font-bold mb-0.5 text-[4px] uppercase tracking-wide">
                                        CERTIFICATIONS
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 space-y-0.5">
                                        <div>• Retail Management Cert.</div>
                                        <div>• Customer Service Pro</div>
                                        <div>• First Aid/CPR Certified</div>
                                        <div>• Digital Marketing Basics</div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-white font-bold mb-0.5 text-[4px] uppercase tracking-wide">
                                        INTERESTS
                                      </div>
                                      <div className="text-[3.5px] text-gray-300 space-y-0.5">
                                        <div>• Fashion & Style Trends</div>
                                        <div>• Photography</div>
                                        <div>• Yoga & Wellness</div>
                                        <div>• Community Volunteering</div>
                                        <div>• Travel & Culture</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Main Content Area */}
                                  <div className="w-2/3 p-1.5">
                                    <div className="mb-1.5">
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        PROFESSIONAL SUMMARY
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 leading-relaxed">
                                        Highly motivated retail professional
                                        with 3+ years of progressive experience
                                        in customer service, sales, and team
                                        leadership. Consistently exceeded sales
                                        targets by 25%+ while maintaining
                                        exceptional customer satisfaction
                                        ratings. Proven ability to build rapport
                                        with diverse clientele, implement
                                        effective merchandising strategies, and
                                        mentor new team members. Passionate
                                        about creating positive shopping
                                        experiences and driving business growth
                                        through innovative sales approaches.
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        WORK EXPERIENCE
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Senior Retail Sales Associate
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            Fashion Forward Boutique • 01/2022 -
                                            Present • New Delhi
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Achieved 125% of monthly sales
                                              targets for 18 consecutive months
                                            </div>
                                            <div>
                                              • Increased customer retention
                                              rate by 40% through personalized
                                              service
                                            </div>
                                            <div>
                                              • Led visual merchandising
                                              initiatives resulting in 20% boost
                                              in foot traffic
                                            </div>
                                            <div>
                                              • Mentored and trained 8 new sales
                                              associates on company policies
                                            </div>
                                            <div>
                                              • Managed inventory worth ₹2.5L+
                                              and reduced shrinkage by 15%
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Retail Sales Associate
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            Style Hub • 05/2019 - 12/2021 • New
                                            Delhi
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Maintained 95% customer
                                              satisfaction rating across all
                                              evaluations
                                            </div>
                                            <div>
                                              • Assisted 50+ customers daily
                                              with product selection and styling
                                              advice
                                            </div>
                                            <div>
                                              • Collaborated with team to
                                              implement seasonal promotional
                                              campaigns
                                            </div>
                                            <div>
                                              • Processed transactions
                                              accurately using multiple POS
                                              systems
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Sales Intern
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            Trendy Threads • 01/2019 - 04/2019 •
                                            New Delhi
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Supported senior staff with
                                              customer inquiries and product
                                              demonstrations
                                            </div>
                                            <div>
                                              • Learned inventory management and
                                              stock organization procedures
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        EDUCATION
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Diploma in Financial Accounting
                                          </div>
                                          <div className="text-gray-600">
                                            Delhi University • 2018-2020 • CGPA:
                                            8.2/10
                                          </div>
                                          <div className="text-gray-500">
                                            Relevant Coursework: Business
                                            Mathematics, Economics, Financial
                                            Management
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Higher Secondary Certificate
                                            (Commerce)
                                          </div>
                                          <div className="text-gray-600">
                                            Modern Public School • 2016-2018 •
                                            85%
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        KEY ACHIEVEMENTS
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                        <div>
                                          🏆 Employee of the Month Award (March
                                          2023, July 2023, November 2023)
                                        </div>
                                        <div>
                                          🏆 Top Sales Performer of the Year
                                          2023 (₹15L+ in sales)
                                        </div>
                                        <div>
                                          🏆 Customer Service Excellence Award
                                          2022
                                        </div>
                                        <div>
                                          🏆 Perfect Attendance Recognition
                                          2021-2023
                                        </div>
                                        <div>
                                          🏆 Team Leadership Award for training
                                          program development
                                        </div>
                                        <div>
                                          🏆 Innovation Award for implementing
                                          customer feedback system
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        VOLUNTEER EXPERIENCE
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Community Outreach Volunteer
                                          </div>
                                          <div className="text-gray-600">
                                            Delhi Youth Foundation •
                                            2020-Present
                                          </div>
                                          <div>
                                            • Organized clothing drives for
                                            underprivileged communities
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide border-b border-slate-300 pb-0.5">
                                        ADDITIONAL INFORMATION
                                      </div>
                                      <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                        <div>
                                          • Flexible schedule availability
                                          including weekends and holidays
                                        </div>
                                        <div>
                                          • Strong proficiency in MS Office
                                          Suite (Word, Excel, PowerPoint)
                                        </div>
                                        <div>
                                          • Experience with CRM software and
                                          sales analytics tools
                                        </div>
                                        <div>
                                          • Valid driver's license and own
                                          transportation
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Template 2: Traditional Single Column */}
                              {template.id === "saanvi-patel-2" && (
                                <div className="h-full p-2 text-[4px] leading-tight bg-white">
                                  {/* Header */}
                                  <div className="text-center mb-2 pb-1 border-b-2 border-slate-700">
                                    <div className="font-bold text-[8px] text-slate-700 tracking-wider">
                                      SAANVI PATEL
                                    </div>
                                    <div className="text-[5px] text-gray-600 mt-0.5 font-medium">
                                      RETAIL SALES ASSOCIATE
                                    </div>
                                    <div className="text-[3.5px] text-gray-500 mt-0.5">
                                      New Delhi, India • (91) 98 123-4567 •
                                      saanvi.patel@email.com •
                                      linkedin.com/in/saanvipatel
                                    </div>
                                  </div>

                                  {/* Professional Summary */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      PROFESSIONAL SUMMARY
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 leading-relaxed">
                                      Dynamic and results-oriented Retail Sales
                                      Associate with 3+ years of progressive
                                      experience in high-volume retail
                                      environments. Demonstrated expertise in
                                      building strong client relationships,
                                      consistently exceeding sales targets by
                                      25%+, and delivering exceptional customer
                                      service. Proven track record in team
                                      leadership, inventory management, visual
                                      merchandising, and store operations
                                      optimization. Passionate about creating
                                      memorable shopping experiences that drive
                                      customer loyalty and business growth.
                                    </div>
                                  </div>

                                  {/* Core Competencies */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      CORE COMPETENCIES
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 grid grid-cols-3 gap-x-1">
                                      <div>• Sales & Marketing Strategy</div>
                                      <div>• Customer Relationship Mgmt</div>
                                      <div>• Inventory Management</div>
                                      <div>• Visual Merchandising</div>
                                      <div>• Team Leadership & Training</div>
                                      <div>• Problem Resolution</div>
                                      <div>• POS Systems Operation</div>
                                      <div>• Product Knowledge</div>
                                      <div>• Loss Prevention</div>
                                      <div>• Cash Handling</div>
                                      <div>• Multi-tasking</div>
                                      <div>• Bilingual Communication</div>
                                    </div>
                                  </div>

                                  {/* Professional Experience */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      PROFESSIONAL EXPERIENCE
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 space-y-1">
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          Senior Retail Sales Associate
                                        </div>
                                        <div className="font-medium text-gray-600">
                                          Fashion Forward Boutique • 01/2022 -
                                          Present • New Delhi, India
                                        </div>
                                        <div className="mt-0.5 space-y-0.5">
                                          <div>
                                            • Achieved 125% of monthly sales
                                            targets for 18 consecutive months,
                                            generating ₹15L+ in annual sales
                                          </div>
                                          <div>
                                            • Improved customer satisfaction
                                            scores from 78% to 95% through
                                            personalized service approach
                                          </div>
                                          <div>
                                            • Mentored and trained 8 new sales
                                            associates on company policies,
                                            product knowledge, and sales
                                            techniques
                                          </div>
                                          <div>
                                            • Implemented visual merchandising
                                            strategies resulting in 20% increase
                                            in foot traffic and impulse
                                            purchases
                                          </div>
                                          <div>
                                            • Managed inventory worth ₹2.5L+ and
                                            reduced shrinkage by 15% through
                                            effective loss prevention measures
                                          </div>
                                          <div>
                                            • Led customer feedback initiative
                                            that improved store rating from 4.2
                                            to 4.8 stars on Google Reviews
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          Retail Sales Associate
                                        </div>
                                        <div className="font-medium text-gray-600">
                                          Style Hub Fashion • 05/2019 - 12/2021
                                          • New Delhi, India
                                        </div>
                                        <div className="mt-0.5 space-y-0.5">
                                          <div>
                                            • Maintained 95% customer
                                            satisfaction rating across all
                                            quarterly evaluations
                                          </div>
                                          <div>
                                            • Assisted 50+ customers daily with
                                            product selection, styling advice,
                                            and outfit coordination
                                          </div>
                                          <div>
                                            • Collaborated with team to
                                            implement seasonal promotional
                                            campaigns increasing sales by 30%
                                          </div>
                                          <div>
                                            • Processed transactions accurately
                                            using multiple POS systems with
                                            99.8% accuracy rate
                                          </div>
                                          <div>
                                            • Participated in store layout
                                            redesign that improved customer flow
                                            and shopping experience
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          Sales Intern
                                        </div>
                                        <div className="font-medium text-gray-600">
                                          Trendy Threads Retail • 01/2019 -
                                          04/2019 • New Delhi, India
                                        </div>
                                        <div className="mt-0.5 space-y-0.5">
                                          <div>
                                            • Supported senior staff with
                                            customer inquiries, product
                                            demonstrations, and sales assistance
                                          </div>
                                          <div>
                                            • Learned comprehensive inventory
                                            management and stock organization
                                            procedures
                                          </div>
                                          <div>
                                            • Gained hands-on experience in cash
                                            handling, returns processing, and
                                            customer service protocols
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Education */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      EDUCATION
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          Diploma in Financial Accounting
                                        </div>
                                        <div className="text-gray-600">
                                          Delhi University • 2018-2020 • CGPA:
                                          8.2/10 • Delhi, India
                                        </div>
                                        <div className="text-gray-500">
                                          Relevant Coursework: Business
                                          Mathematics, Economics, Financial
                                          Management, Cost Accounting
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          Higher Secondary Certificate (Commerce
                                          Stream)
                                        </div>
                                        <div className="text-gray-600">
                                          Modern Public School • 2016-2018 • 85%
                                          • New Delhi, India
                                        </div>
                                        <div className="text-gray-500">
                                          Subjects: Accountancy, Business
                                          Studies, Economics, English,
                                          Mathematics
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Certifications */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      CERTIFICATIONS & TRAINING
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                      <div>
                                        • Retail Management Professional
                                        Certification - National Retail
                                        Federation (2023)
                                      </div>
                                      <div>
                                        • Customer Service Excellence
                                        Certificate - Dale Carnegie Training
                                        (2022)
                                      </div>
                                      <div>
                                        • First Aid and CPR Certified - Red
                                        Cross India (2023)
                                      </div>
                                      <div>
                                        • Digital Marketing Fundamentals -
                                        Google Digital Garage (2023)
                                      </div>
                                      <div>
                                        • Inventory Management Systems Training
                                        - Internal Certification (2022)
                                      </div>
                                    </div>
                                  </div>

                                  {/* Key Achievements */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      KEY ACHIEVEMENTS & AWARDS
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                      <div>
                                        🏆 Employee of the Month Award (March
                                        2023, July 2023, November 2023)
                                      </div>
                                      <div>
                                        🏆 Top Sales Performer of the Year 2023
                                        (₹15L+ in individual sales)
                                      </div>
                                      <div>
                                        🏆 Customer Service Excellence Award
                                        2022
                                      </div>
                                      <div>
                                        🏆 Perfect Attendance Recognition
                                        2021-2023
                                      </div>
                                      <div>
                                        🏆 Team Leadership Award for successful
                                        training program development
                                      </div>
                                      <div>
                                        🏆 Innovation Award for implementing
                                        customer feedback system
                                      </div>
                                      <div>
                                        🏆 Best Visual Merchandising Display
                                        Award (Q3 2023)
                                      </div>
                                    </div>
                                  </div>

                                  {/* Volunteer Experience */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      VOLUNTEER EXPERIENCE
                                    </div>
                                    <div className="text-[3.5px] text-gray-600">
                                      <div className="font-semibold text-gray-800">
                                        Community Outreach Volunteer
                                      </div>
                                      <div className="text-gray-600">
                                        Delhi Youth Foundation • 2020 - Present
                                      </div>
                                      <div className="mt-0.5 space-y-0.5">
                                        <div>
                                          • Organized monthly clothing drives
                                          for underprivileged communities,
                                          collecting 500+ items
                                        </div>
                                        <div>
                                          • Coordinated with local NGOs to
                                          distribute essential items during
                                          COVID-19 pandemic
                                        </div>
                                        <div>
                                          • Mentored 15+ youth in developing
                                          professional and life skills
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Information */}
                                  <div className="mb-1.5">
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      TECHNICAL SKILLS
                                    </div>
                                    <div className="text-[3.5px] text-gray-600 grid grid-cols-2 gap-x-2">
                                      <div>• MS Office Suite (Advanced)</div>
                                      <div>
                                        • POS Systems (Multiple platforms)
                                      </div>
                                      <div>
                                        • CRM Software (Salesforce basics)
                                      </div>
                                      <div>• Inventory Management Systems</div>
                                      <div>• Social Media Marketing</div>
                                      <div>• Basic Photo Editing</div>
                                    </div>
                                  </div>

                                  {/* Languages & Interests */}
                                  <div>
                                    <div className="font-bold text-slate-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                      LANGUAGES & INTERESTS
                                    </div>
                                    <div className="text-[3.5px] text-gray-600">
                                      <div className="mb-0.5">
                                        <span className="font-semibold">
                                          Languages:
                                        </span>{" "}
                                        English (Fluent), Hindi (Native),
                                        Punjabi (Conversational), Spanish
                                        (Basic)
                                      </div>
                                      <div>
                                        <span className="font-semibold">
                                          Interests:
                                        </span>{" "}
                                        Fashion & Style Trends, Photography,
                                        Yoga & Wellness, Travel, Community
                                        Service, Reading Business Books
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Template 3: Professional Modern Two-Column */}
                              {template.id === "saanvi-patel-3" && (
                                <div className="h-full bg-white p-2 text-[4px] leading-tight">
                                  {/* Header with Name and Title */}
                                  <div className="text-center mb-2 pb-1 border-b border-gray-300">
                                    <div className="font-bold text-[7px] text-gray-800 tracking-wider">
                                      JENNIFER WILLIAMS
                                    </div>
                                    <div className="text-[4px] text-gray-600 mt-0.5 font-medium">
                                      SENIOR PROJECT MANAGER
                                    </div>
                                    <div className="text-[3px] text-gray-500 mt-0.5">
                                      jennifer.williams@email.com • +1 (555)
                                      123-4567 • New York, NY •
                                      linkedin.com/in/jenniferwilliams
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    {/* Left Column */}
                                    <div className="w-1/3 space-y-1.5">
                                      {/* Photo */}
                                      <div className="text-center">
                                        <div className="w-8 h-8 bg-gray-300 rounded mx-auto border-2 border-gray-400"></div>
                                      </div>

                                      {/* Professional Summary */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          PROFESSIONAL SUMMARY
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 leading-relaxed">
                                          Dynamic Project Manager with 8+ years
                                          of experience leading cross-functional
                                          teams and delivering complex projects
                                          on time and within budget. Expertise
                                          in Agile methodologies, stakeholder
                                          management, and process optimization.
                                        </div>
                                      </div>

                                      {/* Core Competencies */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          CORE COMPETENCIES
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>• Project Management</div>
                                          <div>
                                            • Agile & Scrum Methodologies
                                          </div>
                                          <div>• Team Leadership</div>
                                          <div>• Stakeholder Management</div>
                                          <div>• Risk Assessment</div>
                                          <div>• Budget Management</div>
                                          <div>• Process Improvement</div>
                                          <div>• Strategic Planning</div>
                                        </div>
                                      </div>

                                      {/* Technical Skills */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          TECHNICAL SKILLS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>• MS Project & Smartsheet</div>
                                          <div>• JIRA & Confluence</div>
                                          <div>• Tableau & Power BI</div>
                                          <div>• Advanced Excel & VBA</div>
                                          <div>• Salesforce CRM</div>
                                          <div>• SQL & Database Management</div>
                                        </div>
                                      </div>

                                      {/* Education */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          EDUCATION
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              MBA, Operations Management
                                            </div>
                                            <div className="text-gray-600">
                                              Columbia Business School • 2018
                                            </div>
                                          </div>
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              B.S. Industrial Engineering
                                            </div>
                                            <div className="text-gray-600">
                                              NYU • 2014 • Magna Cum Laude
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Certifications */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          CERTIFICATIONS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>• PMP Certified (2020)</div>
                                          <div>
                                            • Certified ScrumMaster (2019)
                                          </div>
                                          <div>
                                            • Six Sigma Green Belt (2018)
                                          </div>
                                          <div>• ITIL Foundation (2017)</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="w-2/3 space-y-1.5">
                                      {/* Professional Experience */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          PROFESSIONAL EXPERIENCE
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-1">
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Senior Project Manager
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Tech Solutions Inc. • 01/2021 -
                                              Present • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Led 15+ cross-functional
                                                projects with budgets ranging
                                                from $500K to $5M
                                              </div>
                                              <div>
                                                • Implemented Agile practices
                                                reducing project delivery time
                                                by 30%
                                              </div>
                                              <div>
                                                • Managed teams of 20+ members
                                                across multiple departments and
                                                time zones
                                              </div>
                                              <div>
                                                • Achieved 98% on-time delivery
                                                rate while maintaining quality
                                                standards
                                              </div>
                                              <div>
                                                • Developed project management
                                                framework adopted company-wide
                                              </div>
                                            </div>
                                          </div>

                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Project Manager
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Digital Innovations Corp • 03/2018
                                              - 12/2020 • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Managed software development
                                                projects from initiation to
                                                closure
                                              </div>
                                              <div>
                                                • Coordinated with stakeholders
                                                to define project scope and
                                                requirements
                                              </div>
                                              <div>
                                                • Implemented risk management
                                                strategies reducing project
                                                failures by 40%
                                              </div>
                                              <div>
                                                • Led digital transformation
                                                initiatives improving
                                                operational efficiency by 25%
                                              </div>
                                            </div>
                                          </div>

                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Associate Project Manager
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Consulting Partners LLC • 06/2015
                                              - 02/2018 • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Assisted senior project
                                                managers in planning and
                                                executing client projects
                                              </div>
                                              <div>
                                                • Maintained project schedules
                                                and tracked deliverables using
                                                MS Project
                                              </div>
                                              <div>
                                                • Conducted regular status
                                                meetings and prepared executive
                                                reports
                                              </div>
                                              <div>
                                                • Supported business process
                                                improvement initiatives for
                                                Fortune 500 clients
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Key Achievements */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          KEY ACHIEVEMENTS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            🏆 Project Manager of the Year -
                                            Tech Solutions Inc. (2023)
                                          </div>
                                          <div>
                                            🏆 Excellence in Leadership Award -
                                            Digital Innovations Corp (2020)
                                          </div>
                                          <div>
                                            🏆 Client Satisfaction Award -
                                            Consulting Partners LLC (2017)
                                          </div>
                                          <div>
                                            🏆 Dean's List - Columbia Business
                                            School (2017, 2018)
                                          </div>
                                        </div>
                                      </div>

                                      {/* Professional Development */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          PROFESSIONAL DEVELOPMENT
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Advanced Project Management
                                            Program - Stanford University (2022)
                                          </div>
                                          <div>
                                            • Leadership in Digital
                                            Transformation - MIT Sloan (2021)
                                          </div>
                                          <div>
                                            • Strategic Thinking and Problem
                                            Solving - Wharton Executive
                                            Education (2020)
                                          </div>
                                          <div>
                                            • Change Management Certification -
                                            Prosci (2019)
                                          </div>
                                        </div>
                                      </div>

                                      {/* Professional Associations */}
                                      <div>
                                        <div className="font-bold text-gray-700 mb-0.5 text-[4px] uppercase tracking-wide">
                                          PROFESSIONAL ASSOCIATIONS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Project Management Institute (PMI)
                                            - Active Member since 2016
                                          </div>
                                          <div>
                                            • Scrum Alliance - Certified Member
                                          </div>
                                          <div>
                                            • Women in Technology Leadership -
                                            Board Member
                                          </div>
                                          <div>
                                            • NYC Project Management Meetup -
                                            Organizing Committee
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Template 4: Harvard Classic */}
                              {template.id === "template-4" && (
                                <div className="h-full p-4 text-[6px] bg-white leading-tight">
                                  <div className="text-center mb-3 border-b-2 border-blue-600 pb-2">
                                    <div className="font-bold text-[10px] text-gray-800 tracking-wider">
                                      MICHAEL THOMPSON
                                    </div>
                                    <div className="text-blue-600 font-semibold text-[7px] mt-0.5">
                                      RESEARCH ANALYST
                                    </div>
                                    <div className="text-[5px] text-gray-600 mt-1">
                                      michael.thompson@email.com • +1 (617)
                                      555-0123 • Cambridge, MA
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div>
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                                        EDUCATION
                                      </div>
                                      <div className="text-[5px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Master of Business Administration
                                            (MBA)
                                          </div>
                                          <div className="text-gray-600">
                                            Harvard Business School • 2022-2024
                                            • GPA: 3.9/4.0
                                          </div>
                                          <div className="text-gray-500">
                                            Concentration: Finance & Strategic
                                            Management
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Bachelor of Arts, Economics
                                          </div>
                                          <div className="text-gray-600">
                                            Harvard College • 2016-2020 • Magna
                                            Cum Laude
                                          </div>
                                          <div className="text-gray-500">
                                            Thesis: "Market Efficiency in
                                            Emerging Economies"
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                                        PROFESSIONAL EXPERIENCE
                                      </div>
                                      <div className="text-[5px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Research Analyst
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            Goldman Sachs • 2020 - 2022 • New
                                            York, NY
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Conducted financial analysis for
                                              equity research reports on 15+
                                              companies
                                            </div>
                                            <div>
                                              • Built complex financial models
                                              to evaluate investment
                                              opportunities
                                            </div>
                                            <div>
                                              • Prepared presentations for
                                              senior management and client
                                              meetings
                                            </div>
                                            <div>
                                              • Collaborated with
                                              cross-functional teams on
                                              strategic initiatives
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Summer Analyst
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            McKinsey & Company • Summer 2019 •
                                            Boston, MA
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Supported consulting engagements
                                              for Fortune 500 clients
                                            </div>
                                            <div>
                                              • Performed market research and
                                              competitive analysis
                                            </div>
                                            <div>
                                              • Developed recommendations for
                                              operational improvements
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[6px] uppercase tracking-wide">
                                        ACADEMIC ACHIEVEMENTS
                                      </div>
                                      <div className="text-[5px] text-gray-600 space-y-0.5">
                                        <div>
                                          • Dean's List: Fall 2017, Spring 2018,
                                          Fall 2019, Spring 2020
                                        </div>
                                        <div>
                                          • Phi Beta Kappa Honor Society,
                                          inducted Spring 2020
                                        </div>
                                        <div>
                                          • Harvard Economics Department Prize
                                          for Outstanding Senior Thesis
                                        </div>
                                        <div>
                                          • John Harvard Scholar (top 5% of
                                          class) - 2018, 2019, 2020
                                        </div>
                                        <div>
                                          • Harvard College Research Program
                                          Grant Recipient
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-2">
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[5px] uppercase tracking-wide">
                                        RESEARCH & PUBLICATIONS
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            "Behavioral Economics in Emerging
                                            Markets"
                                          </div>
                                          <div className="text-gray-600">
                                            Harvard Economics Review • Published
                                            Spring 2020
                                          </div>
                                          <div>
                                            • Analyzed consumer behavior
                                            patterns across 12 developing
                                            economies
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            "Impact of Digital Banking on
                                            Financial Inclusion"
                                          </div>
                                          <div className="text-gray-600">
                                            Undergraduate Research Symposium •
                                            Presented Fall 2019
                                          </div>
                                          <div>
                                            • Examined mobile banking adoption
                                            in Sub-Saharan Africa
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-2">
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[5px] uppercase tracking-wide">
                                        LEADERSHIP & ACTIVITIES
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-0.5">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            President, Harvard Economics Society
                                          </div>
                                          <div className="text-gray-600">
                                            2019-2020 • Led organization of 200+
                                            members
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Teaching Fellow, Economics 101
                                          </div>
                                          <div className="text-gray-600">
                                            2019-2020 • Conducted weekly review
                                            sessions for 30+ students
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Varsity Rowing Team
                                          </div>
                                          <div className="text-gray-600">
                                            2016-2020 • Competed at national
                                            collegiate level
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-2">
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[5px] uppercase tracking-wide">
                                        TECHNICAL SKILLS
                                      </div>
                                      <div className="text-[4px] text-gray-600 grid grid-cols-2 gap-x-2">
                                        <div>• Advanced Excel & VBA</div>
                                        <div>• Python & R Programming</div>
                                        <div>• SQL & Database Management</div>
                                        <div>• Stata & SPSS</div>
                                        <div>• Bloomberg Terminal</div>
                                        <div>• Financial Modeling</div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-blue-600 border-b border-blue-600 mb-1 text-[5px] uppercase tracking-wide">
                                        ADDITIONAL INFORMATION
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-0.5">
                                        <div>
                                          • CFA Level I Candidate (exam
                                          scheduled June 2024)
                                        </div>
                                        <div>
                                          • Fluent in English and Spanish,
                                          conversational in Mandarin
                                        </div>
                                        <div>
                                          • Volunteer tutor for underprivileged
                                          high school students
                                        </div>
                                        <div>
                                          • Interests: Economic policy research,
                                          sustainable finance, rowing
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Template 5: Executive Professional */}
                              {template.id === "template-5" && (
                                <div className="h-full bg-white p-2 text-[4px] leading-tight">
                                  {/* Header Section */}
                                  <div className="border-b-2 border-gray-800 pb-1 mb-2">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="font-bold text-[8px] text-gray-800 tracking-wide">
                                          ROBERT ANDERSON
                                        </div>
                                        <div className="text-[5px] text-gray-600 mt-0.5 font-medium">
                                          CHIEF FINANCIAL OFFICER
                                        </div>
                                        <div className="text-[3.5px] text-gray-500 mt-1">
                                          robert.anderson@email.com • +1 (212)
                                          555-0198 • New York, NY
                                          <br />
                                          linkedin.com/in/robertandersoncfo •
                                          Available for C-Suite Opportunities
                                        </div>
                                      </div>
                                      <div className="w-8 h-8 bg-gray-300 rounded border-2 border-gray-800 ml-2 flex-shrink-0"></div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    {/* Left Column */}
                                    <div className="w-1/3 space-y-1.5">
                                      {/* Executive Profile */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          EXECUTIVE PROFILE
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 leading-relaxed">
                                          Fortune 500 CFO with 15+ years of
                                          progressive leadership in financial
                                          strategy, M&A, and organizational
                                          transformation. Proven expertise in
                                          driving $500M+ revenue growth,
                                          optimizing capital structure, and
                                          leading IPO processes.
                                        </div>
                                      </div>

                                      {/* Core Competencies */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          CORE COMPETENCIES
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Financial Strategy & Planning
                                          </div>
                                          <div>• Mergers & Acquisitions</div>
                                          <div>
                                            • Capital Markets & Fundraising
                                          </div>
                                          <div>• Risk Management</div>
                                          <div>• Corporate Governance</div>
                                          <div>
                                            • Financial Reporting & Controls
                                          </div>
                                          <div>
                                            • Team Leadership & Development
                                          </div>
                                          <div>• Board Relations</div>
                                        </div>
                                      </div>

                                      {/* Education */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          EDUCATION
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              MBA, Finance & Strategy
                                            </div>
                                            <div className="text-gray-600">
                                              Harvard Business School • 2010
                                            </div>
                                            <div className="text-gray-500">
                                              Baker Scholar (Top 5%)
                                            </div>
                                          </div>
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              B.S. Accounting
                                            </div>
                                            <div className="text-gray-600">
                                              University of Pennsylvania • 2006
                                            </div>
                                            <div className="text-gray-500">
                                              Summa Cum Laude, Phi Beta Kappa
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Certifications & Licenses */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          CERTIFICATIONS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Certified Public Accountant (CPA)
                                          </div>
                                          <div>
                                            • Chartered Financial Analyst (CFA)
                                          </div>
                                          <div>
                                            • Financial Risk Manager (FRM)
                                          </div>
                                          <div>
                                            • NACD Directorship Certified
                                          </div>
                                        </div>
                                      </div>

                                      {/* Board Positions */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          BOARD POSITIONS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Audit Committee Chair
                                            <br />
                                            TechNova Corporation
                                          </div>
                                          <div>
                                            • Board Member
                                            <br />
                                            NYC Financial Leaders Council
                                          </div>
                                          <div>
                                            • Advisory Board
                                            <br />
                                            FinTech Ventures Fund
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="w-2/3 space-y-1.5">
                                      {/* Professional Experience */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          EXECUTIVE EXPERIENCE
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-1">
                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Chief Financial Officer
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Global Tech Solutions Inc. •
                                              01/2019 - Present • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Led financial strategy for
                                                $2.5B public technology company
                                                with 5,000+ employees
                                              </div>
                                              <div>
                                                • Orchestrated successful IPO
                                                raising $800M in capital,
                                                oversubscribed by 3x
                                              </div>
                                              <div>
                                                • Directed 12 strategic
                                                acquisitions totaling $1.2B,
                                                enhancing market position
                                              </div>
                                              <div>
                                                • Implemented financial systems
                                                transformation saving $25M
                                                annually in operational costs
                                              </div>
                                              <div>
                                                • Established investor relations
                                                program improving analyst
                                                coverage and stock performance
                                              </div>
                                            </div>
                                          </div>

                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Vice President, Corporate Finance
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Fortune Financial Corporation •
                                              03/2015 - 12/2018 • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Managed $500M+ capital raising
                                                activities including debt and
                                                equity financing
                                              </div>
                                              <div>
                                                • Led financial due diligence
                                                for M&A transactions exceeding
                                                $2B in aggregate value
                                              </div>
                                              <div>
                                                • Developed comprehensive
                                                financial planning and analysis
                                                framework
                                              </div>
                                              <div>
                                                • Supervised team of 25+ finance
                                                professionals across multiple
                                                business units
                                              </div>
                                            </div>
                                          </div>

                                          <div>
                                            <div className="font-semibold text-gray-800">
                                              Senior Director, Financial
                                              Planning
                                            </div>
                                            <div className="font-medium text-gray-600">
                                              Investment Banking Corp • 08/2011
                                              - 02/2015 • New York, NY
                                            </div>
                                            <div className="mt-0.5 space-y-0.5">
                                              <div>
                                                • Built financial models and
                                                strategic plans for $1B+
                                                investment portfolio
                                              </div>
                                              <div>
                                                • Established risk management
                                                protocols reducing portfolio
                                                volatility by 30%
                                              </div>
                                              <div>
                                                • Collaborated with C-suite
                                                executives on strategic planning
                                                and capital allocation
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Key Achievements */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          NOTABLE ACHIEVEMENTS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            🏆 CFO of the Year - Financial
                                            Executive Magazine (2023)
                                          </div>
                                          <div>
                                            🏆 Excellence in Financial
                                            Leadership - Fortune 500 Council
                                            (2022)
                                          </div>
                                          <div>
                                            🏆 Outstanding IPO Performance -
                                            Wall Street Journal Awards (2020)
                                          </div>
                                          <div>
                                            🏆 Top 40 Under 40 CFOs - Financial
                                            Times (2018)
                                          </div>
                                        </div>
                                      </div>

                                      {/* Publications & Speaking */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          THOUGHT LEADERSHIP
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • "Digital Transformation in
                                            Corporate Finance" - Harvard
                                            Business Review (2023)
                                          </div>
                                          <div>
                                            • Keynote Speaker - Global CFO
                                            Summit, London (2023)
                                          </div>
                                          <div>
                                            • "ESG Integration in Financial
                                            Strategy" - McKinsey Quarterly
                                            (2022)
                                          </div>
                                          <div>
                                            • Panel Expert - World Economic
                                            Forum, Davos (2022)
                                          </div>
                                          <div>
                                            • "The Future of Capital Markets" -
                                            Journal of Corporate Finance (2021)
                                          </div>
                                        </div>
                                      </div>

                                      {/* Professional Affiliations */}
                                      <div>
                                        <div className="font-bold text-gray-800 mb-0.5 text-[4px] uppercase tracking-wide bg-gray-100 p-0.5">
                                          PROFESSIONAL AFFILIATIONS
                                        </div>
                                        <div className="text-[3.5px] text-gray-600 space-y-0.5">
                                          <div>
                                            • Financial Executives International
                                            (FEI) - Executive Committee Member
                                          </div>
                                          <div>
                                            • National Association of Corporate
                                            Directors (NACD) - Active Member
                                          </div>
                                          <div>
                                            • Young Presidents' Organization
                                            (YPO) - Finance Chair, NYC Chapter
                                          </div>
                                          <div>
                                            • CFA Institute - Charter Holder and
                                            Local Society Board Member
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Template 6: Classic Business */}
                              {template.id === "template-6" && (
                                <div className="h-full p-4 text-[6px] bg-white leading-tight">
                                  <div className="text-center mb-3 border-b-2 border-gray-800 pb-2">
                                    <div className="font-bold text-[10px] text-gray-800 tracking-wider">
                                      ROBERT WILLIAMS
                                    </div>
                                    <div className="text-gray-600 text-[6px] mt-0.5 font-medium">
                                      BUSINESS ANALYST
                                    </div>
                                    <div className="text-[5px] text-gray-500 mt-1">
                                      robert.williams@email.com • +1 (555)
                                      555-0123 • New York, NY
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div>
                                      <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                                        PROFESSIONAL SUMMARY
                                      </div>
                                      <div className="text-[5px] text-gray-600 leading-relaxed">
                                        Results-driven Business Analyst with 6+
                                        years of experience in data analysis,
                                        process improvement, and stakeholder
                                        management. Proven ability to translate
                                        business requirements into actionable
                                        insights and drive strategic
                                        decision-making.
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                                        CORE COMPETENCIES
                                      </div>
                                      <div className="text-[5px] text-gray-600 grid grid-cols-2 gap-x-2">
                                        <div>• Data Analysis & Modeling</div>
                                        <div>• Process Optimization</div>
                                        <div>• SQL & Python</div>
                                        <div>• Tableau & Power BI</div>
                                        <div>• Stakeholder Management</div>
                                        <div>• Requirements Gathering</div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-gray-800 mb-0.5 text-[6px] uppercase tracking-wide">
                                        PROFESSIONAL EXPERIENCE
                                      </div>
                                      <div className="text-[5px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Senior Business Analyst
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            Global Finance Corp • 2020 - Present
                                            • New York, NY
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Analyzed business processes
                                              resulting in 25% efficiency
                                              improvement
                                            </div>
                                            <div>
                                              • Led cross-functional teams of 8+
                                              members on strategic initiatives
                                            </div>
                                            <div>
                                              • Developed automated reporting
                                              dashboards saving 15 hours/week
                                            </div>
                                            <div>
                                              • Identified cost-saving
                                              opportunities worth $2.3M annually
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Business Analyst
                                          </div>
                                          <div className="font-medium text-gray-600">
                                            TechSolutions Inc. • 2018 - 2020 •
                                            New York, NY
                                          </div>
                                          <div className="mt-0.5 space-y-0.5">
                                            <div>
                                              • Conducted market research and
                                              competitive analysis
                                            </div>
                                            <div>
                                              • Created business requirements
                                              documentation for 10+ projects
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-gray-800 mb-0.5 text-[5px] uppercase tracking-wide">
                                        EDUCATION & CERTIFICATIONS
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-0.5">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            MBA in Finance
                                          </div>
                                          <div className="text-gray-600">
                                            Columbia Business School • 2018 •
                                            GPA: 3.9/4.0
                                          </div>
                                          <div className="text-gray-500">
                                            Concentration: Corporate Finance,
                                            Investment Banking
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            B.S. Business Administration
                                          </div>
                                          <div className="text-gray-600">
                                            New York University • 2016 • Summa
                                            Cum Laude
                                          </div>
                                          <div className="text-gray-500">
                                            Major: Finance, Minor: Economics
                                          </div>
                                        </div>
                                        <div className="font-semibold text-gray-700 mt-1">
                                          Professional Certifications:
                                        </div>
                                        <div>
                                          • Certified Business Analysis
                                          Professional (CBAP) - 2023
                                        </div>
                                        <div>
                                          • Six Sigma Green Belt Certification -
                                          2022
                                        </div>
                                        <div>
                                          • Project Management Professional
                                          (PMP) - 2021
                                        </div>
                                        <div>
                                          • Tableau Desktop Certified
                                          Professional - 2023
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-gray-800 mb-0.5 text-[5px] uppercase tracking-wide">
                                        KEY PROJECTS
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-1">
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Digital Transformation Initiative
                                          </div>
                                          <div className="text-gray-600">
                                            Project Lead • 2023
                                          </div>
                                          <div>
                                            • Led cross-functional team of 15+
                                            members across 4 departments
                                          </div>
                                          <div>
                                            • Delivered $5M cost reduction
                                            through process automation
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            Market Entry Strategy Analysis
                                          </div>
                                          <div className="text-gray-600">
                                            Senior Analyst • 2022
                                          </div>
                                          <div>
                                            • Conducted comprehensive market
                                            research for European expansion
                                          </div>
                                          <div>
                                            • Developed business case resulting
                                            in successful $20M market entry
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-gray-800 mb-0.5 text-[5px] uppercase tracking-wide">
                                        TECHNICAL PROFICIENCIES
                                      </div>
                                      <div className="text-[4px] text-gray-600 grid grid-cols-2 gap-x-2">
                                        <div>• Advanced Excel & VBA</div>
                                        <div>• SQL & Database Management</div>
                                        <div>• Python for Data Analysis</div>
                                        <div>• Tableau & Power BI</div>
                                        <div>• SAP & ERP Systems</div>
                                        <div>• JIRA & Confluence</div>
                                        <div>• R Statistical Software</div>
                                        <div>• Salesforce CRM</div>
                                      </div>
                                    </div>

                                    <div className="mb-1.5">
                                      <div className="font-bold text-gray-800 mb-0.5 text-[5px] uppercase tracking-wide">
                                        PROFESSIONAL ASSOCIATIONS
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-0.5">
                                        <div>
                                          • International Institute of Business
                                          Analysis (IIBA) - Member since 2020
                                        </div>
                                        <div>
                                          • Project Management Institute (PMI) -
                                          Active Member
                                        </div>
                                        <div>
                                          • New York Business Analytics
                                          Association - Board Member
                                        </div>
                                        <div>
                                          • Columbia Business School Alumni
                                          Network - Active Participant
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-gray-800 mb-0.5 text-[5px] uppercase tracking-wide">
                                        ADDITIONAL INFORMATION
                                      </div>
                                      <div className="text-[4px] text-gray-600 space-y-0.5">
                                        <div>
                                          • Published researcher with 3 papers
                                          in business analytics journals
                                        </div>
                                        <div>
                                          • Guest lecturer at NYU Stern School
                                          of Business
                                        </div>
                                        <div>
                                          • Fluent in English, Spanish, and
                                          French
                                        </div>
                                        <div>
                                          • Marathon runner and outdoor
                                          enthusiast
                                        </div>
                                        <div>
                                          • Volunteer financial literacy
                                          instructor for non-profits
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Template Info Card */}
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="mb-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                  {template.name}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {template.description}
                                </p>
                              </div>

                              {/* Template Features */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">
                                  {template.hasPhoto ? "📸" : "📄"}{" "}
                                  {template.hasPhoto
                                    ? "With Photo"
                                    : "No Photo"}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
                                  {template.columns} Column
                                  {template.columns > 1 ? "s" : "}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-md">
                                  {template.style.charAt(0).toUpperCase() +
                                    template.style.slice(1)}
                                </span>
                              </div>

                              {/* Action Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTemplateSelect(template.id);
                                }}
                                className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                                  selectedTemplate === template.id
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {selectedTemplate === template.id
                                  ? "✓ Selected"
                                  : "Select Template"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 lg:mt-12">
          <Button
            variant="outline"
            onClick={handlePrev}
            className="w-full sm:w-auto bg-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold border-2 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-sm"
            style={{
              borderColor: 'var(--brand-secondary)',
              color: 'var(--brand-primary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--brand-primary)';
              e.target.style.backgroundColor = 'var(--brand-secondary-lightest)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--brand-secondary)';
              e.target.style.backgroundColor = 'white';
            }}
          >
            <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            Previous
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className={`w-full sm:w-auto px-8 lg:px-12 py-3 lg:py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${
              !selectedTemplate
                ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                : 'text-white'
            }`}
            style={{
              background: !selectedTemplate ? undefined : 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'
            }}
          >
            Continue
            <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        </div> */}
      </div>
      </div>
    </DashboardLayout>
  );
}
