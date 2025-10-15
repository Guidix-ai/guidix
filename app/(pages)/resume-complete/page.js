"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArrowRight, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { getIntegratedJobsWithResumeId } from "@/services/jobService";
import { handleApiError, logError } from "@/utils/errorHandler";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
};

export default function ResumeCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  useEffect(() => {
    // Get resumeId from sessionStorage
    const storedResumeId = sessionStorage.getItem('resumeIdUsedForJobs') ||
                           sessionStorage.getItem('createdResumeId') ||
                           sessionStorage.getItem('uploadedResumeId');

    if (storedResumeId) {
      setResumeId(storedResumeId);
      console.log('📋 Resume ID loaded:', storedResumeId);
    } else {
      console.warn('⚠️ No resume ID found in sessionStorage');
    }
  }, []);

  useEffect(() => {
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    googleFontsLink.rel = 'stylesheet';
    document.head.appendChild(googleFontsLink);

    const style = document.createElement('style');
    style.innerHTML = `
      * {
        font-family: 'Inter', sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    // Trigger confetti on page load
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fire confetti from two sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleNext = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a resume ID
      if (!resumeId) {
        console.error('❌ No resume ID found');
        setError('Resume ID not found. Redirecting anyway...');
        setTimeout(() => {
          router.push("/job-search");
        }, 1500);
        return;
      }

      console.log('🚀 Fetching integrated jobs with resume ID:', resumeId);

      // Call the integrated jobs API
      const response = await getIntegratedJobsWithResumeId(resumeId);

      if (response.success) {
        console.log('✅ Integrated jobs fetched successfully!');
        console.log('📊 Total jobs:', response.data.total_jobs);
        console.log('🎯 Jobs returned:', response.data.jobs?.length);
        console.log('🔍 Extracted filters:', response.data.extracted_filters);
        console.log('⚡ Cache used:', response.data.cache_used);

        // Store the integrated jobs data in sessionStorage
        sessionStorage.setItem('integratedJobsData', JSON.stringify(response.data));
        sessionStorage.setItem('integratedJobsTimestamp', Date.now().toString());

        // Navigate to job search page
        router.push("/job-search");
      } else {
        console.error('❌ Failed to fetch integrated jobs:', response.message);
        setError(response.message || 'Failed to fetch job matches');
        setLoading(false);

        // Navigate anyway after showing error
        setTimeout(() => {
          router.push("/job-search");
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Error fetching integrated jobs:', err);
      const errorMessage = handleApiError(err);
      logError('ResumeCompletePage - handleNext', err);
      setError(errorMessage);
      setLoading(false);

      // Navigate to job search page anyway even if API fails
      setTimeout(() => {
        router.push("/job-search");
      }, 2000);
    }
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center px-8"
        style={{ backgroundColor: colorTokens.bgLight }}
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Success Icon/Illustration */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/resume_complete_icon.svg"
              alt="Resume Complete"
              width={96}
              height={96}
            />
          </div>

          {/* Main Heading */}
          <h1
            className="font-bold mb-4"
            style={{
              color: colorTokens.title,
              fontSize: '48px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter',
              fontWeight: 700
            }}
          >
            Your resume looks great!
          </h1>

          {/* Decorative Line */}
          <div
            className="mx-auto mb-6"
            style={{
              width: '80px',
              height: '4px',
              background: `linear-gradient(90deg, ${colorTokens.secondary600} 0%, ${colorTokens.secondary700} 100%)`,
              borderRadius: '2px'
            }}
          ></div>

          {/* Subtitle */}
          <p
            className="mb-12"
            style={{
              color: colorTokens.paragraph,
              fontSize: '18px',
              lineHeight: '150%',
              fontFamily: 'Inter',
              fontWeight: 400
            }}
          >
            Now let&apos;s find some jobs for you
          </p>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B'
              }}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={loading}
            className="inline-flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              border: '1px solid rgba(35, 112, 255, 0.30)',
              background: loading ? '#9CA3AF' : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
              boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Inter',
              textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Finding Jobs...</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
