"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Monitor,
  Radio,
  Settings,
  Building,
  Zap,
  FlaskConical,
  Brain,
  Shield,
  BarChart3,
  ArrowRight
} from "lucide-react";

// Top engineering branches
const engineeringBranches = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    icon: Monitor,
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    icon: Radio,
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    icon: Settings,
  },
  {
    id: "civil",
    name: "Civil Engineering",
    icon: Building,
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    icon: Zap,
  },
  {
    id: "chemical",
    name: "Chemical Engineering",
    icon: FlaskConical,
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: Brain,
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: Shield,
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
  }
];

// Button styles from job-search page
const buttonStyles = {
  selected: {
    display: 'inline-flex',
    padding: '16px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
    border: '1px solid rgba(35, 112, 255, 0.30)',
    boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
    color: '#FFFFFF',
    textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '125%',
    letterSpacing: '-0.36px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    minHeight: '56px'
  },
  unselected: {
    display: 'inline-flex',
    padding: '16px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#D5E4FF',
    background: 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
    boxShadow: '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
    color: '#474FA3',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '125%',
    letterSpacing: '-0.32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    minHeight: '56px'
  }
};

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

function FieldSelectionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [jobType, setJobType] = useState("");
  const [path, setPath] = useState("");
  const [career, setCareer] = useState("");
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    const pathParam = searchParams.get("path");
    const careerParam = searchParams.get("career");
    if (pathParam) setPath(pathParam);
    if (careerParam) setCareer(careerParam);
  }, [searchParams]);

  useEffect(() => {
    // Google Fonts Inter
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
  }, []);

  const handleAcademicYearSelect = (year) => {
    setAcademicYear(year);
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(2);
      setAnimateIn(true);
    }, 300);
  };

  const handleBranchSelect = (branchId) => {
    setBranch(branchId);
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(3);
      setAnimateIn(true);
    }, 300);
  };

  const handleJobTypeSelect = (type) => {
    setJobType(type);
    // Navigate to next page
    setTimeout(() => {
      if (path === "ai") {
        router.push(`/ai-prompt?fields=${branch}&education=${academicYear}&career=${type}`);
      } else if (path === "upload") {
        router.push(`/upload-resume?fields=${branch}&education=${academicYear}&career=${type}`);
      } else {
        router.push(`/ai-prompt?fields=${branch}&education=${academicYear}&career=${type}`);
      }
    }, 300);
  };

  const handleBack = () => {
    setAnimateIn(false);
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setAnimateIn(true);
      } else {
        router.push("/resume-builder/ai-generator/education");
      }
    }, 300);
  };

  return (
    <DashboardLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s ease'
        }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              height: '4px',
              backgroundColor: '#E1E4ED',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(currentStep / 3) * 100}%`,
                background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{
              marginTop: '0.5rem',
              textAlign: 'center',
              color: '#6D7586',
              fontSize: '14px',
              fontWeight: 500
            }}>
              Step {currentStep} of 3
            </div>
          </div>

          {/* Question Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #F1F3F7',
            boxShadow: shadowBoxStyle,
            borderRadius: '16px',
            padding: '3rem 2.5rem'
          }}>
            {/* Step 1: Academic Year */}
            {currentStep === 1 && (
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#002A79',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  lineHeight: '1.3'
                }}>
                  What year are you currently in?
                </h1>
                <p style={{
                  fontSize: '15px',
                  color: '#6D7586',
                  textAlign: 'center',
                  marginBottom: '2.5rem'
                }}>
                  Select your current academic year
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { value: 'first', label: '1st Year' },
                    { value: 'second', label: '2nd Year' },
                    { value: 'third', label: '3rd Year' },
                    { value: 'fourth', label: '4th Year' }
                  ].map((year) => (
                    <button
                      key={year.value}
                      onClick={() => handleAcademicYearSelect(year.value)}
                      style={academicYear === year.value ? buttonStyles.selected : buttonStyles.unselected}
                      onMouseEnter={(e) => {
                        if (academicYear !== year.value) {
                          e.currentTarget.style.opacity = '0.9';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {year.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Engineering Branch */}
            {currentStep === 2 && (
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#002A79',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  lineHeight: '1.3'
                }}>
                  What's your engineering branch?
                </h1>
                <p style={{
                  fontSize: '15px',
                  color: '#6D7586',
                  textAlign: 'center',
                  marginBottom: '2.5rem'
                }}>
                  Choose your field of specialization
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {engineeringBranches.map((branchItem) => {
                    const IconComponent = branchItem.icon;
                    return (
                      <button
                        key={branchItem.id}
                        onClick={() => handleBranchSelect(branchItem.id)}
                        style={{
                          ...(branch === branchItem.id ? buttonStyles.selected : buttonStyles.unselected),
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '20px 16px'
                        }}
                        onMouseEnter={(e) => {
                          if (branch !== branchItem.id) {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <IconComponent size={24} />
                        <span style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.3' }}>
                          {branchItem.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Job Type */}
            {currentStep === 3 && (
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#002A79',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  lineHeight: '1.3'
                }}>
                  What are you looking for?
                </h1>
                <p style={{
                  fontSize: '15px',
                  color: '#6D7586',
                  textAlign: 'center',
                  marginBottom: '2.5rem'
                }}>
                  Select your preferred opportunity type
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { value: 'internship', label: 'Internship', icon: '🎓' },
                    { value: 'fulltime', label: 'Full-time Job', icon: '💼' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleJobTypeSelect(type.value)}
                      style={{
                        ...(jobType === type.value ? buttonStyles.selected : buttonStyles.unselected),
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => {
                        if (jobType !== type.value) {
                          e.currentTarget.style.opacity = '0.9';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            {currentStep > 0 && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#474FA3',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '8px 16px',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ← Back
                </button>
              </div>
            )}
          </div>

          {/* Selected Summary */}
          {(academicYear || branch) && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(71, 79, 163, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(71, 79, 163, 0.1)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}>
              {academicYear && (
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#474FA3'
                }}>
                  {academicYear === 'first' ? '1st Year' : academicYear === 'second' ? '2nd Year' : academicYear === 'third' ? '3rd Year' : '4th Year'}
                </span>
              )}
              {branch && (
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#474FA3'
                }}>
                  {engineeringBranches.find(b => b.id === branch)?.name}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function FieldSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FieldSelectionPageContent />
    </Suspense>
  );
}
