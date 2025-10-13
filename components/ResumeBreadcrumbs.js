"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const ResumeBreadcrumbs = ({ currentStep, totalSteps = 4, steps = [], onStepClick }) => {
  const router = useRouter();

  const defaultSteps = [
    { id: 1, label: 'Info', route: '/resume-confirmation?path=ai' },
    { id: 2, label: 'About You', route: '/ai-prompt' },
    { id: 3, label: 'Template', route: '/template-selection?from=ai' },
    { id: 4, label: 'Editor', route: '#' }
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps.slice(0, totalSteps);

  const handleStepClick = (step) => {
    if (step.id < currentStep) {
      if (onStepClick) {
        onStepClick(step.id);
      } else if (step.route) {
        router.push(step.route);
      }
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .breadcrumb-container {
          animation: fadeIn 0.4s ease-out;
        }

        .step-circle:hover {
          transform: translateY(-2px);
        }

        @media (min-width: 1024px) {
          .breadcrumb-container {
            left: 272px !important;
            right: 0 !important;
          }
        }
      `}</style>
      <div
        className="breadcrumb-container"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '0',
          right: '0',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            background: 'rgba(233, 241, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '50px',
            padding: '0.75rem 2rem',
            boxShadow: '0 4px 20px rgba(35, 112, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
            {displaySteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <div
                  onClick={() => handleStepClick(step)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.375rem',
                    cursor: step.id < currentStep ? 'pointer' : 'default'
                  }}
                >
                  <div
                    className={step.id < currentStep ? 'step-circle' : ''}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: currentStep >= step.id
                        ? 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)'
                        : '#E9F1FF',
                      border: currentStep >= step.id ? 'none' : '2px solid #D5E4FF',
                      color: currentStep >= step.id ? '#FFFFFF' : '#9EAED6',
                      boxShadow: currentStep === step.id
                        ? '0 4px 16px rgba(35, 112, 255, 0.35), 0 0 0 3px rgba(35, 112, 255, 0.08)'
                        : currentStep > step.id
                        ? '0 2px 10px rgba(35, 112, 255, 0.2)'
                        : 'none'
                    }}
                  >
                    {currentStep > step.id ? (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: currentStep === step.id ? 600 : 500,
                      color: currentStep >= step.id ? '#002A79' : '#9EAED6',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < displaySteps.length - 1 && (
                  <div
                    style={{
                      width: '80px',
                      height: '4px',
                      marginTop: '16px',
                      position: 'relative',
                      background: '#D5E4FF',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {currentStep > step.id && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: '100%',
                          background: 'linear-gradient(90deg, #679CFF 0%, #2370FF 100%)',
                          borderRadius: '4px'
                        }}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBreadcrumbs;
