"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, CheckCircle, X, Zap, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { uploadAndProcessResume } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";

function UploadResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const field = searchParams.get("field") || "";
  const education = searchParams.get("education") || "";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOC, DOCX, or TXT file.");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size should be less than 10MB.");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Call the uploadAndProcess API
      const response = await uploadAndProcessResume(selectedFile, selectedFile.name);

      if (response.success) {
        // Store resume_id in sessionStorage for next page
        sessionStorage.setItem('uploadedResumeId', response.data.resume_id);

        // Navigate to analyzing-resume page
        router.push(`/analyzing-resume?field=${field}&education=${education}&filename=${encodeURIComponent(selectedFile.name)}&resumeId=${response.data.resume_id}`);
      } else {
        setError(response.message || 'Upload failed');
        setUploading(false);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      logError('UploadResumePage', err);
      setError(errorMessage);
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    router.push(`/resume-choice?field=${field}&education=${education}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen brand-bg-light flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold brand-text mb-2">
            Drop Your Resume Here! 📄
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s give your resume the glow-up it deserves ✨
          </p>
        </div>

        {/* Upload Card */}
        <Card className="shadow-2xl border-2 border-dashed brand-hover transition-all duration-300" style={{borderColor: "var(--neutral-medium-light)"}}>
          <CardContent className="p-8">
            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'brand-border'
                    : 'border-gray-300 brand-hover'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Upload className="h-10 w-10 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Drag & drop your resume here
                    </h3>
                    <p className="text-gray-600">
                      or click to browse your files
                    </p>
                  </div>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="brand-gradient text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Supported formats: PDF, DOC, DOCX, TXT</p>
                    <p>Maximum file size: 10MB</p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected File Display */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">{selectedFile.name}</h4>
                        <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">File uploaded successfully! 🎉</span>
                  </div>
                  <p className="text-gray-600">
                    Ready to analyze your resume and make it absolutely fire! 🔥
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                  >
                    {uploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Analyze My Resume!</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fun Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-medium text-gray-800">Lightning Fast</div>
            <div className="text-xs text-gray-600">Analysis in seconds</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-800">ATS Optimized</div>
            <div className="text-xs text-gray-600">Beat the bots</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm font-medium text-gray-800">AI Enhanced</div>
            <div className="text-xs text-gray-600">Smart improvements</div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="bg-white border-gray-300 brand-hover transition-all duration-300 gap-2 px-6 py-2 font-semibold rounded-lg shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Options
          </Button>
        </div>
      </div>

      <style jsx>{`
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

export default function UploadResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadResumePageContent />
    </Suspense>
  );
}