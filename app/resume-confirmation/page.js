"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getSuggestedPrompts } from "@/services/resumeService";
import { handleApiError, logError } from "@/utils/errorHandler";
import {
  GraduationCap,
  Briefcase,
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
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  ChevronDown,
  Smartphone,
  Cpu,
  Cog,
  Bot,
  Wrench,
  Flask,
  X,
  Search,
  Plus
} from "lucide-react";

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

// Engineering fields mapping with proper B.Tech structure
const engineeringFields = {
  // Core Computer Science
  cse: { name: "Computer Science & Engineering (CSE)", icon: Monitor },
  "cse-ai": { name: "CSE with specialization in AI", icon: Brain },
  "cse-ml": { name: "CSE with specialization in ML", icon: Brain },
  "cse-ds": { name: "CSE with specialization in Data Science", icon: BarChart3 },
  "cse-cyber": { name: "CSE with specialization in Cybersecurity", icon: Shield },
  "cse-iot": { name: "CSE with specialization in IoT", icon: Monitor },

  // Information Technology
  it: { name: "Information Technology (IT)", icon: Monitor },

  // Electronics branches
  ece: { name: "Electronics & Communication Engineering (ECE)", icon: Radio },
  eee: { name: "Electrical & Electronics Engineering (EEE)", icon: Zap },
  eie: { name: "Electronics & Instrumentation Engineering (EIE)", icon: Radio },

  // Core Engineering
  mechanical: { name: "Mechanical Engineering", icon: Settings },
  civil: { name: "Civil Engineering", icon: Building },
  chemical: { name: "Chemical Engineering", icon: FlaskConical },
  aerospace: { name: "Aerospace Engineering", icon: Plane },

  // Specialized & Interdisciplinary
  biotech: { name: "Biotechnology", icon: Heart },
  biomedical: { name: "Biomedical Engineering", icon: Heart },
  "env-eng": { name: "Environmental Engineering", icon: Building },
  "auto-eng": { name: "Automobile Engineering", icon: Settings },
  "prod-eng": { name: "Production Engineering", icon: Settings },
  "ind-eng": { name: "Industrial Engineering", icon: Settings },

  // Modern Combinations
  "ai-ds": { name: "Artificial Intelligence & Data Science", icon: Brain },
  "ai-ml": { name: "Artificial Intelligence & Machine Learning", icon: Brain },
  "cse-aiml": { name: "CSE (AI & ML)", icon: Brain },
  "ece-cs": { name: "Electronics & Computer Science", icon: Radio },
  robotics: { name: "Robotics & Automation", icon: Settings },
  mechatronics: { name: "Mechatronics Engineering", icon: Settings },

  // Newer Fields
  "cyber-security": { name: "Cyber Security & Digital Forensics", icon: Shield },
  "data-science": { name: "Data Science & Engineering", icon: BarChart3 },
  "cloud-computing": { name: "Cloud Technology & Information Security", icon: Monitor },
  "blockchain": { name: "Blockchain Technology", icon: Monitor },

  // Specialized Electronics
  "vlsi-design": { name: "VLSI Design & Technology", icon: Radio },
  "embedded-systems": { name: "Embedded Systems", icon: Radio },
  "comm-eng": { name: "Communication Engineering", icon: Radio },

  // Other Core Branches
  textile: { name: "Textile Engineering", icon: Settings },
  mining: { name: "Mining Engineering", icon: Building },
  petroleum: { name: "Petroleum Engineering", icon: FlaskConical },
  "food-tech": { name: "Food Technology", icon: FlaskConical },
  "agri-eng": { name: "Agricultural Engineering", icon: Building },

  // Emerging Fields
  "renewable-energy": { name: "Renewable Energy Engineering", icon: Zap },
  "nano-tech": { name: "Nanotechnology", icon: FlaskConical },
  "materials-eng": { name: "Materials Engineering", icon: FlaskConical }
};

