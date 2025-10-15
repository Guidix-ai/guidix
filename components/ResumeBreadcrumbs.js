"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./breadcrumbs.css";

const ResumeBreadcrumbs = ({
  currentStep,
  totalSteps = 4,
  steps = [],
  onStepClick,
}) => {
  const router = useRouter();
  const [lineStates, setLineStates] = useState({});

  useEffect(() => {
    const newLineStates = {};
    for (let i = 1; i < (steps.length > 0 ? steps.length : totalSteps); i++) {
      newLineStates[i] = currentStep > i ? "filled" : "empty";
    }
    setLineStates(newLineStates);
  }, [currentStep, steps.length, totalSteps]);

  const defaultSteps = [
    { id: 1, label: "Info", route: "/resume-confirmation?path=ai" },
    { id: 2, label: "About You", route: "/ai-prompt" },
    { id: 3, label: "Template", route: "/template-selection?from=ai" },
    { id: 4, label: "Editor", route: "#" },
  ];

  const displaySteps =
    steps.length > 0 ? steps : defaultSteps.slice(0, totalSteps);

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
    <div className="breadcrumb-fixed-container">
      <div className="breadcrumb-glass-card pt-[1rem]">
        {/* Circles and Lines Row */}
        <div className="breadcrumb-circles-wrapper">
          {displaySteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Circle */}
              <div
                onClick={() => handleStepClick(step)}
                className="breadcrumb-circle-container"
                style={{
                  cursor: step.id < currentStep ? "pointer" : "default",
                }}
              >
                <div
                  className={`breadcrumb-circle ${
                    currentStep === step.id
                      ? "active"
                      : currentStep > step.id
                      ? "completed"
                      : "inactive"
                  } ${step.id < currentStep ? "hoverable" : ""}`}
                >
                  {currentStep > step.id ? (
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {index < displaySteps.length - 1 && (
                <div className="breadcrumb-line-container">
                  <div className="breadcrumb-line-bg">
                    <div
                      className="breadcrumb-line-fill"
                      style={{
                        width: currentStep > step.id ? "100%" : "0%",
                        transition: "width 0.6s ease-in-out",
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Labels Row */}
        <div className="breadcrumb-labels-wrapper">
          {displaySteps.map((step) => (
            <div key={step.id} className="breadcrumb-label-container">
              <span
                className={`breadcrumb-label ${
                  currentStep === step.id
                    ? "active"
                    : currentStep > step.id
                    ? "completed"
                    : "inactive"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeBreadcrumbs;
