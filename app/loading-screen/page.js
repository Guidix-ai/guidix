"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Brain, Sparkles, CheckCircle } from "lucide-react";
import styles from "@/app/styles/pages/loading-screen.module.css";

function LoadingScreenContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadingType = searchParams.get('loadingType');
  const isLoadingType1 = loadingType === '1';
  const userPrompt = searchParams.get('prompt');

  // Extract user name from prompt for personalization
  const extractUserName = (prompt) => {
    if (!prompt) return "there";

    // Look for common patterns: "I'm [Name]" or "I am [Name]"
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
      /Hey\s+there!\s+I'm\s+([A-Za-z]+)/i
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

  const loadingMessages = isLoadingType1 ? [
    {
      icon: FileText,
      title: "Reviewing, analyzing your resume...",
      description: `Scanning your content and structure, ${userName}!`
    },
    {
      icon: Brain,
      title: "Identifying key strengths...",
      description: `Finding areas for improvement, ${userName}`
    },
    {
      icon: Sparkles,
      title: "Generating feedback...",
      description: `This looks great, ${userName}! Preparing detailed analysis`
    },
    {
      icon: CheckCircle,
      title: "Analysis complete!",
      description: `Ready to show insights, ${userName}!`
    }
  ] : [
    {
      icon: FileText,
      title: "Making your resume with AI...",
      description: `Hang tight, ${userName}, crafting your professional document! ✨`
    },
    {
      icon: Brain,
      title: "Optimizing for ATS systems...",
      description: `Making sure you get noticed, ${userName}!`
    },
    {
      icon: Sparkles,
      title: "Applying final enhancements...",
      description: `Almost there, ${userName}! Adding that professional polish`
    },
    {
      icon: CheckCircle,
      title: "Your resume is ready!",
      description: `Amazing work, ${userName}! Let's see your masterpiece 🚀`
    }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
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
        // First loading screen - go to feedback
        router.push(`/resume-feedback?${searchParams.toString()}`);
      } else {
        // Second loading screen - go to enhanced resume
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
    <div className="h-screen flex items-center justify-center overflow-hidden relative" style={{background: 'linear-gradient(135deg, #F4F8FF 0%, #E9F1FF 50%, #DDE7FF 100%)'}}>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-10 w-12 h-12 rounded-full opacity-15 animate-pulse" style={{background: 'linear-gradient(135deg, #2370FF, #79C7FF)'}}></div>
        <div className="absolute top-20 right-16 w-10 h-10 rounded-full opacity-10 animate-pulse" style={{background: 'linear-gradient(135deg, #79C7FF, #A3D5FF)'}}></div>
        <div className="absolute bottom-16 left-20 w-8 h-8 rounded-full opacity-15 animate-pulse" style={{background: 'linear-gradient(135deg, #2370FF, #4F87FF)'}}></div>
        <div className="absolute bottom-20 right-10 w-10 h-10 rounded-full opacity-10 animate-pulse" style={{background: 'linear-gradient(135deg, #A3D5FF, #C4E4FF)'}}></div>
        <div className="absolute inset-0" style={{background: 'radial-gradient(60% 80% at 50% 50%, rgba(35,112,255,0.08) 0%, rgba(255,255,255,0) 60%)'}}></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10 h-full flex items-center">

        {/* Main Loading Container */}
        <div className="rounded-2xl shadow-2xl border border-gray-200 p-6 relative overflow-hidden w-full" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)'}}>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{background: 'linear-gradient(135deg, #2370FF, #79C7FF)', borderRadius: '0 0 0 100%'}}></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 opacity-10" style={{background: 'linear-gradient(135deg, #79C7FF, #A3D5FF)', borderRadius: '0 100% 0 0'}}></div>

          <div className="flex items-center gap-8">

            {/* Left Side - Loading Animation */}
            <div className="w-1/2 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center shadow-xl relative" style={{background: 'linear-gradient(135deg, #2370FF, #79C7FF)', boxShadow: '0 10px 30px rgba(35,112,255,0.35)'}}>
                  <CurrentIcon className={`h-16 w-16 text-white ${currentStep < loadingMessages.length - 1 ? 'animate-spin' : ''}`} />
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
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progress * 2.64} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2370FF" />
                      <stop offset="50%" stopColor="#79C7FF" />
                      <stop offset="100%" stopColor="#74A2FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="mt-4 h-1.5 w-48 mx-auto rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{width: `${progress}%`, background: 'linear-gradient(90deg, #2370FF, #79C7FF)'}}></div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {loadingMessages[currentStep]?.title || "Processing..."}
                </h2>
                <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                  {loadingMessages[currentStep]?.description || `Please wait while we work on your resume, ${userName}`}
                </p>
                <div className="text-lg font-black" style={{color: '#2370FF'}}>
                  {progress}% Complete
                </div>
              </div>
            </div>

            {/* Right Side - Steps Progress */}
            <div className="w-1/2">
              <div className="space-y-4">
                <h3 className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  
                </h3>

                {loadingMessages.map((message, index) => {
                  const Icon = message.icon;
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        isCompleted ? 'text-green-600' :
                        isCurrent ? '' :
                        'text-gray-400'
                      }`}
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        color: isCurrent ? '#2370FF' : undefined
                      }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isCompleted ? 'text-white shadow-lg' :
                        isCurrent ? 'text-white shadow-lg' :
                        'bg-gray-200 text-gray-400'
                      }`}
                      style={
                        isCompleted ? {background: 'linear-gradient(135deg, #10B981, #34D399)'} :
                        isCurrent ? {background: 'linear-gradient(135deg, #2370FF, #79C7FF)'} :
                        {}
                      }>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 animate-scale-in" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{width: `${Math.min(100, ((index + (isCompleted ? 1 : 0)) / loadingMessages.length) * 100)}%`, background: isCompleted || isCurrent ? 'linear-gradient(90deg, #2370FF, #79C7FF)' : '#E5E7EB'}}></div>
                      </div>
                      {isCompleted && (
                        <div className="animate-pulse">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-lg text-white" style={{backgroundColor: '#10B981'}}>
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
                <div className="h-full rounded-full" style={{width: `${progress}%`, background: 'linear-gradient(90deg, #2370FF, #79C7FF)'}}></div>
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