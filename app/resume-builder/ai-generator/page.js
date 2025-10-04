"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowLeft,
  Zap,
  Monitor,
  Radio,
  Settings,
  Building,
  FlaskConical,
  Plane,
  Brain,
  Shield,
  BarChart3,
  Heart,
  Check,
  ChevronRight,
  ArrowRight
} from "lucide-react";

// Simplified engineering fields - most popular ones only
const engineeringFields = [
  { id: "cse", name: "Computer Science", icon: Monitor },
  { id: "ece", name: "Electronics", icon: Radio },
  { id: "mechanical", name: "Mechanical", icon: Settings },
  { id: "civil", name: "Civil", icon: Building },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "chemical", name: "Chemical", icon: FlaskConical },
  { id: "aerospace", name: "Aerospace", icon: Plane },
  { id: "ai-ml", name: "AI & ML", icon: Brain },
  { id: "cybersecurity", name: "Cybersecurity", icon: Shield },
  { id: "data-science", name: "Data Science", icon: BarChart3 },
  { id: "biomedical", name: "Biomedical", icon: Heart }
];

const yearOptions = [
  { id: "first", title: "1st Year", icon: GraduationCap },
  { id: "second", title: "2nd Year", icon: GraduationCap },
  { id: "third", title: "3rd Year", icon: GraduationCap },
  { id: "fourth", title: "4th Year", icon: GraduationCap }
];

function AIGeneratorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [path, setPath] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedYear, setSelectedYear] = useState("first");
  const [selectedField, setSelectedField] = useState("cse");

  useEffect(() => {
    const pathParam = searchParams.get("path");
    if (pathParam) setPath(pathParam);
  }, [searchParams]);

  const steps = [
    { id: 1, title: "Career Path" },
    { id: 2, title: "Education Level" },
    { id: 3, title: "Field Selection" }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (path === "ai") {
        router.push(`/ai-prompt?field=${selectedField}&education=${selectedYear}&career=${selectedCareer}`);
      } else if (path === "upload") {
        router.push(`/upload-resume?field=${selectedField}&education=${selectedYear}&career=${selectedCareer}`);
      } else {
        router.push(`/ai-prompt?field=${selectedField}&education=${selectedYear}&career=${selectedCareer}`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/resume-builder");
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedCareer !== "";
    if (currentStep === 2) return selectedYear !== "";
    if (currentStep === 3) return selectedField !== "";
    return false;
  };

  const renderBreadcrumbs = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
              </div>
              <div className="ml-4">
                <div
                  className={`font-semibold ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight
                className={`w-6 h-6 ${
                  currentStep > step.id ? "text-green-500" : "text-gray-400"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="text-center space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            What type of opportunity are you targeting?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          onClick={() => setSelectedCareer("internship")}
          className={`cursor-pointer transition-all duration-300 hover:scale-105 border-3 rounded-3xl p-12 ${
            selectedCareer === "internship"
              ? "border-blue-500 bg-blue-50 shadow-xl"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600 mb-2">
            Internship
          </h3>
          <p className="text-gray-600 text-lg">
            Looking for internship opportunities
          </p>
        </div>

        <div
          onClick={() => setSelectedCareer("fulltime")}
          className={`cursor-pointer transition-all duration-300 hover:scale-105 border-3 rounded-3xl p-12 ${
            selectedCareer === "fulltime"
              ? "border-blue-500 bg-blue-50 shadow-xl"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Briefcase className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600 mb-2">
            Full-Time
          </h3>
          <p className="text-gray-600 text-lg">
            Ready for full-time positions
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <GraduationCap className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Your Year
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Which year are you currently in?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
        {yearOptions.map((year) => (
          <div
            key={year.id}
            onClick={() => setSelectedYear(year.id)}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 p-8 text-center rounded-2xl border-3 ${
              selectedYear === year.id
                ? "border-blue-500 bg-blue-50 shadow-xl"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <year.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-blue-600">
              {year.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Monitor className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Your Field
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Select your engineering specialization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
        {engineeringFields.map((field) => {
          const IconComponent = field.icon;
          return (
            <div
              key={field.id}
              onClick={() => setSelectedField(field.id)}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 text-center rounded-2xl border-3 ${
                selectedField === field.id
                  ? "border-blue-500 bg-blue-50 shadow-xl"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                selectedField === field.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <IconComponent size={24} />
              </div>
              <h3 className={`font-bold text-sm ${
                selectedField === field.id ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {field.name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border p-12">

            {renderBreadcrumbs()}

            <div className="min-h-[500px] flex items-center justify-center">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <div className="flex justify-between mt-16 pt-8 border-t-2">
              <button
                onClick={handleBack}
                className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-lg"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all text-lg ${
                  canProceed()
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>{currentStep === 3 ? "Complete" : "Continue"}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AIGeneratorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIGeneratorPageContent />
    </Suspense>
  );
}