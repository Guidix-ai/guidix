"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        // Store resume_id and complete data in sessionStorage for next page
        sessionStorage.setItem('uploadedResumeId', response.data.resume_id);
        sessionStorage.setItem('uploadedResumeData', JSON.stringify(response.data));

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
    router.push("/resume-confirmation");
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
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', width: '100%' }}>
        {/* Blue Banner */}
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
            <h1 className="text-white font-bold" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontSize: '32px', lineHeight: '1.2' }}>
              Drop Your Resume Here
            </h1>
          </div>
        </div>

      <div className="max-w-2xl mx-auto w-full relative z-10 mt-8 px-4">

        {/* Upload Card */}
        <Card className="shadow-2xl  brand-hover transition-all duration-300" style={{borderColor: "var(--neutral-medium-light)"}}>
          <CardContent className="p-8">
            {!selectedFile ? (
              <div
                className="relative bg-gradient-to-b from-sky-50 to-blue-100 rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: '0px 4px 8px -2px rgba(35,112,255,0.15)',
                  outline: '1px solid #EEF5FF',
                  outlineOffset: '-1px'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center py-12 px-8">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-8">
                    <Image src="/upload-icon.svg" alt="Upload" width={64} height={64} className="w-16 h-16" />
                  </div>

                  {/* Main Text */}
                  <div className="mb-2">
                    <div className="text-center text-blue-900 text-lg font-medium font-['Inter'] leading-snug">
                      Select a file to upload
                    </div>
                  </div>

                  {/* Secondary Text */}
                  <div className="mb-10">
                    <div className="text-center text-slate-500 text-lg font-normal font-['Inter'] leading-relaxed">
                      Or drag and drop it here
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 pt-2.5 pb-3 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl inline-flex flex-col justify-start items-center transition-all duration-300 hover:opacity-90"
                    style={{
                      boxShadow: '0px 4px 8px 0px rgba(77,145,225,0.10), inset 0px -1.5px 0.6px 0px rgba(0,19,88,0.25), inset 0px 1.5px 0.6px 0px rgba(255,255,255,0.25)',
                      outline: '2px solid rgba(35,112,255,0.30)'
                    }}
                  >
                    <div className="text-center text-white text-lg font-medium font-['Inter'] leading-snug" style={{ textShadow: '0px 2px 5px rgba(0, 19, 88, 0.10)' }}>
                      Upload file
                    </div>
                  </button>

                  {/* File Info */}
                  <div className="text-sm text-slate-500 space-y-1 mt-6 text-center">
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
                {/* Success Card */}
                <div
                  className="bg-white rounded-2xl p-12"
                  style={{
                    borderTop: '1px solid #74D184',
                    boxShadow: `
                      0 0 4px 0 rgba(0, 19, 88, 0.15),
                      0 2px 3px 0 rgba(0, 19, 88, 0.04),
                      0 2px 6px 0 rgba(0, 19, 88, 0.04),
                      inset 0 -2px 3px 0 rgba(0, 19, 88, 0.10)
                    `
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className="w-20 h-20">
                      <Image
                        src="/completedresume.svg"
                        alt="Resume Uploaded"
                        width={80}
                        height={80}
                        className="w-20 h-20"
                      />
                    </div>

                    {/* Main Text */}
                    <h3
                      className="text-2xl font-semibold"
                      style={{
                        color: '#0F172A',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.4'
                      }}
                    >
                      Resume uploaded successfully!
                    </h3>

                    {/* Secondary Text */}
                    <p
                      className="text-base max-w-md"
                      style={{
                        color: '#64748B',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6'
                      }}
                    >
                      Let’s level up your resume and boost that ATS score
                    </p>
                  </div>
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
                      <span>Analyze My Resume</span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              padding: '8px 12px',
              alignItems: 'center',
              borderRadius: '8px',
              border: '1px solid rgba(35, 112, 255, 0.30)',
              background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
              boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
              color: '#FFFFFF',
              textAlign: 'center',
              textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '125%',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Back to Options
          </button>
        </div>
      </div>
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