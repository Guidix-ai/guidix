"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, Suspense } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  Sparkles,
  Zap,
  Users,
  Heart,
  Copy,
  GraduationCap,
  Monitor,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/styles/pages/ai-prompt.module.css";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

function AIPromptInputContent() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userFields, setUserFields] = useState([]);
  const [userEducation, setUserEducation] = useState("");
  const [userCareer, setUserCareer] = useState("");

  const MAX_WORDS = 50;

  const wordCount = prompt
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const clampToWords = (text, maxWords) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text.trim();
    return words.slice(0, maxWords).join(" ") + "...";
  };

  useEffect(() => {
    const fieldsParam = searchParams.get("fields");
    const education = searchParams.get("education");
    const career = searchParams.get("career");

    if (fieldsParam) {
      const fieldsArray = fieldsParam.split(",");
      setUserFields(fieldsArray);
    }
    if (education) setUserEducation(education);
    if (career) setUserCareer(career);
  }, [searchParams]);

  const getFieldData = (fieldId) => {
    const fieldMap = {
      cse: {
        name: "Computer Science & Engineering",
        skills: ["React", "Node.js", "Python", "JavaScript", "AWS"],
        projects: "web applications",
        companies: "Infosys",
        location: "Bangalore",
      },
      ece: {
        name: "Electronics & Communication",
        skills: [
          "VHDL",
          "MATLAB",
          "PCB Design",
          "Signal Processing",
          "Embedded C",
        ],
        projects: "IoT devices",
        companies: "Texas Instruments",
        location: "Bangalore",
      },
      mechanical: {
        name: "Mechanical Engineering",
        skills: [
          "SolidWorks",
          "AutoCAD",
          "ANSYS",
          "3D Printing",
          "Manufacturing",
        ],
        projects: "mechanical systems",
        companies: "Tata Motors",
        location: "Pune",
      },
      civil: {
        name: "Civil Engineering",
        skills: [
          "AutoCAD",
          "Staad Pro",
          "Project Management",
          "Surveying",
          "Construction",
        ],
        projects: "infrastructure projects",
        companies: "L&T",
        location: "Mumbai",
      },
      electrical: {
        name: "Electrical Engineering",
        skills: [
          "MATLAB",
          "PLC Programming",
          "Power Systems",
          "Circuit Design",
          "Control Systems",
        ],
        projects: "power systems",
        companies: "BHEL",
        location: "Hyderabad",
      },
      chemical: {
        name: "Chemical Engineering",
        skills: [
          "Aspen Plus",
          "MATLAB",
          "Process Design",
          "Safety Analysis",
          "Quality Control",
        ],
        projects: "chemical processes",
        companies: "Reliance",
        location: "Gujarat",
      },
      aerospace: {
        name: "Aerospace Engineering",
        skills: ["CATIA", "ANSYS", "Flight Dynamics", "CFD", "Avionics"],
        projects: "aircraft components",
        companies: "HAL",
        location: "Bangalore",
      },
      biotechnology: {
        name: "Biotechnology",
        skills: [
          "Bioinformatics",
          "Cell Culture",
          "PCR",
          "Data Analysis",
          "Lab Techniques",
        ],
        projects: "biotech research",
        companies: "Biocon",
        location: "Bangalore",
      },
      "ai-ml": {
        name: "AI & Machine Learning",
        skills: [
          "Python",
          "TensorFlow",
          "Deep Learning",
          "NLP",
          "Computer Vision",
        ],
        projects: "AI models",
        companies: "Google",
        location: "Hyderabad",
      },
      cybersecurity: {
        name: "Cybersecurity",
        skills: [
          "Ethical Hacking",
          "Network Security",
          "Penetration Testing",
          "Risk Assessment",
          "Cryptography",
        ],
        projects: "security solutions",
        companies: "Wipro",
        location: "Bangalore",
      },
      "data-science": {
        name: "Data Science",
        skills: [
          "Python",
          "R",
          "SQL",
          "Machine Learning",
          "Data Visualization",
        ],
        projects: "analytics dashboards",
        companies: "Flipkart",
        location: "Bangalore",
      },
      biomedical: {
        name: "Biomedical Engineering",
        skills: [
          "Medical Devices",
          "Signal Processing",
          "Biomechanics",
          "CAD",
          "Regulatory Affairs",
        ],
        projects: "medical equipment",
        companies: "Siemens Healthineers",
        location: "Mumbai",
      },
      "prod-eng": {
        name: "Production Engineering",
        skills: [
          "Lean Manufacturing",
          "Quality Control",
          "Process Optimization",
          "Six Sigma",
          "Supply Chain",
        ],
        projects: "production systems",
        companies: "Mahindra",
        location: "Chennai",
      },
    };

    // Handle field ID aliases and mismatches
    const fieldAliases = {
      "biotech": "biotechnology",
      "prod-eng": "prod-eng", // Already defined above
    };

    const resolvedFieldId = fieldAliases[fieldId] || fieldId;
    return fieldMap[resolvedFieldId] || fieldMap["cse"];
  };

  const generateDynamicPrompts = () => {
    const primaryField = getFieldData(userFields[0] || "cse");
    const yearText =
      userEducation === "first"
        ? "1st Year"
        : userEducation === "second"
        ? "2nd Year"
        : userEducation === "third"
        ? "3rd Year"
        : "4th Year";
    const isInternship = userCareer === "internship";

    // Combine skills from multiple fields if available
    const allSkills =
      userFields.length > 0
        ? userFields
            .flatMap((fieldId) => getFieldData(fieldId).skills)
            .slice(0, 5)
        : primaryField.skills;

    return [
      {
        title: `Quick Fill Template`,
        type: "fillable",
        prompt: `I'm [YOUR NAME], a ${yearText} ${
          primaryField.name
        } student from [YOUR CITY]. Contact me at [YOUR EMAIL] or [YOUR PHONE]. I'm skilled in ${allSkills
          .slice(0, 3)
          .join(", ")}. I've worked on [NUMBER] projects including ${
          primaryField.projects
        } that [YOUR ACHIEVEMENT]. Currently studying at [YOUR COLLEGE] with [YOUR CGPA] CGPA. Looking for ${
          isInternship ? "internship" : "full-time"
        } opportunities.`,
      },
      {
        title: `Ready-to-Go Example`,
        type: "complete",
        prompt: `I'm Rahul Singh, a ${yearText} ${
          primaryField.name
        } student from ${
          primaryField.location
        }. Contact me at rahul.singh@email.com or +91-9876543210. I'm skilled in ${allSkills
          .slice(0, 3)
          .join(", ")}. I've worked on 5+ projects including ${
          primaryField.projects
        } that improved efficiency by 30%. Currently studying at NIT Warangal with 8.5 CGPA. Looking for ${
          isInternship ? "internship" : "full-time"
        } opportunities.`,
      },
      {
        title: `Achievement Focused`,
        type: "complete",
        prompt: `I'm Sneha Patel, a ${yearText} ${
          primaryField.name
        } student from Mumbai. Contact me at sneha.patel@email.com or +91-8765432109. I'm proficient in ${allSkills
          .slice(1, 4)
          .join(", ")}. Led a team of 4 to build ${
          primaryField.projects
        } that won college hackathon and got 50K+ downloads. Studying at VJTI Mumbai with 9.1 CGPA. Ready to bring innovation to ${
          isInternship ? "internship" : "full-time"
        } roles.`,
      },
    ];
  };

  const dynamicPrompts = generateDynamicPrompts();

  const handleNext = () => {
    if (prompt.trim() && wordCount <= MAX_WORDS) {
      // Store the prompt in sessionStorage for API call
      sessionStorage.setItem('userPrompt', prompt);

      // Include all necessary parameters in the route
      const fieldsParam = userFields.join(",");
      router.push(
        `/template-selection?from=ai&prompt=${encodeURIComponent(
          prompt
        )}&fields=${encodeURIComponent(
          fieldsParam
        )}&education=${userEducation}&career=${userCareer}`
      );
    }
  };

  const handlePrev = () => {
    router.push(
      `/resume-builder/ai-generator/field-selection?education=${userEducation}&career=${userCareer}`
    );
  };

  const handleSamplePrompt = (samplePrompt) => {
    setPrompt(clampToWords(samplePrompt, MAX_WORDS));
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center py-8"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-accent-bright))",
              }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Tell us about yourself
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Share your story and let AI create your perfect resume
            </p>
            {userFields.length > 0 && userEducation && (
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--brand-secondary-light)",
                    color: "var(--brand-primary)",
                  }}
                >
                  <GraduationCap className="h-4 w-4" />
                  {userEducation === "first"
                    ? "1st Year"
                    : userEducation === "second"
                    ? "2nd Year"
                    : userEducation === "third"
                    ? "3rd Year"
                    : "4th Year"}
                </span>
                {userFields.map((fieldId, index) => (
                  <span
                    key={fieldId}
                    className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--brand-secondary-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <Monitor className="h-4 w-4" />
                    {getFieldData(fieldId).name}
                  </span>
                ))}
                {userCareer && (
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--brand-accent-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {userCareer === "internship"
                      ? "Seeking Internship"
                      : "Seeking Full-time"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            className="bg-white rounded-xl shadow-sm border p-8 mb-8"
            style={{ borderColor: "var(--neutral-medium-light)" }}
          >
            {/* Text Input Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--brand-secondary-lightest)" }}
                >
                  <Bot
                    className="h-5 w-5"
                    style={{ color: "var(--brand-primary)" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "var(--neutral-darkest)" }}
                  >
                    Your Information
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "var(--neutral-medium-dark)" }}
                  >
                    Write a brief description about yourself
                  </p>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Example: I'm John Doe, a 3rd year Computer Science student from Mumbai. I'm skilled in React, Node.js, and Python. I've built web applications and am looking for internship opportunities."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="w-full border rounded-lg p-4 text-sm resize-none transition-all duration-200"
                  style={{
                    borderColor:
                      wordCount > MAX_WORDS
                        ? "#EF4444"
                        : "var(--neutral-medium-light)",
                    backgroundColor: "#F6F7FA",
                    color: "var(--neutral-darkest)",
                  }}
                  onFocus={(e) => {
                    if (wordCount <= MAX_WORDS) {
                      e.target.style.borderColor = "var(--brand-primary)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(35, 112, 255, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      wordCount > MAX_WORDS
                        ? "#EF4444"
                        : "var(--neutral-medium-light)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div className="absolute bottom-3 right-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      wordCount > MAX_WORDS
                        ? "bg-red-100 text-red-600"
                        : "text-white"
                    }`}
                    style={
                      wordCount <= MAX_WORDS
                        ? { backgroundColor: "var(--brand-primary)" }
                        : {}
                    }
                  >
                    {wordCount}/{MAX_WORDS} words
                  </span>
                </div>
              </div>

              {wordCount > MAX_WORDS && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <span>⚠️</span>
                  Please keep it under {MAX_WORDS} words
                </p>
              )}
            </div>

            {/* Examples Section */}
            <div
              className="border-t pt-8"
              style={{ borderColor: "var(--neutral-medium-light)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--brand-secondary-lightest)" }}
                >
                  <Zap
                    className="h-5 w-5"
                    style={{ color: "var(--brand-primary)" }}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--neutral-darkest)" }}
                  >
                    Quick Examples
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--neutral-medium-dark)" }}
                  >
                    Click any example to use it as a starting point
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {dynamicPrompts.map((example, index) => (
                  <div
                    key={index}
                    onClick={() => handleSamplePrompt(example.prompt)}
                    className="p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                    style={{ borderColor: "var(--neutral-medium-light)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--brand-primary)";
                      e.currentTarget.style.backgroundColor =
                        "var(--brand-secondary-lightest)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--neutral-medium-light)";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                        }}
                      >
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold text-sm mb-2 hover:text-blue-700"
                          style={{ color: "var(--neutral-darkest)" }}
                        >
                          {example.title}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--neutral-medium-dark)" }}
                        >
                          {example.type === "fillable"
                            ? "Template with placeholders for your personal details"
                            : clampToWords(example.prompt, 25) + "..."}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrev}
              className="bg-white border-2 px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200"
              style={{
                borderColor: "var(--neutral-medium-light)",
                color: "#23355C",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-primary)";
                e.currentTarget.style.backgroundColor =
                  "var(--brand-secondary-lightest)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--neutral-medium-light)";
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!prompt.trim() || wordCount > MAX_WORDS}
              className={`px-8 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                !prompt.trim() || wordCount > MAX_WORDS
                  ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                  : "text-white shadow-sm hover:shadow-md"
              }`}
              style={
                !prompt.trim() || wordCount > MAX_WORDS
                  ? {}
                  : {
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                    }
              }
              onMouseEnter={(e) => {
                if (prompt.trim() && wordCount <= MAX_WORDS) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(35, 112, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              Generate Resume
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AIPromptInput() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIPromptInputContent />
    </Suspense>
  );
}
