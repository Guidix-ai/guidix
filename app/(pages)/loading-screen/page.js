"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTypewriter } from "@/hooks/useTypewriter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Image from "next/image";

function LoadingScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const displayedText = useTypewriter("building your AI resume", 80, 300);

  const loadingType = searchParams.get("loadingType");
  const isLoadingType1 = loadingType === "1";

  useEffect(() => {
    // Navigate after completion
    const completionTimeout = setTimeout(() => {
      if (isLoadingType1) {
        router.push(`/resume-feedback?${searchParams.toString()}`);
      } else {
        router.push(`/enhanced-resume?${searchParams.toString()}`);
      }
    }, 5000);

    return () => clearTimeout(completionTimeout);
  }, [router, searchParams, isLoadingType1]);

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full flex items-center justify-center" style={{backgroundColor: '#FFFFFF'}}>
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
            Building Your AI Resume
          </h1>
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

export default function LoadingScreen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingScreenContent />
    </Suspense>
  );
}
