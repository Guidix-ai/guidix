"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Image from "next/image";
import ComingSoon from "@/components/ComingSoon";

// Set this to true to show the actual content, false to show Coming Soon
const SHOW_CONTENT = false;

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

export default function LinkedInOptimiserPage() {
  const router = useRouter();
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "LinkedIn Optimiser";

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

  const [profile] = useState({
    photoUrl: "/V3.png",
    headline: "Software Developer • AI & Job-Tech • React • Next.js • Building fast",
    about:
      "Full-stack developer focused on AI-powered job platforms and resume enhancement. Led frontend at Collzy, improved conversions by 18%. Expertise in React, Next.js, TypeScript, WebRTC, and Gemini Live API integration.",
    location: "Mumbai, India",
    openToWork: true,
    experiences: [
      {
        title: "Team Lead - Frontend",
        company: "Collzy",
        duration: "2023 - 2024",
        description:
          "Led UI redesign to Tailwind CSS, built AI resume analyzer, improved apply CTR by 18%, reduced bounce rate by 12%.",
      },
      {
        title: "Website Manager",
        company: "Luis N Vaya Pvt Ltd",
        duration: "2022 - 2023",
        description:
          "Managed complete website overhaul, SEO optimization, analytics integration, improved engagement metrics.",
      },
    ],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "WebRTC",
      "Gemini Live API",
      "AI",
      "UI/UX",
    ],
    featured: [{ title: "AI Job Portal Demo", url: "https://example.com" }],
    recommendations: [
      {
        from: "Ex-Manager",
        text: "Owns delivery, writes clean code, and elevates team quality with strong abstractions.",
      },
    ],
  });

  const recommendations = [
    {
      category: "Headline",
      id: "headline",
      suggestions: [
        "Add 2-3 power keywords: React, Next.js, AI, WebRTC",
        "Include 1 quantified outcome: '+18% apply CTR' or 'shipped to 100k users'",
        "Keep under 220 characters for full display",
        "Lead with role title, not 'I'm a developer'",
      ],
      currentScore: 72,
      example:
        "Frontend Developer | React/Next.js • AI Job-Tech • Improved CTR by 18% | Open to opportunities",
    },
    {
      category: "About Section",
      id: "about-section",
      suggestions: [
        "Open with what you build & who benefits (not job titles)",
        "Add 2-3 quantified wins with context and tech used",
        "Include clear CTA: 'Open to roles in [X]' or 'Let's collab on [Y]'",
        "Keep narrative tone; avoid CV-style bullet dumps",
        "Aim for 260-300 words for optimal read-through",
      ],
      currentScore: 65,
      example:
        "Building AI-powered job-tech that feels fast and intuitive. Recently shipped an AI job portal & resume optimizer—improved apply CTR by 18%, cut bounce by 12%. Led frontend redesign from CSS to Tailwind; LCP improved 28%.\n\nStack: React, Next.js, TypeScript, Tailwind, FastAPI, WebRTC, Gemini Live.\n\nLooking to bring outcome-driven UI craft to teams shipping at startup speed.",
    },
    {
      category: "Experience Bullets",
      id: "experience-bullets",
      suggestions: [
        "Use formula: Action + Scope + Tech + Metric",
        "Lead with verb (Led, Shipped, Reduced, Improved, Built)",
        "Include specific tech stack used in the role",
        "Quantify impact: %, users, time saved, revenue, or engagement",
        "Group 3-4 bullets per role by impact theme (UX, perf, growth)",
      ],
      currentScore: 58,
      example:
        "Collzy (Team Lead, Frontend) 2023-2024:\n• Refactored legacy CSS to Tailwind; improved LCP by 28%, session duration +16%\n• Shipped AI resume analyzer with Gemini API; 4.7/5 CSAT, adopted by 5k users\n• Implemented WebRTC for live feedback; audio latency <250ms\n\nLuis N Vaya (Website Manager) 2022-2023:\n• Redesigned site UX; bounce rate −12%, time-on-page +34%\n• Integrated analytics & SEO; organic traffic +45% YoY",
    },
    {
      category: "Skills Section",
      id: "skills-section",
      suggestions: [
        "Prioritize 8-12 core skills aligned to your target roles",
        "Order by relevance to JD keywords, not reverse chronological",
        "Include emerging tech you shipped with (WebRTC, Gemini)",
        "Use exact phrasing from job descriptions (React vs ReactJS)",
        "Avoid generic skills; be specific (Tailwind CSS not just CSS)",
      ],
      currentScore: 81,
      example: "React • Next.js • TypeScript • Tailwind CSS • FastAPI • WebRTC • AI",
    },
    {
      category: "Featured Section",
      id: "featured-section",
      suggestions: [
        "Pin 3-5 standout assets: live demo, case study, repo, talk, post",
        "Lead with most visually impressive or highest-impact first",
        "Include 1 AI project, 1 performance win, 1 UX redesign",
        "Refresh every 3 months to signal active work",
        "Use descriptive titles, not just URLs",
      ],
      currentScore: 35,
      example: "AI Job Portal Demo • Resume Optimizer Case Study • WebRTC Live Audio Demo",
    },
    {
      category: "Recommendations & Social Proof",
      id: "recommendations-proof",
      suggestions: [
        "Request 3 strong recommendations: 1 manager, 1 peer, 1 stakeholder",
        "Ask for specific recommendations tied to metrics or outcomes",
        "Suggest language: 'Shipped X, improved Y metric by Z%'",
        "Encourage 3-4 sentence recs (long > short for credibility)",
        "Prioritize recent recommendations from strong roles",
      ],
      currentScore: 40,
      example:
        "Sample Request: 'Hi [Name], Could you recommend me on LinkedIn? If so, focus on how I shipped [X feature] that improved [Y metric] by [Z%]. Would mean a lot!'",
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`#${sectionId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Show Coming Soon if SHOW_CONTENT is false
  if (!SHOW_CONTENT) {
    return (
      <DashboardLayout>
        <ComingSoon title="LinkedIn Optimizer" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F8F9FF",
          width: "100%",
        }}
      >
        {/* Header Banner */}
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
              className="text-white mb-2"
              style={{
                fontWeight: 700,
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

        {/* Main Content */}
        <div className="md:px-8 md:py-6 px-6 py-4" style={{ backgroundColor: "transparent" }}>
          {/* Profile Optimization Scores - Top Section */}
          <div
            className="rounded-lg shadow-sm transition-all hover:shadow-md mb-6 w-full"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F1F3F7",
              boxShadow: shadowBoxStyle,
              background: "linear-gradient(180deg, #F4F8FF 0%, #D5E4FF 100%)",
              color: "rgb(0, 42, 121)",
              padding: "1.5rem",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg" style={{ fontWeight: 700 }}>
                Profile Optimization Scores
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => scrollToSection(rec.id)}
                  className="p-3 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div className="text-2xl mb-1 text-center" style={{ fontWeight: 700 }}>
                    {rec.currentScore}%
                  </div>
                  <div className="text-xs opacity-90 text-center" style={{ wordBreak: "break-word" }}>
                    {rec.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout: Sticky Profile Preview + Scrollable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Sticky Profile Preview - NO SCROLLBAR */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div
                className="rounded-lg shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F1F3F7",
                  boxShadow: shadowBoxStyle,
                }}
              >
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {profile.photoUrl ? (
                        <Image
                          src={profile.photoUrl}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-white">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2
                        className="text-sm mb-1"
                        style={{
                          color: "rgb(0, 42, 121)",
                          fontWeight: 700,
                          letterSpacing: "-0.36px",
                          lineHeight: "1.3",
                        }}
                      >
                        {profile.headline || "Your headline here"}
                      </h2>
                      <p className="text-xs mb-2" style={{ color: "#6477B4" }}>
                        {profile.location || "Location"}
                      </p>
                      {profile.openToWork && (
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                          style={{
                            backgroundColor: "#E7F0FF",
                            border: "1px solid #2370FF40",
                          }}
                        >
                          <span style={{ fontSize: "10px", color: "#2370FF", fontWeight: 500 }}>
                            ✓ Open to Work
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About */}
                  <div id="about" className="mb-4 pb-4" style={{ borderBottom: "1px solid #F1F3F7" }}>
                    <h3
                      className="text-xs mb-2"
                      style={{
                        color: "rgb(0, 42, 121)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      About
                    </h3>
                    <p className="text-xs" style={{ color: "#3B4E89", lineHeight: "1.6" }}>
                      {profile.about || "Add a compelling about section"}
                    </p>
                  </div>

                  {/* Experience */}
                  <div id="experience" className="mb-4 pb-4" style={{ borderBottom: "1px solid #F1F3F7" }}>
                    <h3
                      className="text-xs mb-2"
                      style={{
                        color: "rgb(0, 42, 121)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Experience
                    </h3>
                    <div className="space-y-3">
                      {profile.experiences && profile.experiences.length > 0 ? (
                        profile.experiences.map((exp, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded"
                            style={{ backgroundColor: "#F8FAFF", border: "1px solid #F1F3F7" }}
                          >
                            <div
                              className="text-xs mb-0.5"
                              style={{ color: "rgb(0, 42, 121)", fontWeight: 700 }}
                            >
                              {exp.title}
                            </div>
                            <div className="text-[11px] mb-1" style={{ color: "#6477B4" }}>
                              {exp.company} • {exp.duration}
                            </div>
                            {exp.description && (
                              <div
                                className="text-[11px]"
                                style={{ color: "#3B4E89", lineHeight: "1.5" }}
                              >
                                {exp.description}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs" style={{ color: "#6477B4" }}>
                          Add work experience
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div id="skills" className="mb-4 pb-4" style={{ borderBottom: "1px solid #F1F3F7" }}>
                    <h3
                      className="text-xs mb-2"
                      style={{
                        color: "rgb(0, 42, 121)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-full text-xs font-500"
                            style={{
                              backgroundColor: "#F0F4FF",
                              border: "1px solid #2370FF40",
                              color: "#2370FF",
                            }}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <div className="text-xs" style={{ color: "#6477B4" }}>
                          Add skills
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured */}
                  <div id="featured" className="mb-4 pb-4" style={{ borderBottom: "1px solid #F1F3F7" }}>
                    <h3
                      className="text-xs mb-2"
                      style={{
                        color: "rgb(0, 42, 121)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Featured
                    </h3>
                    <div className="space-y-2">
                      {profile.featured && profile.featured.length > 0 ? (
                        profile.featured.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded"
                            style={{
                              backgroundColor: "#F8FAFF",
                              border: "1px solid #2370FF40",
                              color: "#2370FF",
                              fontSize: "12px",
                              fontWeight: 500,
                              textDecoration: "none",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#F0F4FF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#F8FAFF";
                            }}
                          >
                            {item.title} ↗
                          </a>
                        ))
                      ) : (
                        <div className="text-xs" style={{ color: "#6477B4" }}>
                          Add featured content
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div id="recommendations">
                    <h3
                      className="text-xs mb-2"
                      style={{
                        color: "rgb(0, 42, 121)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {profile.recommendations && profile.recommendations.length > 0 ? (
                        profile.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded"
                            style={{ backgroundColor: "#F8FAFF", border: "1px solid #F1F3F7" }}
                          >
                            <div
                              className="text-xs mb-1"
                              style={{ color: "rgb(0, 42, 121)", fontWeight: 700 }}
                            >
                              {rec.from}
                            </div>
                            <div
                              className="text-[11px]"
                              style={{ color: "#3B4E89", lineHeight: "1.5" }}
                            >
                              &quot;{rec.text}&quot;
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs" style={{ color: "#6477B4" }}>
                          Get recommendations from colleagues
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Scrollable Recommendations Engine */}
            <div className="lg:col-span-2 space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  id={rec.id}
                  className="rounded-lg shadow-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F1F3F7",
                    boxShadow: shadowBoxStyle,
                  }}
                >
                  <div className="p-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex-1">
                        <h3
                          className="text-sm"
                          style={{ color: "rgb(0, 42, 121)", fontWeight: 700 }}
                        >
                          {rec.category}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className="flex flex-col items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: "#f0f5ff",
                            border: "1px solid #e5e9f2",
                            borderRadius: "12px",
                            padding: "8px 12px",
                          }}
                        >
                          <div
                            className="text-center"
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "rgb(0, 42, 121)",
                            }}
                          >
                            {rec.currentScore}%
                          </div>
                          <div
                            className="text-center"
                            style={{
                              fontSize: "8px",
                              fontWeight: 600,
                              color: "#6477B4",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Score
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions List */}
                    <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #F1F3F7" }}>
                      <h4
                        className="text-xs mb-2"
                        style={{
                          color: "rgb(0, 42, 121)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Recommendations
                      </h4>
                      <ul className="space-y-1.5">
                        {rec.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs" style={{ color: "#3B4E89", lineHeight: "1.5" }}>
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example Box */}
                    <div>
                      <h4
                        className="text-xs mb-2"
                        style={{
                          color: "rgb(0, 42, 121)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Example
                      </h4>
                      <div
                        className="p-2.5 rounded overflow-auto"
                        style={{
                          backgroundColor: "#F8FAFF",
                          border: "1px solid #F1F3F7",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          lineHeight: "1.6",
                          color: "#3B4E89",
                          maxHeight: "150px",
                        }}
                      >
                        {rec.example}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
