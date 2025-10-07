"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
};

export default function ResumeCompletePage() {
  const router = useRouter();

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

  const handleNext = () => {
    router.push("/job-search");
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

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 transition-all hover:opacity-90"
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              border: '1px solid rgba(35, 112, 255, 0.30)',
              background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
              boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Inter',
              textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
              cursor: 'pointer'
            }}
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
