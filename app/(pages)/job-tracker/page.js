'use client'
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { JobTrackerNew } from "@/components/JobTrackerNew";
import styles from "@/app/styles/pages/job-tracker.module.css";

export default function JobTrackerPage() {
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Track Your Jobs";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const typingSpeed = 100;

    const typeWriter = () => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        setShowCursor(false);
      }
    };

    typeWriter();

    return () => {
      index = fullText.length;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header Section - Similar to Resume Builder */}
        <div
          className="relative py-[12px] px-[16px] md:py-6 md:px-8 overflow-hidden min-h-[56px] md:min-h-[100px]"
          style={{
            backgroundImage: "url(/header-banner.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 4px 20px 0 #2370FF66",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              className="text-white font-bold text-[24px] md:text-[32px]"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                lineHeight: "1.2",
              }}
            >
              {typewriterText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h1>
          </div>
        </div>

        {/* New Job Tracker Layout */}
        <JobTrackerNew />
      </div>
    </DashboardLayout>
  );
}
