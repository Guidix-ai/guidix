"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
};

function AIPromptInputContent() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userFields, setUserFields] = useState([]);
  const [userEducation, setUserEducation] = useState("");
  const [userCareer, setUserCareer] = useState("");
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Tell us about yourself';

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

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const typingSpeed = 80;
    const typeWriter = () => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        setShowCursor(false);
      }
    };
    typeWriter();
    return () => { index = fullText.length; };
  }, []);

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
    <>
      <style jsx>{`
        textarea::placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        textarea::-webkit-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        textarea::-moz-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        textarea:-ms-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
      `}</style>
      <DashboardLayout>
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', width: '100%' }}>
        {/* Banner */}
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
              {typewriterText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h1>
          </div>
        </div>

        {/* Info Section */}
        {userFields.length > 0 && userEducation && (
          <div className="bg-white px-8 py-4 border-b" style={{ borderColor: '#E1E4ED', backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2" style={{
                backgroundColor: '#E9F1FF',
                color: colorTokens.title
              }}>
                <Image src="/resumebuilder.svg" alt="Education" width={14} height={14} />
                {userEducation === "first" ? "1st Year" : userEducation === "second" ? "2nd Year" : userEducation === "third" ? "3rd Year" : "4th Year"}
              </span>
              {userFields.map((fieldId) => (
                <span key={fieldId} className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2" style={{
                  backgroundColor: '#E9F1FF',
                  color: colorTokens.title
                }}>
                  <Image src="/dashboard.svg" alt="Field" width={14} height={14} />
                  {getFieldData(fieldId).name}
                </span>
              ))}
              {userCareer && (
                <span className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{
                  backgroundColor: '#E9F1FF',
                  color: colorTokens.title
                }}>
                  {userCareer === "internship" ? "Seeking Internship" : "Seeking Full-time"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="px-8 py-6 max-w-4xl mx-auto"  style={{ backgroundColor: '#F8F9FF' }}>
          {/* Text Input Section */}
          <div className="mb-6 bg-white rounded-lg p-6" style={{
            border: '1px solid #F1F3F7',
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/resumebuilder.svg" alt="Info" width={16} height={16} />
              <h2 className="font-semibold" style={{ color: colorTokens.title, fontSize: '16px' }}>
                Your Information
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: colorTokens.paragraph }}>
              Write a brief description about yourself
            </p>

            <div className="relative">
              <textarea
                placeholder="Example: I'm John Doe, a 3rd year Computer Science student from Mumbai. I'm skilled in React, Node.js, and Python. I've built web applications and am looking for internship opportunities."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
                style={{
                  width: "100%",
                  minHeight: 160,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 12,
                  paddingBottom: 12,
                  backgroundColor: colorTokens.bgLight,
                  borderRadius: 16,
                  boxShadow: wordCount > MAX_WORDS
                    ? "0px 0px 2px 0px rgba(239,68,68,0.5), 0px 4px 4px 0px rgba(239,68,68,0.04), 0px 4px 16px 0px rgba(239,68,68,0.04), inset 0px -4px 4px 0px rgba(239,68,68,0.10)"
                    : "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
                  outline: wordCount > MAX_WORDS ? "1px solid #EF4444" : "1px solid #C7D6ED",
                  fontSize: 16,
                  color: colorTokens.paragraph,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  lineHeight: "125%",
                  letterSpacing: "-0.32px",
                }}
              />
              <div className="absolute bottom-3 right-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  wordCount > MAX_WORDS ? "bg-red-100 text-red-600" : "text-white"
                }`} style={
                  wordCount <= MAX_WORDS ? { backgroundColor: "#2370FF" } : {}
                }>
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
          <div className="mb-6 bg-white rounded-lg p-6" style={{
            border: '1px solid #F1F3F7',
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/dashboard.svg" alt="Examples" width={16} height={16} />
              <h3 className="font-semibold" style={{ color: colorTokens.title, fontSize: '16px' }}>
                Quick Examples
              </h3>
            </div>
            <p className="text-sm mb-4" style={{ color: colorTokens.paragraph }}>
              Click any example to use it as a starting point
            </p>

            <div className="grid gap-3">
              {dynamicPrompts.map((example, index) => (
                <div
                  key={index}
                  onClick={() => handleSamplePrompt(example.prompt)}
                  className="p-4 cursor-pointer transition-all"
                  style={{
                    border: '1px solid #D5E4FF',
                    borderRadius: 16,
                    backgroundColor: colorTokens.bgLight,
                    boxShadow: '0px 0px 2px 0px rgba(0,19,88,0.10), 0px 2px 2px 0px rgba(0,19,88,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colorTokens.secondary600;
                    e.currentTarget.style.backgroundColor = "#E9F1FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#D5E4FF";
                    e.currentTarget.style.backgroundColor = colorTokens.bgLight;
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{
                      background: colorTokens.secondary600
                    }}>
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1" style={{ color: colorTokens.title }}>
                        {example.title}
                      </div>
                      <div className="text-xs" style={{ color: colorTokens.paragraph }}>
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

          {/* Navigation */}
          <div className="flex justify-between items-center bg-white rounded-lg p-6" style={{
            border: '1px solid #F1F3F7',
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)'
          }}>
            <button
              onClick={handlePrev}
              className="px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                border: '1px solid #E9F1FF',
                background: 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                color: '#474FA3'
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!prompt.trim() || wordCount > MAX_WORDS}
              className={`px-8 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                !prompt.trim() || wordCount > MAX_WORDS
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              style={{
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: !prompt.trim() || wordCount > MAX_WORDS
                  ? '#9CA3AF'
                  : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)'
              }}
            >
              Generate Resume
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </>
  );
}

export default function AIPromptInput() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIPromptInputContent />
    </Suspense>
  );
}
