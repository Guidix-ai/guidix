"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ResumeCompletePage() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/job-search");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading with Gradient Effect */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
            Your resume looks great!
          </span>
        </h1>

        {/* Decorative Line */}
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-16 font-medium">
          Now let&apos;s find some jobs for you
        </p>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}