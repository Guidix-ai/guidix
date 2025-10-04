"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Wand2,
  FileText,
  Zap,
  CheckCircle,
  User,
  Brain,
  GraduationCap,
  Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

function ResumeChoicePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [field, setField] = useState("");
  const [education, setEducation] = useState("");

  useEffect(() => {
    const fieldParam = searchParams.get("field");
    const educationParam = searchParams.get("education");
    if (fieldParam) setField(fieldParam);
    if (educationParam) setEducation(educationParam);
  }, [searchParams]);

  const handleStartFromScratch = () => {
    router.push(
      `/ai-prompt?field=${field}&education=${education}&from=scratch`
    );
  };

  const handleUploadResume = () => {
    router.push(`/upload-resume?field=${field}&education=${education}`);
  };

  const handleBack = () => {
    router.push(
      `/resume-builder/ai-generator/field-selection?education=${education}`
    );
  };

  const getFieldDisplayName = (fieldId) => {
    const fieldMap = {
      cse: "Computer Science & Engineering",
      ece: "Electronics & Communication",
      mechanical: "Mechanical Engineering",
      civil: "Civil Engineering",
      electrical: "Electrical Engineering",
      chemical: "Chemical Engineering",
      aerospace: "Aerospace Engineering",
      biotechnology: "Biotechnology",
      "ai-ml": "AI & Machine Learning",
      cybersecurity: "Cybersecurity",
      "data-science": "Data Science",
      biomedical: "Biomedical Engineering",
    };
    return fieldMap[fieldId] || fieldId;
  };

  const getEducationDisplayName = (educationLevel) => {
    const educationMap = {
      first: "1st Year",
      second: "2nd Year",
      third: "3rd Year",
      fourth: "4th Year",
    };
    return educationMap[educationLevel] || educationLevel;
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #F4F8FF 0%, #E9F1FF 100%)",
        }}
      >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{ background: "#D5E4FF" }}
        ></div>
        <div
          className="absolute top-40 right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          style={{ background: "#E9F1FF" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          style={{ background: "#F4F8FF" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #2370FF, #79C7FF)",
              }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "#2370FF" }}
          >
            Choose your creation path
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Pick your preferred method to create your perfect resume
          </p>

          {/* Selected Field & Education Display */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 mt-8">
            <div
              className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 border-2 transition-all duration-300"
              style={{ borderColor: "#D5E4FF" }}
            >
              <GraduationCap className="h-5 w-5" style={{ color: "#2370FF" }} />
              <span
                className="text-base font-semibold"
                style={{ color: "#2370FF" }}
              >
                {getEducationDisplayName(education)}
              </span>
            </div>
            <div
              className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 border-2 transition-all duration-300"
              style={{ borderColor: "#D5E4FF" }}
            >
              <Target className="h-5 w-5" style={{ color: "#2370FF" }} />
              <span
                className="text-base font-semibold"
                style={{ color: "#2370FF" }}
              >
                {getFieldDisplayName(field)}
              </span>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Start from Scratch Option */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 rounded-2xl ${
              selectedOption === "scratch" ? "shadow-xl" : "hover:shadow-lg"
            }`}
            style={{
              borderColor: selectedOption === "scratch" ? "#2370FF" : "#D5E4FF",
            }}
            onClick={() => setSelectedOption("scratch")}
          >
            <CardHeader className="text-center pb-4">
              {/* <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(135deg, #2370FF, #79C7FF)'}}>
                <Brain className="h-12 w-12 text-white" />
              </div> */}
              <CardTitle
                className="text-2xl font-bold"
                style={{ color: "#2370FF" }}
              >
                Start with AI
              </CardTitle>
              <p className="text-gray-600 font-medium mt-2">
                Let AI create your resume from scratch using intelligent prompts
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {/* <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <Wand2 className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <Brain className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <FileText className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
              </div> */}

              <Button
                onClick={handleStartFromScratch}
                className="w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #2370FF, #2B49C2)",
                }}
              >
                <Wand2 className="h-5 w-5 mr-2" />
                AI Create
              </Button>
            </CardContent>
          </Card>

          {/* Upload Resume Option */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 rounded-2xl ${
              selectedOption === "upload" ? "shadow-xl" : "hover:shadow-lg"
            }`}
            style={{
              borderColor: selectedOption === "upload" ? "#2370FF" : "#D5E4FF",
            }}
            onClick={() => setSelectedOption("upload")}
          >
            <CardHeader className="text-center pb-4">
              {/* <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(135deg, #2370FF, #79C7FF)'}}>
                <Upload className="h-12 w-12 text-white" />
              </div> */}
              <CardTitle
                className="text-2xl font-bold"
                style={{ color: "#2370FF" }}
              >
                Upload & Enhance
              </CardTitle>
              <p className="text-gray-600 font-medium mt-2">
                Upload your existing resume and let AI enhance it for better
                results
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {/* <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <Upload className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <Zap className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
                <div className="bg-white rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-300" style={{borderColor: '#D5E4FF'}}>
                  <CheckCircle className="h-6 w-6" style={{color: '#2370FF'}} />
                </div>
              </div> */}

              <Button
                onClick={handleUploadResume}
                className="w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #2370FF, #2B49C2)",
                }}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl p-6 text-center shadow-sm border-2 transition-all duration-300 hover:shadow-md"
            style={{ borderColor: "#D5E4FF" }}
          >
            <div
              className="flex items-center justify-center gap-2 mb-2"
              style={{ color: "#2370FF" }}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-2xl font-bold">95%</span>
            </div>
            <div className="text-sm font-semibold text-gray-600 tracking-wide">
              Success Rate
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-6 text-center shadow-sm border-2 transition-all duration-300 hover:shadow-md"
            style={{ borderColor: "#D5E4FF" }}
          >
            <div
              className="flex items-center justify-center gap-2 mb-2"
              style={{ color: "#2370FF" }}
            >
              <Zap className="h-6 w-6" />
              <span className="text-2xl font-bold">2 min</span>
            </div>
            <div className="text-sm font-semibold text-gray-600 tracking-wide">
              Setup Time
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-6 text-center shadow-sm border-2 transition-all duration-300 hover:shadow-md"
            style={{ borderColor: "#D5E4FF" }}
          >
            <div
              className="flex items-center justify-center gap-2 mb-2"
              style={{ color: "#2370FF" }}
            >
              <FileText className="h-6 w-6" />
              <span className="text-2xl font-bold">ATS</span>
            </div>
            <div className="text-sm font-semibold text-gray-600 tracking-wide">
              Optimized
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="bg-white border-2 font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 gap-3"
            style={{
              borderColor: "#D5E4FF",
              color: "#2370FF",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#2370FF";
              e.target.style.backgroundColor = "#F4F8FF";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#D5E4FF";
              e.target.style.backgroundColor = "white";
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Field Selection
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
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

export default function ResumeChoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeChoicePageContent />
    </Suspense>
  );
}
