"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FileText, Brain, Sparkles, CheckCircle } from "lucide-react";

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

function LoadingScreenContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadingType = searchParams.get("loadingType");
  const isLoadingType1 = loadingType === "1";
  const userPrompt = searchParams.get("prompt");

  useEffect(() => {
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

    return () => {
      document.head.removeChild(googleFontsLink);
      document.head.removeChild(style);
    };
  }, []);

  // Extract user name from prompt for personalization
  const extractUserName = (prompt) => {
    if (!prompt) return "there";

    const patterns = [
      /I'm\s+\*\*([A-Za-z]+)\*\*/i,
      /I\s+am\s+\*\*([A-Za-z]+)\*\*/i,
      /Hey!\s+I'm\s+\*\*([A-Za-z]+)\*\*/i,
      /What's\s+up!\s+I'm\s+\*\*([A-Za-z]+)\*\*/i,
      /Hey\s+there!\s+I'm\s+\*\*([A-Za-z]+)\*\*/i,
      /I'm\s+([A-Za-z]+)/i,
      /I\s+am\s+([A-Za-z]+)/i,
      /Hey!\s+I'm\s+([A-Za-z]+)/i,
      /What's\s+up!\s+I'm\s+([A-Za-z]+)/i,
      /Hey\s+there!\s+I'm\s+([A-Za-z]+)/i,
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return "there";
  };

  const userName = extractUserName(userPrompt);

  const loadingMessages = isLoadingType1
    ? [
        {
          icon: FileText,
          title: "Reviewing, analyzing your resume...",
          description: `Scanning your content and structure, ${userName}!`,
        },
        {
          icon: Brain,
          title: "Identifying key strengths...",
          description: `Finding areas for improvement, ${userName}`,
        },
        {
          icon: Sparkles,
          title: "Generating feedback...",
          description: `This looks great, ${userName}! Preparing detailed analysis`,
        },
        {
          icon: CheckCircle,
          title: "Analysis complete!",
          description: `Ready to show insights, ${userName}!`,
        },
      ]
    : [
        {
          icon: FileText,
          title: "Making your resume with AI...",
          description: `Hang tight, ${userName}, crafting your professional document! ✨`,
        },
        {
          icon: Brain,
          title: "Optimizing for ATS systems...",
          description: `Making sure you get noticed, ${userName}!`,
        },
        {
          icon: Sparkles,
          title: "Applying final enhancements...",
          description: `Almost there, ${userName}! Adding that professional polish`,
        },
        {
          icon: CheckCircle,
          title: "Your resume is ready!",
          description: `Amazing work, ${userName}! Let's see your masterpiece 🚀`,
        },
      ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    // Navigate after completion
    const completionTimeout = setTimeout(() => {
      if (isLoadingType1) {
        router.push(`/resume-feedback?${searchParams.toString()}`);
      } else {
        router.push(`/enhanced-resume?${searchParams.toString()}`);
      }
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completionTimeout);
    };
  }, [router, searchParams, loadingMessages.length, isLoadingType1]);

  const CurrentIcon = loadingMessages[currentStep]?.icon || Loader2;

  return (
    <div
      className="h-screen flex items-center justify-center overflow-hidden relative"
      style={{ backgroundColor: colorTokens.bgLight }}
    >
      {/* Floating Background Elements - Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-16 left-10 w-12 h-12 rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: colorTokens.secondary600 }}
        ></div>
        <div
          className="absolute top-20 right-16 w-10 h-10 rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: colorTokens.secondary700 }}
        ></div>
        <div
          className="absolute bottom-16 left-20 w-8 h-8 rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: colorTokens.secondary600 }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-10 h-10 rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: colorTokens.paragraph }}
        ></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10 h-full flex items-center">
        {/* Main Loading Container */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden w-full"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #F1F3F7",
            boxShadow: shadowBoxStyle,
          }}
        >
          <div className="flex items-center gap-8">
            {/* Left Side - Loading Animation */}
            <div className="w-1/2 text-center">
              <div className="relative mb-6">
                <div
                  className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(180deg, #679CFF 0%, ${colorTokens.secondary600} 100%)`,
                    border: "1px solid #F1F3F7",
                    boxShadow: shadowBoxStyle,
                  }}
                >
                  <CurrentIcon
                    className={`h-16 w-16 ${
                      currentStep < loadingMessages.length - 1
                        ? "animate-spin"
                        : ""
                    }`}
                    style={{ color: "#FFFFFF" }}
                  />
                </div>

                {/* Progress Ring */}
                <svg
                  className="absolute inset-0 w-32 h-32 mx-auto transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#E1E4EB"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={colorTokens.secondary600}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progress * 2.64} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="mt-4 h-1.5 w-48 mx-auto rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${colorTokens.secondary700} 0%, ${colorTokens.secondary600} 100%)`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: colorTokens.title,
                    fontFamily: "Inter",
                    fontWeight: 500,
                    letterSpacing: "-0.36px",
                  }}
                >
                  {loadingMessages[currentStep]?.title || "Processing..."}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: colorTokens.paragraph,
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "11.44px",
                    lineHeight: "150%",
                  }}
                >
                  {loadingMessages[currentStep]?.description ||
                    `Please wait while we work on your resume, ${userName}`}
                </p>
                <div
                  className="text-lg font-bold"
                  style={{
                    color: colorTokens.secondary600,
                    fontFamily: "Inter",
                    fontWeight: 700,
                  }}
                >
                  {progress}% Complete
                </div>
              </div>
            </div>

            {/* Right Side - Steps Progress */}
            <div className="w-1/2">
              <div className="space-y-4">
                {loadingMessages.map((message, index) => {
                  const Icon = message.icon;
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 transition-all duration-500"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500"
                        style={
                          isCompleted
                            ? {
                                background:
                                  "linear-gradient(135deg, #10B981, #34D399)",
                                color: "#FFFFFF",
                                border: "1px solid #F1F3F7",
                                boxShadow: shadowBoxStyle,
                              }
                            : isCurrent
                            ? {
                                background: `linear-gradient(180deg, #679CFF 0%, ${colorTokens.secondary600} 100%)`,
                                color: "#FFFFFF",
                                border: "1px solid #F1F3F7",
                                boxShadow: shadowBoxStyle,
                              }
                            : {
                                backgroundColor: "#E5E7EB",
                                color: "#9CA3AF",
                                border: "1px solid #F1F3F7",
                                boxShadow: shadowBoxStyle,
                              }
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              ((index + (isCompleted ? 1 : 0)) /
                                loadingMessages.length) *
                                100
                            )}%`,
                            background:
                              isCompleted || isCurrent
                                ? `linear-gradient(90deg, ${colorTokens.secondary700} 0%, ${colorTokens.secondary600} 100%)`
                                : "#E5E7EB",
                          }}
                        ></div>
                      </div>
                      {isCompleted && (
                        <div className="animate-pulse">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: "#10B981",
                              color: "#FFFFFF",
                              border: "1px solid #F1F3F7",
                              boxShadow: shadowBoxStyle,
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Visual Footer Accent */}
              <div className="mt-6 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${colorTokens.secondary700} 0%, ${colorTokens.secondary600} 100%)`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingScreen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingScreenContent />
    </Suspense>
  );
}
