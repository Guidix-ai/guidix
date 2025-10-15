"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTypewriter } from "@/hooks/useTypewriter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Image from "next/image";
import ResumeBreadcrumbs from "@/components/ResumeBreadcrumbs";

function AnalyzingResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const displayedText = useTypewriter("analyzing your resume", 80, 300);

  const field = searchParams.get("field") || "";
  const education = searchParams.get("education") || "";
  const filename = searchParams.get("filename") || "your-resume.pdf";

  useEffect(() => {
    // Navigate to review page after 5 seconds
    const navigationTimer = setTimeout(() => {
      router.push(`/resume-review?field=${field}&education=${education}&filename=${encodeURIComponent(filename)}`);
    }, 5000);

    return () => clearTimeout(navigationTimer);
  }, [router, field, education, filename]);

  return (
    <DashboardLayout progressBar={
      <ResumeBreadcrumbs
        currentStep={3}
        totalSteps={6}
        inNavbar={true}
        steps={[
          { id: 1, label: 'Info', route: '/resume-confirmation?path=upload' },
          { id: 2, label: 'Upload', route: '/upload-resume' },
          { id: 3, label: 'Analyzing', route: '#' },
          { id: 4, label: 'Review', route: '#' },
          { id: 5, label: 'Template', route: '#' },
          { id: 6, label: 'Editor', route: '#' }
        ]}
      />
    }>
      <div className="min-h-screen w-full flex flex-col" style={{backgroundColor: '#FFFFFF'}}>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-8">
          {/* Loading Spinner */}
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 border-[5px] rounded-full animate-spin"
              style={{
                borderColor: 'transparent',
                borderTopColor: '#4A90E2',
              }}
            ></div>
          </div>

          {/* Text */}
          <h1
            className="text-[24px] font-normal text-center"
            style={{
              color: '#1F4788',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Analyzing Your Resume
          </h1>
        </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

export default function AnalyzingResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyzingResumePageContent />
    </Suspense>
  );
}