"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./breadcrumbs.css";

const ResumeBreadcrumbs = ({
  currentStep,
  totalSteps = 4,
  steps = [],
  onStepClick,
  inNavbar = false,
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
    <div className={inNavbar ? "breadcrumb-navbar-container" : "breadcrumb-fixed-container"}>
      <div className={inNavbar ? "breadcrumb-navbar-card" : "breadcrumb-glass-card pt-[1rem]"}>
        {/* Simple Breadcrumbs Row */}
        <div className="breadcrumb-circles-wrapper">
          {displaySteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Breadcrumb Item */}
              <div className="breadcrumb-circle-container">
                <span
                  onClick={() => handleStepClick(step)}
                  className={`breadcrumb-circle ${
                    currentStep === step.id
                      ? "active"
                      : currentStep > step.id
                      ? "completed"
                      : "inactive"
                  }`}
                  style={{
                    cursor: step.id < currentStep ? "pointer" : "default",
                  }}
                >
                  {step.label}
                </span>

                {/* Separator */}
                {index < displaySteps.length - 1 && (
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.6498 10.9574C13.6498 11.1538 13.5712 11.324 13.4141 11.4681L7.87559 16.6137C7.74466 16.7447 7.58099 16.8069 7.38459 16.8003C7.18819 16.7938 7.02452 16.7185 6.89359 16.5745C6.76266 16.4304 6.70046 16.2602 6.70701 16.0638C6.71356 15.8674 6.78884 15.7037 6.93287 15.5728L11.9214 10.9574L6.93287 6.32237C6.78884 6.19144 6.71356 6.02777 6.70701 5.83137C6.70046 5.63497 6.76266 5.46476 6.89359 5.32073C7.02452 5.17671 7.18819 5.10469 7.38459 5.10469C7.58099 5.10469 7.74466 5.17016 7.87559 5.30109L13.4141 10.4468C13.5712 10.5646 13.6498 10.7348 13.6498 10.9574Z"
                      fill={currentStep > step.id ? '#0F2678' : '#8492C2'}
                    />
                  </svg>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Labels Row - Hidden in navbar mode */}
        {!inNavbar && (
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
        )}
      </div>
    </div>
  );
};

export default ResumeBreadcrumbs;
