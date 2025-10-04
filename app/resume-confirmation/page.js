"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  useEffect(() => {
    const pathParam = searchParams.get("path");
    if (pathParam) setPath(pathParam);
  }, [searchParams]);

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
      <div className="min-h-screen py-8" style={{ background: "linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4">

          {/* Main Container - Fixed */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none -z-10" style={{ background: "linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary) 20%, transparent 100%)" }}></div>

            {/* Modern Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10"
                       style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl opacity-20 blur-lg scale-110" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))" }}></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black mb-2" style={{ color: "var(--brand-primary)" }}>
                    Almost Ready!
                  </h1>
                  <p className="text-gray-600 font-medium">Review and customize your selections</p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-600">Type</span>
                </div>
                <div className="w-8 h-0.5 rounded-full" style={{ background: "linear-gradient(to right, #10b981, var(--brand-primary))" }}></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-md text-white text-xs font-bold" style={{ background: "var(--brand-primary)" }}>
                    2
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>Setup</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shadow-sm text-gray-500 text-xs font-bold">
                    3
                  </div>
                  <span className="text-xs font-medium text-gray-500">Build</span>
                </div>
              </div>
            </div>

            {/* Enhanced Configuration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Career Path - Enhanced */}
              <div className="mb-6">
                <div className="backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                     style={{
                       background: "linear-gradient(135deg, var(--brand-secondary-light), var(--brand-secondary))",
                       border: `1px solid var(--brand-secondary-medium)`
                     }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                         style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                      <CareerIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Career Goal</h3>
                      <p className="text-xs text-gray-600">What you&apos;re targeting</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={selections.career}
                      onChange={(e) => handleFieldChange('career', e.target.value)}
                      className="w-full appearance-none bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 cursor-pointer shadow-sm transition-all"
                      style={{
                        color: "var(--brand-primary)",
                        border: `1px solid var(--brand-secondary-medium)`
                      }}
                    >
                      {careerOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--brand-primary)" }} />
                  </div>
                </div>
              </div>

              {/* Education Level - Enhanced */}
              <div className="mb-6">
                <div className="backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                     style={{
                       background: "linear-gradient(135deg, var(--brand-secondary-light), var(--brand-secondary))",
                       border: `1px solid var(--brand-secondary-medium)`
                     }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Academic Year</h3>
                      <p className="text-xs text-gray-600">Current study level</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={selections.education}
                      onChange={(e) => handleFieldChange('education', e.target.value)}
                      className="w-full appearance-none bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 cursor-pointer shadow-sm transition-all"
                      style={{
                        color: "var(--brand-primary)",
                        border: `1px solid var(--brand-secondary-medium)`
                      }}
                    >
                      {yearOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--brand-primary)" }} />
                  </div>
                </div>
              </div>

              {/* Fields Counter - Enhanced */}
              <div className="mb-6">
                <div className="backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                     style={{
                       background: "linear-gradient(135deg, var(--brand-secondary-light), var(--brand-secondary))",
                       border: `1px solid var(--brand-secondary-medium)`
                     }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Specializations</h3>
                      <p className="text-xs text-gray-600">Engineering fields</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black" style={{ color: "var(--brand-primary)" }}>
                      {selections.fields.length}/3
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                          width: `${(selections.fields.length / 3) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Engineering Fields Section */}
            <div className="rounded-3xl p-6 shadow-lg mb-6 relative" style={{ background: "linear-gradient(135deg, var(--brand-secondary-lightest), var(--brand-secondary-light))", border: `1px solid var(--brand-secondary-medium)` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl pointer-events-none"></div>

              <div className="grid lg:grid-cols-4 gap-6 relative">
                {/* Selected Fields - Enhanced */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                      <Monitor className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Engineering Specializations</h3>
                      <p className="text-xs text-gray-600">Your selected fields ({selections.fields.length}/3)</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 min-h-[60px] items-start">
                    {selections.fields.map((fieldId) => {
                      const field = getFieldData(fieldId);
                      const FieldIcon = field.icon;
                      return (
                        <div
                          key={fieldId}
                          className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                          style={{ border: `1px solid var(--brand-secondary-medium)` }}
                        >
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                            <FieldIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{field.name}</span>
                          <button
                            onClick={() => handleFieldRemove(fieldId)}
                            className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all ml-1"
                          >
                            <X className="w-2.5 h-2.5 text-red-600" />
                          </button>
                        </div>
                      );
                    })}
                    {selections.fields.length === 0 && (
                      <div className="flex items-center justify-center w-full py-4">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <Plus className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No specializations selected</p>
                          <p className="text-xs text-gray-400">Add your first field using the button →</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Button - Enhanced */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={selections.fields.length >= 3}
                    className={`w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      selections.fields.length >= 3
                        ? 'bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white/80 backdrop-blur-sm hover:scale-105 shadow-sm hover:shadow-md'
                    }`}
                    style={{
                      borderColor: selections.fields.length >= 3 ? '#d1d5db' : 'var(--brand-secondary-medium)',
                      color: selections.fields.length >= 3 ? '#9ca3af' : 'var(--brand-primary)'
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      selections.fields.length >= 3
                        ? 'bg-gray-200'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      background: selections.fields.length >= 3 ? '#e5e7eb' : 'var(--brand-secondary)'
                    }}>
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">
                        {selections.fields.length >= 3 ? "Maximum Reached" : "Add Specialization"}
                      </p>
                      <p className="text-xs opacity-75">
                        {selections.fields.length >= 3
                          ? "Remove a field to add more"
                          : `${3 - selections.fields.length} slot${3 - selections.fields.length !== 1 ? 's' : ''} remaining`
                        }
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Search Panel */}
            {isDropdownOpen && (
              <div className="mt-4 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl p-6 relative z-30" style={{ border: `1px solid var(--brand-secondary-medium)` }}>
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border" style={{ background: "linear-gradient(135deg, var(--brand-secondary-lightest), var(--brand-secondary-light))", borderColor: "var(--brand-secondary)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search engineering fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-500 font-medium"
                    autoFocus
                  />
                  <button
                    onClick={() => { setIsDropdownOpen(false); setSearchTerm(""); }}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors border border-gray-200"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
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
                          className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                            isDisabled
                              ? 'opacity-40 cursor-not-allowed bg-gray-50'
                              : 'hover:shadow-md border border-transparent'
                          }`}
                          style={{
                            background: isDisabled ? '#f9fafb' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!isDisabled) {
                              e.target.style.background = "linear-gradient(135deg, var(--brand-secondary-lightest), var(--brand-secondary-light))";
                              e.target.style.borderColor = "var(--brand-secondary-medium)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isDisabled) {
                              e.target.style.background = "transparent";
                              e.target.style.borderColor = "transparent";
                            }
                          }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDisabled
                              ? 'bg-gray-200 text-gray-400'
                              : 'transition-all'
                          }`}
                          style={{
                            background: isDisabled ? '#e5e7eb' : 'var(--brand-secondary)',
                            color: isDisabled ? '#9ca3af' : 'var(--brand-primary)'
                          }}>
                            <FieldIcon className="w-4 h-4" />
                          </div>
                          <span className={`font-medium ${
                            isDisabled ? 'text-gray-400' : 'text-gray-800'
                          }`}>
                            {field.name}
                          </span>
                          {!isDisabled && (
                            <Plus className="w-4 h-4 ml-auto opacity-0 transition-opacity" style={{ color: "var(--brand-primary)" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleProceed}
                disabled={loading}
                className="inline-flex items-center gap-4 px-10 py-4 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 50%, var(--brand-primary-darker) 100%)" }}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300"></div>
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                    <span className="relative z-10">Preparing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Build My Perfect Resume</span>
                    <ArrowRight className="w-6 h-6 transition-transform duration-200 relative z-10" />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 text-sm text-red-600">
                  {error} - Continuing anyway...
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Smart defaults applied • Ready to customize</span>
              </div>
            </div>
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