const yearOptions = [
  { id: "first", title: "1st Year", icon: GraduationCap },
  { id: "second", title: "2nd Year", icon: GraduationCap },
  { id: "third", title: "3rd Year", icon: GraduationCap },
  { id: "fourth", title: "4th Year", icon: GraduationCap }
];

const careerOptions = [
  { id: "internship", title: "Internship", icon: GraduationCap },
  { id: "fulltime", title: "Full-Time", icon: Briefcase }
];

// Smart defaults
const getSmartDefaults = () => ({
  career: "internship",
  education: "third",
  fields: ["cse"] // Changed to array for multi-select
});

function ResumeConfirmationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [path, setPath] = useState("");
  const [selections, setSelections] = useState(getSmartDefaults());
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Resume Configuration';

  useEffect(() => {
    const pathParam = searchParams.get("path");
    if (pathParam) setPath(pathParam);
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

  const handleProceed = async () => {
    setLoading(true);
    setError(null);

    try {
      // Extract academic year number from education selection (e.g., "third" -> 3)
      const yearMapping = {
        'first': 1,
        'second': 2,
        'third': 3,
        'fourth': 4,
        'fifth': 5,
        'sixth': 6,
        'seventh': 7,
        'eighth': 8
      };

      const academicYear = yearMapping[selections.education] || 1;

      // Get the primary field (first selected field)
      const primaryField = selections.fields[0] || 'cse';
      const fieldName = engineeringFields[primaryField]?.name || 'Computer Science & Engineering';

      // Determine if it's internship or job based on career selection
      const careerType = selections.career === 'internship' ? 'internship' : 'job';

      // Call the suggested prompts API
      const response = await getSuggestedPrompts(
        academicYear,
        'Bachelor of Technology', // Assuming B.Tech for now
        fieldName,
        careerType
      );

      if (response.success && response.data.suggested_prompts) {
        // Store suggested prompts in sessionStorage to use on the next page
        sessionStorage.setItem('suggestedPrompts', JSON.stringify(response.data.suggested_prompts));
        console.log('Suggested prompts fetched:', response.data.suggested_prompts);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logError('ResumeConfirmationPage:handleProceed', err);
      console.warn('Failed to fetch suggested prompts:', errorMessage);
      // Continue navigation even if API fails
    } finally {
      setLoading(false);
    }

    // Navigate to the appropriate page
    const fieldsParam = selections.fields.join(',');
    if (path === "ai") {
      router.push(`/ai-prompt?fields=${fieldsParam}&education=${selections.education}&career=${selections.career}`);
    } else if (path === "upload") {
      router.push(`/upload-resume?fields=${fieldsParam}&education=${selections.education}&career=${selections.career}`);
    } else {
      router.push(`/ai-prompt?fields=${fieldsParam}&education=${selections.education}&career=${selections.career}`);
    }
  };

  const handleFieldChange = (field, value) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldAdd = (fieldId) => {
    if (!selections.fields.includes(fieldId) && selections.fields.length < 3) {
      setSelections(prev => ({
        ...prev,
        fields: [...prev.fields, fieldId]
      }));
      setSearchTerm("");
      // Keep dropdown open so user can add more fields easily
    }
  };

  const handleFieldRemove = (fieldId) => {
    setSelections(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f !== fieldId)
    }));
  };

  const getFilteredFields = () => {
    return Object.entries(engineeringFields).filter(([id, field]) => {
      const matchesSearch = searchTerm === "" || field.name.toLowerCase().includes(searchTerm.toLowerCase());
      const notSelected = !selections.fields.includes(id);
      return matchesSearch && notSelected;
    });
  };

  const getFieldData = (fieldId) => {
    return engineeringFields[fieldId] || engineeringFields.cse;
  };

  const getYearTitle = (yearId) => {
    const year = yearOptions.find(y => y.id === yearId);
    return year ? year.title : yearId;
  };

  const getCareerData = (careerId) => {
    return careerOptions.find(c => c.id === careerId) || careerOptions[0];
  };

  const CareerIcon = getCareerData(selections.career).icon;

  return (
    <DashboardLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', width: '100%' }}>
        {/* Banner */}
        <div className="relative py-6 px-8 overflow-hidden flex items-center" style={{
          backgroundImage: 'url(/banner.svg)',
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

        {/* Configuration Section */}
        <div className="bg-white px-8 py-6 border-b" style={{ borderColor: '#E1E4ED', backgroundColor: '#FFFFFF' }}>

            {/* Configuration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

              {/* Career Path */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Image src="/jobapply.svg" alt="Career" width={16} height={16} />
                  <label className="font-medium" style={{ color: '#002A79', fontSize: '14px' }}>Career Goal</label>
                </div>
                <div className="relative">
                  <select
                    value={selections.career}
                    onChange={(e) => handleFieldChange('career', e.target.value)}
                    className="w-full appearance-none rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:outline-none cursor-pointer"
                    style={{
                      color: '#002A79',
                      border: '1px solid #F0F4FA',
                      background: '#FFF',
                      boxShadow: '0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)'
                    }}
                  >
                    {careerOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#2370FF' }} />
                </div>
              </div>

              {/* Education Level */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Image src="/resumebuilder.svg" alt="Education" width={16} height={16} />
                  <label className="font-medium" style={{ color: '#002A79', fontSize: '14px' }}>Academic Year</label>
                </div>
                <div className="relative">
                  <select
                    value={selections.education}
                    onChange={(e) => handleFieldChange('education', e.target.value)}
                    className="w-full appearance-none rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:outline-none cursor-pointer"
                    style={{
                      color: '#002A79',
                      border: '1px solid #F0F4FA',
                      background: '#FFF',
                      boxShadow: '0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)'
                    }}
                  >
                    {yearOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#2370FF' }} />
                </div>
              </div>

              {/* Fields Counter */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Image src="/dashboard.svg" alt="Specializations" width={16} height={16} />
                  <label className="font-medium" style={{ color: '#002A79', fontSize: '14px' }}>Specializations</label>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{
                  border: '1px solid #F0F4FA',
                  background: '#FFF',
                  boxShadow: '0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)'
                }}>
                  <div className="text-xl font-bold" style={{ color: '#2370FF' }}>
                    {selections.fields.length}/3
                  </div>
                  <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#E1E4EB' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: '#2370FF',
                        width: `${(selections.fields.length / 3) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Engineering Fields Section */}
        <div className="px-8 py-6"  style={{ backgroundColor: '#F8F9FF' }}>
              <div className="mb-3 flex items-center gap-2">
                <Image src="/dashboard.svg" alt="Engineering" width={16} height={16} />
                <label className="font-medium" style={{ color: '#002A79', fontSize: '14px' }}>Engineering Specializations ({selections.fields.length}/3)</label>
              </div>

              <div className="grid lg:grid-cols-4 gap-4">
                {/* Selected Fields */}
                <div className="lg:col-span-3">

                  <div className="flex flex-wrap gap-2 min-h-[60px] items-start">
                    {selections.fields.map((fieldId) => {
                      const field = getFieldData(fieldId);
                      const FieldIcon = field.icon;
                      return (
                        <div
                          key={fieldId}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: '#E9F1FF',
                            border: '1px solid #D5E4FF'
                          }}
                        >
                          <FieldIcon className="w-4 h-4" style={{ color: '#2370FF' }} />
                          <span className="font-medium text-sm" style={{ color: '#002A79' }}>{field.name}</span>
                          <button
                            onClick={() => handleFieldRemove(fieldId)}
                            className="w-4 h-4 rounded-full flex items-center justify-center ml-1"
                            style={{
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <X className="w-3 h-3" style={{ color: '#DC2626' }} />
                          </button>
                        </div>
                      );
                    })}
                    {selections.fields.length === 0 && (
                      <div className="flex items-center justify-center w-full py-4">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3" style={{
                            backgroundColor: '#F1F3F7'
                          }}>
                            <Plus className="w-6 h-6" style={{ color: '#9CA3AF' }} />
                          </div>
                          <p className="text-sm font-medium" style={{ color: '#6477B4' }}>No specializations selected</p>
                          <p className="text-xs" style={{ color: '#9CA3AF' }}>Add your first field using the button →</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={selections.fields.length >= 3}
                    className={`w-full min-h-[100px] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed ${
                      selections.fields.length >= 3
                        ? 'cursor-not-allowed'
                        : ''
                    }`}
                    style={{
                      borderColor: selections.fields.length >= 3 ? '#D1D5DB' : '#D5E4FF',
                      backgroundColor: selections.fields.length >= 3 ? '#F9FAFB' : '#F8F9FF',
                      color: selections.fields.length >= 3 ? '#9CA3AF' : '#2370FF'
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    <div className="text-center">
                      <p className="font-medium text-sm">
                        {selections.fields.length >= 3 ? "Max 3 fields" : "Add Field"}
                      </p>
                      <p className="text-xs" style={{
                        color: selections.fields.length >= 3 ? '#9CA3AF' : '#6477B4'
                      }}>
                        {selections.fields.length >= 3
                          ? "Remove one to add"
                          : `${3 - selections.fields.length} remaining`
                        }
                      </p>
                    </div>
                  </button>
                </div>
              </div>

            {/* Search Panel */}
            {isDropdownOpen && (
              <div className="mt-4 bg-white rounded-xl shadow-sm p-4 relative z-30" style={{
                border: '1px solid #F0F4FA',
                boxShadow: '0 -4px 2px 0 rgba(17, 35, 89, 0.08) inset, 0 1.5px 1.5px 0 rgba(17, 35, 89, 0.17), 0 2px 5px 0 rgba(17, 35, 89, 0.03), 0 12px 45px 0 rgba(13, 57, 170, 0.15)'
              }}>
                <input
                  type="text"
                  placeholder="Search engineering fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm bg-transparent focus:outline-none font-medium mb-4 px-2 py-2"
                  style={{ color: '#002A79', border: 'none' }}
                  autoFocus
                />
                <div className="max-h-40 overflow-y-auto">
                  <div className="grid gap-2">
                    {getFilteredFields().map(([fieldId, field]) => {
                      const FieldIcon = field.icon;
                      const isDisabled = selections.fields.length >= 3;
                      return (
                        <button
                          key={fieldId}
                          onClick={() => handleFieldAdd(fieldId)}
                          disabled={isDisabled}
                          className={`flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all ${
                            isDisabled
                              ? 'opacity-40 cursor-not-allowed'
                              : ''
                          }`}
                          style={{
                            backgroundColor: isDisabled ? '#F9FAFB' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!isDisabled) {
                              e.target.style.backgroundColor = "rgba(35, 112, 255, 0.08)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isDisabled) {
                              e.target.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          <FieldIcon className="w-4 h-4" style={{
                            color: isDisabled ? '#9CA3AF' : '#2370FF'
                          }} />
                          <span className="font-medium text-sm" style={{
                            color: isDisabled ? '#9CA3AF' : '#374151'
                          }}>
                            {field.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Action Button Section */}
        <div className="px-8 py-6 text-center" style={{ backgroundColor: '#FFFFFF' }}>
              <button
                onClick={handleProceed}
                disabled={loading}
                className="transition-all hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  display: 'inline-flex',
                  padding: '12px 32px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
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
                  lineHeight: '125%'
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Build My Perfect Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 text-sm" style={{ color: '#EF4444' }}>
                  {error} - Continuing anyway...
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4" style={{ fontSize: '12px', color: '#6477B4' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                <span>Smart defaults applied • Ready to customize</span>
              </div>
        </div>
      </div>
      </DashboardLayout>
    );
  }

export default function ResumeConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeConfirmationPageContent />
    </Suspense>
  );
}