"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, Zap, Target, CheckCircle, Sparkles, FileText, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

function AnalyzingResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const field = searchParams.get("field") || "";
  const education = searchParams.get("education") || "";
  const filename = searchParams.get("filename") || "your-resume.pdf";

  const analysisSteps = useMemo(() => [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Reading your resume...",
      subtitle: "Parsing through your content",
      duration: 1000
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI analyzing content...",
      subtitle: "Understanding your experience",
      duration: 1500
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Checking ATS compatibility...",
      subtitle: "Making sure robots love you",
      duration: 1200
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Identifying improvements...",
      subtitle: "Finding areas to level up",
      duration: 1000
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Generating insights...",
      subtitle: "Creating your review",
      duration: 800
    }
  ], []);

  useEffect(() => {
    let totalDuration = 0;
    const intervals = [];

    analysisSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, totalDuration);

      intervals.push(timer);
      totalDuration += step.duration;
    });

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Navigate to review page after completion
          setTimeout(() => {
            router.push(`/resume-review?field=${field}&education=${education}&filename=${encodeURIComponent(filename)}`);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(progressTimer);
    };
  }, [router, field, education, filename, analysisSteps]);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{background: 'linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)'}}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs matching app theme */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-blue-300 rounded-full filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-300 rounded-full filter blur-xl opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-40 w-24 h-24 bg-blue-200 rounded-full filter blur-xl opacity-15 animate-ping"></div>
        <div className="absolute bottom-40 right-40 w-12 h-12 bg-indigo-400 rounded-full filter blur-xl opacity-25 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-pulse" style={{background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'}}>
                <Brain className="h-8 w-8 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span style={{color: "var(--brand-primary)"}}>
              Analyzing Your Resume
            </span>
            <span className="animate-pulse" style={{color: "var(--brand-primary)"}}>...</span>
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Our AI is working its magic ✨
          </p>
          <p className="text-sm text-gray-500">
            Reviewing: <span className="font-semibold" style={{color: "var(--brand-primary)"}}>{decodeURIComponent(filename)}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold" style={{color: "var(--brand-primary)"}}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full rounded-full h-2 overflow-hidden" style={{backgroundColor: "var(--brand-secondary-light)"}}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))',
                width: `${progress}%`
              }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-3">
          {analysisSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-500 ${
                index === currentStep
                  ? 'border scale-102'
                  : index < currentStep
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
              style={index === currentStep ? {backgroundColor: "var(--brand-secondary-lightest)", borderColor: "var(--brand-secondary)"} : {}}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index === currentStep
                    ? 'animate-pulse'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
                style={index === currentStep ? {background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'} : {}}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <div className={index === currentStep ? 'text-white animate-bounce' : 'text-white'}>
                    {step.icon}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className={`font-semibold text-sm transition-colors duration-500 ${
                  index === currentStep
                    ? ''
                    : index < currentStep
                    ? 'text-green-700'
                    : 'text-gray-600'
                }`}
                  style={index === currentStep ? {color: "var(--brand-primary)"} : {}}>
                  {step.title}
                </h3>
                <p className={`text-xs transition-colors duration-500 ${
                  index === currentStep
                    ? ''
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
                  style={index === currentStep ? {color: "var(--brand-primary)"} : {}}>
                  {step.subtitle}
                </p>
              </div>

              {index === currentStep && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{backgroundColor: "var(--brand-primary)"}}></div>
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce animation-delay-200" style={{backgroundColor: "var(--brand-primary-dark)"}}></div>
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce animation-delay-400" style={{backgroundColor: "var(--brand-primary)"}}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fun Facts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border text-center shadow-sm" style={{borderColor: "var(--brand-secondary)"}}>
            <div className="text-lg mb-1">🚀</div>
            <div className="text-xs font-medium" style={{color: "var(--brand-primary)"}}>Powered by AI</div>
            <div className="text-xs text-gray-600">Next-gen analysis</div>
          </div>
          <div className="bg-white rounded-lg p-3 border text-center shadow-sm" style={{borderColor: "var(--brand-secondary)"}}>
            <div className="text-lg mb-1">⚡</div>
            <div className="text-xs font-medium" style={{color: "var(--brand-primary)"}}>Lightning Fast</div>
            <div className="text-xs text-gray-600">Results in seconds</div>
          </div>
          <div className="bg-white rounded-lg p-3 border text-center shadow-sm" style={{borderColor: "var(--brand-secondary)"}}>
            <div className="text-lg mb-1">🎯</div>
            <div className="text-xs font-medium" style={{color: "var(--brand-primary)"}}>Precision Built</div>
            <div className="text-xs text-gray-600">Tailored insights</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .scale-102 {
          transform: scale(1.02);
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