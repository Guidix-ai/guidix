"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTypewriter } from "@/hooks/useTypewriter";

function ResumeReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const displayedText = useTypewriter("Resume Review Results", 80, 300);

  const field = searchParams.get("field") || "";
  const education = searchParams.get("education") || "";
  const filename = searchParams.get("filename") || "your-resume.pdf";

  // Mock analysis results
  const analysisResults = {
    strengths: [
      {
        title: "Your skills section is comprehensive and well-organized",
        description: "Listed all the relevant technical skills that match industry requirements"
      },
      {
        title: "Experience section demonstrates clear impact",
        description: "Project descriptions are detailed and showcase your accomplishments effectively"
      },
      {
        title: "Contact information is professional and complete",
        description: "Professional email address and phone number are properly formatted"
      }
    ],
    improvements: [
      {
        title: "Add more industry-specific keywords for ATS optimization",
        description: "Include additional relevant keywords to improve applicant tracking system compatibility"
      },
      {
        title: "Quantify achievements with specific metrics",
        description: "Add numbers and measurable results to strengthen the impact of your accomplishments"
      },
      {
        title: "Update formatting for modern aesthetics",
        description: "Consider a more contemporary layout to enhance visual appeal"
      }
    ]
  };

  const handleContinue = () => {
    router.push(`/template-selection?from=upload&field=${field}&education=${education}&filename=${encodeURIComponent(filename)}`);
  };

  return (
    <DashboardLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', width: '100%' }}>
        {/* Banner */}
        <div className="relative py-6 px-8 overflow-hidden flex items-center" style={{
          backgroundImage: 'url(/header-banner.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100px',
          boxShadow: '0 4px 20px 0 #2370FF66',
          borderRadius: '16px'
        }}>
          <div className="relative z-10">
            <h1 className="text-white font-bold" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              fontSize: '32px',
              lineHeight: '1.2'
            }}>
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10 mt-8 px-4">
          {/* Cards Grid - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Strength Card */}
            <Card className="shadow-2xl transition-all duration-300" style={{
              borderColor: "#74D184",
              borderWidth: "2px"
            }}>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold" style={{
                    color: 'var(--brand-primary-darkest)',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '12px'
                  }}>
                    Strength
                  </h2>
                </div>

                <div className="space-y-3">
                  {analysisResults.strengths.map((strength, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg" style={{
                      border: '1px solid #E1E4EB',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <h4 className="font-semibold mb-1" style={{
                        color: '#0F172A',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}>
                        {strength.title}
                      </h4>
                      <p className="text-xs" style={{
                        color: '#64748B',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6'
                      }}>
                        {strength.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvement Card */}
            <Card className="shadow-2xl transition-all duration-300" style={{
              borderColor: "#EFC42C",
              borderWidth: "2px"
            }}>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold" style={{
                    color: 'var(--brand-primary-darkest)',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '12px'
                  }}>
                    Improvement
                  </h2>
                </div>

                <div className="space-y-3">
                  {analysisResults.improvements.map((improvement, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg" style={{
                      border: '1px solid #E1E4EB',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <h4 className="font-semibold mb-1" style={{
                        color: '#0F172A',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}>
                        {improvement.title}
                      </h4>
                      <p className="text-xs" style={{
                        color: '#64748B',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6'
                      }}>
                        {improvement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleContinue}
              style={{
                display: 'inline-flex',
                padding: '12px 24px',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textAlign: 'center',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '125%',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Continue to Templates
            </Button>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
          .animate-pulse {
            animation: pulse 1s ease-in-out infinite;
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