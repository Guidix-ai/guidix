"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Image from "next/image";

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

export default function DashboardPage() {
  const router = useRouter();
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Welcome to Guidix";

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
    let currentIndex = 0;
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, currentIndex));
      currentIndex++;
      if (currentIndex > fullText.length) {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "AI Resume Builder",
      description: "Create professional resumes with intelligent AI assistance",
      iconSrc: "/resumebuilding.svg",
      route: "/resume-builder",
      color: "#667eea",
      size: "large",
    },
    {
      title: "AI Job Search",
      description: "Discover personalized job opportunities",
      iconSrc: "/jobsearching.svg",
      route: "/job-search",
      color: "#f093fb",
      size: "large",
    },
    {
      title: "AI Job Apply",
      description: "Automate job applications",
      iconSrc: "/jobapplying.svg",
      route: "/apply-job",
      color: "#4facfe",
      size: "normal",
    },
    {
      title: "AI Job Tracker",
      description: "Track your applications",
      iconSrc: "/jobtracking.svg",
      route: "/job-tracker",
      color: "#43e97b",
      size: "normal",
    },
    {
      title: "AI Mock Interview",
      description: "Practice with AI feedback",
      iconSrc: "/mockinterviewing.svg",
      route: "/mock-interview",
      color: "#fa709a",
      size: "normal",
    },
    {
      title: "LinkedIn Optimizer",
      description: "Optimize your profile",
      iconSrc: "/linkedinoptimising.svg",
      route: "/linkedin-optimizer",
      color: "#30cfd0",
      size: "normal",
    },
  ];

  const insights = {
    recommendedJobs: 300,
    applicationsThisWeek: 5,
    upcomingInterviews: 2,
    profileViews: 34,
  };

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F8F9FF",
          width: "100%",
        }}
      >
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
              className="text-white font-bold mb-2"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                fontSize: "32px",
                lineHeight: "1.2",
                maxWidth: "800px",
              }}
            >
              {typewriterText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h1>
          </div>
        </div>

        <div
          className="md:px-8 md:py-6 px-6 py-4"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-[repeat(3,1fr)] gap-4 mb-4">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => router.push(feature.route)}
                className={`rounded-lg shadow-sm relative transition-all hover:shadow-md cursor-pointer ${
                  feature.size === "large"
                    ? "col-span-1 min-h-[85px]"
                    : "md:col-auto col-span-2 min-h-[70px]"
                }`}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F1F3F7",
                  boxShadow: shadowBoxStyle,
                  // gridColumn: feature.size === "large" ? "span 2" : "span 1",
                  // minHeight: feature.size === "large" ? "85px" : "70px",
                }}
              >
                <div className="p-3 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                      {feature.iconSrc ? (
                        <Image
                          src={feature.iconSrc}
                          alt={feature.title}
                          width={32}
                          height={32}
                        />
                      ) : (
                        feature.icon
                      )}
                    </div>
                    <h3
                      className="text-sm font-bold mb-1"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 500,
                        lineHeight: "1.2",
                        letterSpacing: "-0.36px",
                        verticalAlign: "middle",
                        color: "#002A79",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "11.44px",
                        lineHeight: "150%",
                        color: "#6477B4",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ color: "#2370FF" }}
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className=" transition-all "
            style={{
              // backgroundColor: "#FFFFFF",
              // border: "1px solid #F1F3F7",
              // boxShadow: shadowBoxStyle,
              // background: "#fff",
              color: "#002A79",
              // padding: "1.5rem",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              {/* <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ color: "white" }}
                >
                  <path
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}
              <h3 className="text-[20px] font-bold">Your Insights</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow:
                    "var(--ShadowPositioningNone) var(--ShadowPositioningNone) var(--ShadowBlur2XSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark15), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurExtraSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurMedium) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningNegativeMedium) var(--ShadowBlurExtraSmall) var(--ShadowBlurNone) var(--ColorsOverlayColorsDark10) inset",
                }}
              >
                <div className="text-2xl font-bold mb-1">
                  <div className="flex items-center gap-1">
                    <img
                      src="social-connect.svg"
                      className="w-[32px] h-[32px]"
                    />
                    <div className="text-[32px] font-medium">
                      <span className="">{insights.recommendedJobs}</span>
                      <span style={{ color: "#2370FF" }}>+</span>
                    </div>
                  </div>
                </div>
                <div className="text-[14px] opacity-90">Recommended Jobs</div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow:
                    "var(--ShadowPositioningNone) var(--ShadowPositioningNone) var(--ShadowBlur2XSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark15), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurExtraSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurMedium) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningNegativeMedium) var(--ShadowBlurExtraSmall) var(--ShadowBlurNone) var(--ColorsOverlayColorsDark10) inset",
                }}
              >
                <div className="text-2xl font-bold mb-1">
                  <div className="flex items-center gap-1">
                    <img
                      src="/application-this-week.svg"
                      className="w-[32px] h-[32px] object-cover"
                    />
                    <div className="text-[32px] font-medium">
                      {insights.applicationsThisWeek}
                      <span style={{ color: "#2370FF", fontWeight: 700 }}>
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[14px] opacity-90">
                  Applications This Week
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow:
                    "var(--ShadowPositioningNone) var(--ShadowPositioningNone) var(--ShadowBlur2XSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark15), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurExtraSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurMedium) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningNegativeMedium) var(--ShadowBlurExtraSmall) var(--ShadowBlurNone) var(--ColorsOverlayColorsDark10) inset",
                }}
              >
                <div className="text-2xl font-bold mb-1">
                  <div className="flex items-center gap-1">
                    <img
                      src="/upcoming-interviews.svg"
                      className="w-[32px] h-[32px] object-cover"
                    />
                    <div className="text-[32px] font-medium">
                      {insights.upcomingInterviews}
                      <span style={{ color: "#2370FF" }}>%</span>
                    </div>
                  </div>
                </div>
                <div className="text-[14px] opacity-90">
                  Upcoming Interviews
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow:
                    "var(--ShadowPositioningNone) var(--ShadowPositioningNone) var(--ShadowBlur2XSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark15), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurExtraSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurMedium) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4), var(--ShadowPositioningNone) var(--ShadowPositioningNegativeMedium) var(--ShadowBlurExtraSmall) var(--ShadowBlurNone) var(--ColorsOverlayColorsDark10) inset",
                }}
              >
                <div className="text-2xl font-bold mb-1">
                  <div className="flex items-center gap-1">
                    <img
                      src="/jobapplying.svg"
                      className="w-[32px] h-[32px] object-cover"
                    />
                    <div className="text-[32px] font-medium">
                      {insights.profileViews}
                      <span style={{ color: "#2370FF", fontWeight: 700 }}>
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[14px] opacity-90">Profile Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
