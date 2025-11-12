"use client";

import React, { useState } from "react";

// Sample resume data for testing
const sampleResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    website: "johndoe.com",
  },
  summary:
    "Experienced Software Engineer with 5+ years of expertise in full-stack web development. Proficient in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.",
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2021-06",
      endDate: null,
      responsibilities: [
        "Led development of microservices architecture serving 1M+ users",
        "Improved application performance by 40% through code optimization",
        "Mentored team of 5 junior developers in best practices",
        "Collaborated with product managers to define technical requirements",
      ],
    },
    {
      position: "Software Engineer",
      company: "StartUp Inc",
      location: "Remote",
      startDate: "2019-03",
      endDate: "2021-05",
      responsibilities: [
        "Developed RESTful APIs using Node.js and Express",
        "Built responsive web applications with React and Redux",
        "Implemented CI/CD pipelines using GitHub Actions",
        "Reduced bug count by 30% through comprehensive testing",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      institution: "University of California, Berkeley",
      startDate: "2015-09",
      endDate: "2019-05",
      gpa: "3.8",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "AWS",
    "Docker",
    "Git",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "GraphQL",
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      startDate: "2023-01",
      endDate: "2023-06",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      description:
        "Built a full-stack e-commerce platform with payment integration and real-time inventory management. Implemented user authentication, shopping cart, and admin dashboard.",
      liveLink: "https://demo-ecommerce.com",
    },
    {
      name: "Task Management App",
      startDate: "2022-08",
      endDate: "2022-12",
      technologies: ["React", "Firebase", "Material-UI"],
      description:
        "Developed a collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      liveLink: "https://task-app-demo.com",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-08",
    },
    {
      name: "MongoDB Certified Developer",
      issuer: "MongoDB Inc",
      date: "2021-11",
    },
  ],
};

export default function TestTemplatePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handleGeneratePreview = async () => {
    try {
      setIsLoadingPreview(true);
      console.log("🔵 Generating PDF preview");

      const response = await fetch("/api/test-template-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleResumeData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      console.log("✅ PDF preview generated successfully");
    } catch (err) {
      console.error("❌ Error generating preview:", err);
      alert("Failed to generate preview: " + err.message);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      console.log("📥 Starting PDF download via API");

      const response = await fetch("/api/test-template-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleResumeData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "test-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ PDF downloaded successfully");
    } catch (err) {
      console.error("❌ Error downloading PDF:", err);
      alert("Failed to download PDF: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            ATS Template Test Page
          </h1>
          <p className="text-gray-600 mb-4">
            This is a test page for the ATSTemplateWithoutPhoto_TEST component.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleGeneratePreview}
              disabled={isLoadingPreview}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isLoadingPreview
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isLoadingPreview ? "Generating Preview..." : "Generate Preview"}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isGenerating
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isGenerating ? "Downloading..." : "Download PDF"}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="font-semibold text-yellow-800 mb-2">
              Test Instructions:
            </h2>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>Click &quot;Generate Preview&quot; to see the PDF in the browser</li>
              <li>Click &quot;Download PDF&quot; to download the PDF file</li>
              <li>Check if all sections are rendering correctly</li>
              <li>Verify that project links are clickable</li>
              <li>Check the browser console for any errors or logs</li>
            </ul>
          </div>
        </div>

        {/* PDF Preview Section */}
        {pdfUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              PDF Preview
            </h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: "800px" }}>
              <iframe
                src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0&scrollbar=1`}
                title="PDF Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        )}

        {/* Sample Data Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Sample Resume Data (for debugging)
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96">
            {JSON.stringify(sampleResumeData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
