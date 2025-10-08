"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import React, { useState, useEffect,Suspense } from "react";


// import React, { useState, useEffect, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";

function ResumeReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [animationComplete, setAnimationComplete] = useState(false);

  const field = searchParams.get("field") || "";
  const education = searchParams.get("education") || "";
  const filename = searchParams.get("filename") || "your-resume.pdf";

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock analysis results with Gen Z language
  const analysisResults = {
    overallScore: 78,
    atsScore: 85,
    strengths: [
      {
        icon: <Flame className="h-5 w-5" />,
        title: "Your skills section is absolutely fire! 🔥",
        description: "Listed all the right tech stacks that recruiters are thirsting for",
        impact: "High"
      },
      {
        icon: <Award className="h-5 w-5" />,
        title: "Experience section hits different 👑",
        description: "Those project descriptions are chef's kiss - very detailed and impressive",
        impact: "High"
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: "Contact info is clean AF ✨",
        description: "Professional email and phone number - no red flags here bestie",
        impact: "Medium"
      }
    ],
    improvements: [
      {
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "Missing some keywords that would make ATS bots go brr 🤖",
        description: "Add more industry buzzwords to get past the robot gatekeepers",
        impact: "High",
        fix: "We'll sprinkle in some keyword magic"
      },
      {
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Achievements need more flex energy 💪",
        description: "Numbers and metrics make recruiters go 'periodt' - add more of those",
        impact: "Medium",
        fix: "We'll quantify your wins"
      },
      {
        icon: <Target className="h-5 w-5" />,
        title: "Format could be more aesthetic 🎨",
        description: "Current layout is giving 2010 vibes - let's make it more modern",
        impact: "Medium",
        fix: "Fresh templates incoming"
      }
    ],
    quickFacts: [
      { label: "Reading Time", value: "6 seconds", emoji: "👀" },
      { label: "ATS Score", value: "85/100", emoji: "🤖" },
      { label: "Vibe Check", value: "Professional", emoji: "✨" },
      { label: "Improvement Potential", value: "High", emoji: "📈" }
    ]
  };

  const handleContinue = () => {
    router.push(`/template-selection?from=upload&field=${field}&education=${education}&filename=${encodeURIComponent(filename)}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return "🔥";
    if (score >= 80) return "✨";
    if (score >= 70) return "👍";
    if (score >= 60) return "🤔";
    return "😅";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-20 h-20 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Resume Review Results 📊
          </h1>
          <p className="text-sm text-gray-600 mb-3">
            Your resume analysis is complete ✨
          </p>
          <div className="bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm inline-block">
            <span className="text-xs font-medium text-blue-700">
              📄 {decodeURIComponent(filename)}
            </span>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-4 shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {analysisResults.overallScore}
              </div>
              <div className="text-2xl">{getScoreEmoji(analysisResults.overallScore)}</div>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Your Resume Score
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {analysisResults.overallScore >= 80
                ? "Great resume! Just needs a few tweaks to be perfect ✨"
                : analysisResults.overallScore >= 60
                ? "Solid foundation! Let's add some improvements 💪"
                : "Good start! We'll help you improve it significantly ✨"
              }
            </p>
            <div className="grid grid-cols-4 gap-2">
              {analysisResults.quickFacts.map((fact, index) => (
                <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="text-sm mb-1">{fact.emoji}</div>
                  <div className="font-semibold text-gray-800 text-xs">{fact.value}</div>
                  <div className="text-xs text-gray-600">{fact.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* Strengths */}
          <Card className="shadow-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700 text-sm">
                <ThumbsUp className="h-4 w-4" />
                Strengths 💪
              </CardTitle>
              <CardDescription className="text-xs">
                What&apos;s working well in your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisResults.strengths.map((strength, index) => (
                <div
                  key={index}
                  className={`p-2 bg-white rounded-lg border border-green-200 transition-all duration-500 ${
                    animationComplete ? 'animate-pulse' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      {strength.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 mb-1 text-xs">{strength.title}</h4>
                      <p className="text-xs text-green-700 mb-1">{strength.description}</p>
                      <Badge variant="outline" className="border-green-300 text-green-700 text-xs">
                        {strength.impact} Impact
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="shadow-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-orange-700 text-sm">
                <Zap className="h-4 w-4" />
                Improvements ✨
              </CardTitle>
              <CardDescription className="text-xs">
                Areas we can enhance for better results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisResults.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className={`p-2 bg-white rounded-lg border border-orange-200 transition-all duration-500 ${
                    animationComplete ? 'animate-pulse' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${(index + 3) * 200}ms` }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      {improvement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800 mb-1 text-xs">{improvement.title}</h4>
                      <p className="text-xs text-orange-700 mb-1">{improvement.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-orange-300 text-orange-700 text-xs">
                          {improvement.impact} Impact
                        </Badge>
                        <span className="text-xs text-green-600 font-medium">
                          ✨ {improvement.fix}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ATS Compatibility */}
        {/* <Card className="mb-4 shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-blue-800 mb-1">ATS Compatibility 🤖</h3>
                <p className="text-xs text-blue-700">
                  How well your resume works with tracking systems
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  {analysisResults.atsScore}/100
                </div>
                <p className="text-xs text-blue-600">
                  {analysisResults.atsScore >= 80 ? "Excellent! 🤖✨" : "Needs improvements"}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analysisResults.atsScore}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Call to Action */}
        <Card className="shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4 text-center">
            {/* <div className="mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Ready to Improve? ✨
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Let's select a template and enhance your resume content
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-lg mb-1">🎨</div>
                <div className="font-semibold text-gray-800 text-xs">Modern Templates</div>
                <div className="text-xs text-gray-600">Professional designs</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-lg mb-1">⚡</div>
                <div className="font-semibold text-gray-800 text-xs">AI Enhanced</div>
                <div className="text-xs text-gray-600">Smart improvements</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="text-lg mb-1">🚀</div>
                <div className="font-semibold text-gray-800 text-xs">ATS Optimized</div>
                <div className="text-xs text-gray-600">System friendly</div>
              </div>
            </div> */}

            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Continue to Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* <p className="text-xs text-gray-600 mt-3">
              Let's make your resume stand out! 💼
            </p> */}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}

export default function ResumeReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeReviewPageContent />
    </Suspense>
  );
}