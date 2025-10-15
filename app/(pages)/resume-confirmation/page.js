"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getSuggestedPrompts } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";
import ResumeBreadcrumbs from "@/components/ResumeBreadcrumbs";
import {
  Monitor,
  Radio,
  Settings,
  Building,
  Zap,
  FlaskConical,
  Brain,
  Shield,
  BarChart3,
  Heart,
} from "lucide-react";

// Top engineering branches
const engineeringBranches = [
  { id: "cse", name: "Computer Science & Engineering", icon: Monitor },
  { id: "ece", name: "Electronics & Communication", icon: Radio },
  { id: "mechanical", name: "Mechanical Engineering", icon: Settings },
  { id: "civil", name: "Civil Engineering", icon: Building },
  { id: "electrical", name: "Electrical Engineering", icon: Zap },
  { id: "chemical", name: "Chemical Engineering", icon: FlaskConical },
  { id: "ai-ml", name: "AI & Machine Learning", icon: Brain },
  { id: "cybersecurity", name: "Cybersecurity", icon: Shield },
  { id: "data-science", name: "Data Science", icon: BarChart3 },
  { id: "biomedical", name: "Biomedical Engineering", icon: Heart },
];

// Engineering fields mapping for API
const engineeringFields = {
  cse: { name: "Computer Science & Engineering (CSE)", icon: Monitor },
  ece: { name: "Electronics & Communication Engineering (ECE)", icon: Radio },
  mechanical: { name: "Mechanical Engineering", icon: Settings },
  civil: { name: "Civil Engineering", icon: Building },
  electrical: { name: "Electrical Engineering", icon: Zap },
  chemical: { name: "Chemical Engineering", icon: FlaskConical },
  "ai-ml": { name: "Artificial Intelligence & Machine Learning", icon: Brain },
  cybersecurity: { name: "Cyber Security", icon: Shield },
  "data-science": { name: "Data Science & Engineering", icon: BarChart3 },
  biomedical: { name: "Biomedical Engineering", icon: Heart },
};

// Button styles from job-search page
const buttonStyles = {
  selected: {
    display: "inline-flex",
    padding: "14px 20px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
    border: "1px solid rgba(35, 112, 255, 0.30)",
    boxShadow:
      "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
    color: "#FFFFFF",
    textShadow:
      "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: "125%",
    letterSpacing: "-0.36px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
  },
  unselected: {
    display: "inline-flex",
    padding: "14px 20px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D5E4FF",
    background: "linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)",
    boxShadow: "0 4px 8px -2px rgba(0, 19, 88, 0.10)",
    color: "#474FA3",
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: "125%",
    letterSpacing: "-0.32px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
  },
};

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

function ResumeConfirmationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [jobType, setJobType] = useState("");
  const [path, setPath] = useState("");
  const [animateIn, setAnimateIn] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const pathParam = searchParams.get("path");
    console.log("🔍 Resume Confirmation - Path Param:", pathParam);
    if (pathParam) setPath(pathParam);
  }, [searchParams]);

  useEffect(() => {
    // Google Fonts Inter
    const googleFontsLink = document.createElement("link");
    googleFontsLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    googleFontsLink.rel = "stylesheet";
    document.head.appendChild(googleFontsLink);

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        font-family: 'Inter', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Typewriter effect for banner
  useEffect(() => {
    let fullText = "Let's Build Your Perfect Resume!";

    if (academicYear && branch && jobType) {
      const yearText =
        academicYear === "first"
          ? "1st Year"
          : academicYear === "second"
          ? "2nd Year"
          : academicYear === "third"
          ? "3rd Year"
          : "4th Year";
      const branchText =
        engineeringBranches.find((b) => b.id === branch)?.name || "";
      const jobText = jobType === "internship" ? "Internship" : "Full-time Job";
      fullText = `${yearText} • ${branchText} • ${jobText}`;
    } else if (academicYear && branch) {
      const yearText =
        academicYear === "first"
          ? "1st Year"
          : academicYear === "second"
          ? "2nd Year"
          : academicYear === "third"
          ? "3rd Year"
          : "4th Year";
      const branchText =
        engineeringBranches.find((b) => b.id === branch)?.name || "";
      fullText = `${yearText} • ${branchText}`;
    } else if (academicYear) {
      const yearText =
        academicYear === "first"
          ? "1st Year"
          : academicYear === "second"
          ? "2nd Year"
          : academicYear === "third"
          ? "3rd Year"
          : "4th Year";
      fullText = `${yearText}`;
    }

    setTypewriterText("");
    setShowCursor(true);
    let index = 0;
    const typingSpeed = 50;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [academicYear, branch, jobType]);

  const handleAcademicYearSelect = (year) => {
    setAcademicYear(year);
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(2);
      setAnimateIn(true);
    }, 300);
  };

  const handleBranchSelect = (branchId) => {
    setBranch(branchId);
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(3);
      setAnimateIn(true);
    }, 300);
  };

  const handleJobTypeSelect = async (type) => {
    setJobType(type);

    // Navigate immediately
    const targetUrl =
      path === "ai" || !path
        ? `/ai-prompt?fields=${branch}&education=${academicYear}&career=${type}`
        : `/upload-resume?fields=${branch}&education=${academicYear}&career=${type}`;

    console.log("🚀 Resume Confirmation - Navigating to:", targetUrl);
    console.log(
      "📋 Path:",
      path,
      "Branch:",
      branch,
      "Year:",
      academicYear,
      "Career:",
      type
    );

    router.push(targetUrl);

    // Call API in background
    try {
      // Year mapping
      const yearMapping = {
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
      };

      const academicYearNum = yearMapping[academicYear] || 1;
      const fieldName =
        engineeringFields[branch]?.name || "Computer Science & Engineering";
      const careerType = type === "internship" ? "internship" : "job";

      // Call the suggested prompts API
      const response = await getSuggestedPrompts(
        academicYearNum,
        "Bachelor of Technology",
        fieldName,
        careerType
      );

      if (response.success && response.data.suggested_prompts) {
        sessionStorage.setItem(
          "suggestedPrompts",
          JSON.stringify(response.data.suggested_prompts)
        );
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      logError("ResumeConfirmationPage:handleJobTypeSelect", err);
      console.warn("Failed to fetch suggested prompts:", errorMessage);
    }
  };

  const handleBack = () => {
    setAnimateIn(false);
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setAnimateIn(true);
      }
    }, 300);
  };

  const progressBarElement = (path === "ai" || !path) ? (
    <ResumeBreadcrumbs currentStep={1} totalSteps={4} inNavbar={true} />
  ) : (
    <ResumeBreadcrumbs
      currentStep={1}
      totalSteps={6}
      inNavbar={true}
      steps={[
        { id: 1, label: "Info", route: "/resume-confirmation?path=upload" },
        { id: 2, label: "Upload", route: "#" },
        { id: 3, label: "Analyzing", route: "#" },
        { id: 4, label: "Review", route: "#" },
        { id: 5, label: "Template", route: "#" },
        { id: 6, label: "Editor", route: "#" },
      ]}
    />
  );

  return (
    <DashboardLayout progressBar={progressBarElement}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F8F9FF",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Blue Banner */}
        <div
          className="relative py-6 px-8 overflow-hidden flex items-center"
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
              className="text-white font-semibold"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                fontSize: "32px",
                lineHeight: "1.2",
              }}
            >
              {typewriterText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h1>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "2rem 1rem 120px 1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              width: "100%",
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Question Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F3F7",
                boxShadow: shadowBoxStyle,
                borderRadius: "16px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Step 1: Academic Year */}
              {currentStep === 1 && (
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#002A79",
                      marginBottom: "0.75rem",
                      textAlign: "center",
                      lineHeight: "1.3",
                    }}
                  >
                    What year are you currently in?
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6D7586",
                      textAlign: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    Select your current academic year
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {[
                      { value: "first", label: "1st Year" },
                      { value: "second", label: "2nd Year" },
                      { value: "third", label: "3rd Year" },
                      { value: "fourth", label: "4th Year" },
                    ].map((year) => (
                      <button
                        key={year.value}
                        onClick={() => handleAcademicYearSelect(year.value)}
                        style={
                          academicYear === year.value
                            ? buttonStyles.selected
                            : buttonStyles.unselected
                        }
                        onMouseEnter={(e) => {
                          if (academicYear !== year.value) {
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {year.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Engineering Branch */}
              {currentStep === 2 && (
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#002A79",
                      marginBottom: "0.75rem",
                      textAlign: "center",
                      lineHeight: "1.3",
                    }}
                  >
                    What&apos;s your engineering branch?
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6D7586",
                      textAlign: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    Choose your field of specialization
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {engineeringBranches.map((branchItem) => {
                      const IconComponent = branchItem.icon;
                      return (
                        <button
                          key={branchItem.id}
                          onClick={() => handleBranchSelect(branchItem.id)}
                          style={{
                            ...(branch === branchItem.id
                              ? buttonStyles.selected
                              : buttonStyles.unselected),
                            flexDirection: "column",
                            gap: "6px",
                            padding: "14px 10px",
                            minHeight: "80px",
                            color:
                              branch === branchItem.id ? "#FFFFFF" : "#6477B4",
                          }}
                          onMouseEnter={(e) => {
                            if (branch !== branchItem.id) {
                              e.currentTarget.style.opacity = "0.9";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <IconComponent
                            size={20}
                            style={{ color: "#2370FF" }}
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              lineHeight: "1.2",
                              color: "#6477B4",
                            }}
                          >
                            {branchItem.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Job Type */}
              {currentStep === 3 && (
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#002A79",
                      marginBottom: "0.75rem",
                      textAlign: "center",
                      lineHeight: "1.3",
                    }}
                  >
                    What are you looking for?
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6D7586",
                      textAlign: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    Select your preferred opportunity type
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {[
                      { value: "internship", label: "Internship" },
                      { value: "fulltime", label: "Full-time Job" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleJobTypeSelect(type.value)}
                        style={{
                          ...(jobType === type.value
                            ? buttonStyles.selected
                            : buttonStyles.unselected),
                        }}
                        onMouseEnter={(e) => {
                          if (jobType !== type.value) {
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ResumeConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeConfirmationPageContent />
    </Suspense>
  );
}
