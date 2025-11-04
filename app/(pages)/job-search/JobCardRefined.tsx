import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  Bookmark,
  X,
  ExternalLink,
  Building2,
  UserCircle,
  Tag
} from "lucide-react";

interface Job {
  id: string;
  company: string;
  companyLogo: string;
  companyCategory: string;
  title: string;
  salary: string;
  jobType: string;
  location: string;
  postedTime: string;
  applicants: number;
  matchScore: number;
  successRate: number;
  skillsMatch: number;
  experienceMatch: number;
  isUrgent?: boolean;
  isRemote?: boolean;
  companyWebsite?: string;
  companyLinkedin?: string;
  hrName?: string;
  hrLinkedin?: string;
  applyUrl?: string;
}

const sampleJobs: Job[] = [
  {
    id: "1",
    company: "Zomato",
    companyLogo: "🍽️",
    companyCategory: "Food Tech",
    title: "React Engineer",
    salary: "₹18-28 LPA",
    jobType: "Full-time",
    location: "Gurgaon",
    postedTime: "5 hours ago",
    applicants: 85,
    matchScore: 89,
    successRate: 87,
    skillsMatch: 91,
    experienceMatch: 90,
    companyWebsite: "https://www.zomato.com/careers",
    applyUrl: "https://www.zomato.com/careers/job/react-engineer",
    companyLinkedin: "https://linkedin.com/company/zomato",
    hrName: "Rahul Sharma",
    hrLinkedin: "https://linkedin.com/in/rahulsharma",
  },
  {
    id: "2",
    company: "Swiggy",
    companyLogo: "🧡",
    companyCategory: "Food Delivery",
    title: "Full Stack Engineer",
    salary: "₹15-25 LPA",
    jobType: "Full-time",
    location: "Hyderabad",
    postedTime: "2 days ago",
    applicants: 142,
    matchScore: 84,
    successRate: 78,
    skillsMatch: 87,
    experienceMatch: 85,
    isRemote: true,
    companyWebsite: "https://www.swiggy.com/careers",
    applyUrl: "https://www.swiggy.com/careers/job/full-stack-engineer",
    companyLinkedin: "https://linkedin.com/company/swiggy",
    hrName: "Priya Reddy",
    hrLinkedin: "https://linkedin.com/in/priyareddy",
  },
  {
    id: "3",
    company: "Razorpay",
    companyLogo: "💳",
    companyCategory: "FinTech",
    title: "Senior Frontend Developer",
    salary: "₹25-35 LPA",
    jobType: "Full-time",
    location: "Bangalore",
    postedTime: "1 day ago",
    applicants: 67,
    matchScore: 92,
    successRate: 85,
    skillsMatch: 75,
    experienceMatch: 100,
    isUrgent: true,
    companyWebsite: "https://razorpay.com/jobs",
    applyUrl: "https://razorpay.com/jobs/senior-frontend-developer",
    companyLinkedin: "https://linkedin.com/company/razorpay",
    hrName: "Anjali Desai",
    hrLinkedin: "https://linkedin.com/in/anjalidesai",
  },
  {
    id: "4",
    company: "PhonePe",
    companyLogo: "💸",
    companyCategory: "FinTech",
    title: "Frontend Developer",
    salary: "₹20-30 LPA",
    jobType: "Full-time",
    location: "Mumbai",
    postedTime: "3 days ago",
    applicants: 156,
    matchScore: 78,
    successRate: 85,
    skillsMatch: 82,
    experienceMatch: 70,
    isRemote: true,
    companyWebsite: "https://www.phonepe.com/careers",
    applyUrl: "https://www.phonepe.com/careers/job/frontend-developer",
    companyLinkedin: "https://linkedin.com/company/phonepe",
    hrName: "Vikram Patel",
    hrLinkedin: "https://linkedin.com/in/vikrampatel",
  },
];

type FilterType = "all" | "high-match" | "remote" | "urgent" | "internships";

// Figma config styles
const shadowBoxStyle = {
  boxShadow: `0 0 6px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)`
};

const applyButtonStyle = {
  background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
  border: "1px solid rgba(35, 112, 255, 0.30)",
  boxShadow: "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
  textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
};

const JobCard = ({ job }: { job: Job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [showApplyOverlay, setShowApplyOverlay] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Animate progress circle on mount
    setTimeout(() => setProgressValue(job.matchScore), 100);

    // Check if user has applied to this job before
    const appliedStatus = localStorage.getItem(`job_applied_${job.id}`);
    if (appliedStatus === 'true') {
      setHasApplied(true);
    }
  }, [job.id, job.matchScore]);

  const getMatchColor = (score: number) => {
    if (score >= 85) return "#10B981";
    if (score >= 70) return "#3B82F6";
    return "#F59E0B";
  };

  const handleApplyClick = (applyUrl: string) => {
    // Open the external URL
    window.open(applyUrl, '_blank');
    // Show the overlay immediately
    setShowApplyOverlay(true);
  };

  const handleConfirmApplied = () => {
    // User confirmed they applied
    localStorage.setItem(`job_applied_${job.id}`, 'true');
    setHasApplied(true);
    setShowApplyOverlay(false);
  };

  const handleDenyApplied = () => {
    // User didn't apply, just close the overlay
    setShowApplyOverlay(false);
  };

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <div
      className="rounded-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        ...shadowBoxStyle,
        height: "180px", // Fixed height
      }}
    >
      {/* Main Card Content */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: isExpanded ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="flex gap-4 p-4 h-full">
          {/* Left: Match Circle + Logo */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Circular Progress */}
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#F3F4F6"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={getMatchColor(job.matchScore)}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black" style={{ color: getMatchColor(job.matchScore) }}>
                  {job.matchScore}
                </span>
                <span className="text-[8px] font-bold text-gray-400">MATCH</span>
              </div>
            </div>

            {/* Company Logo */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
              style={{
                border: "1px solid #E5E7EB",
                background: "linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)",
              }}
            >
              {job.companyLogo}
            </div>
          </div>

          {/* Right: Job Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold truncate mb-0.5" style={{ color: "#111827" }}>
                    {job.title}
                  </h3>
                  <p className="text-sm font-semibold truncate" style={{ color: "#6B7280" }}>
                    {job.company}
                  </p>
                </div>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-1.5 hover:bg-gray-50 rounded-lg transition-all shrink-0"
                >
                  <Bookmark
                    className="w-4 h-4"
                    style={{
                      color: isSaved ? "#3B82F6" : "#9CA3AF",
                      fill: isSaved ? "#3B82F6" : "transparent"
                    }}
                  />
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2 text-xs">
                <div className="flex items-center gap-1.5" style={{ color: "#6B7280" }}>
                  <DollarSign className="w-3.5 h-3.5 shrink-0" style={{ color: "#10B981" }} />
                  <span className="font-semibold truncate">{job.salary}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: "#6B7280" }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#F59E0B" }} />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: "#6B7280" }}>
                  <Briefcase className="w-3.5 h-3.5 shrink-0" style={{ color: "#6366F1" }} />
                  <span className="truncate">{job.jobType}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: "#6B7280" }}>
                  <Users className="w-3.5 h-3.5 shrink-0" style={{ color: "#EC4899" }} />
                  <span className="truncate">{job.applicants} applied</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5">
                <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>
                  {job.companyCategory}
                </div>
                {job.isUrgent && (
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}>
                    🔥 Urgent
                  </div>
                )}
                {job.isRemote && (
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "#F0FDF4", color: "#10B981" }}>
                    🌍 Remote
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all border hover:bg-gray-50"
                style={{
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  borderColor: "#E5E7EB",
                }}
              >
                Details →
              </button>
              <button
                onClick={() => !hasApplied && handleApplyClick(job.applyUrl || job.companyWebsite || '#')}
                disabled={hasApplied}
                style={{
                  ...applyButtonStyle,
                  ...(hasApplied && {
                    background: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
                    border: "1px solid rgba(5, 150, 105, 0.30)",
                    cursor: "not-allowed",
                    opacity: 0.8
                  })
                }}
                className="flex-1 py-2 px-3 text-white text-sm font-semibold rounded-lg transition-all hover:opacity-90 disabled:hover:opacity-80"
              >
                {hasApplied ? "Applied ✓" : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel - Slides in from right */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out overflow-y-auto"
        style={{
          transform: isExpanded ? "translateX(0)" : "translateX(100%)",
          background: "linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)",
        }}
      >
        <div className="h-full p-5 flex flex-col relative">
          {/* Minimal Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/80 transition-all duration-300 z-10 group"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" style={{ color: "#6B7280" }} />
          </button>

          {/* Header with Match Score */}
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${getMatchColor(job.matchScore)}15, ${getMatchColor(job.matchScore)}25)`,
                border: `2px solid ${getMatchColor(job.matchScore)}30`,
              }}
            >
              <div className="text-2xl font-black" style={{ color: getMatchColor(job.matchScore) }}>
                {job.matchScore}%
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#9CA3AF" }}>
                Overall Match
              </div>
              <div className="text-sm font-bold" style={{ color: "#111827" }}>
                {job.company}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)" }} />

          {/* Match Breakdown */}
          <div className="space-y-2.5 mb-3">
            {[
              { label: "Skills Match", value: job.skillsMatch, icon: "💡", color: "#3B82F6" },
              { label: "Experience Match", value: job.experienceMatch, icon: "⭐", color: "#8B5CF6" },
              { label: "Success Rate", value: job.successRate, icon: "🎯", color: "#10B981" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="flex items-center justify-between group hover:translate-x-1 transition-all duration-300"
                style={{
                  animation: `fade-in 0.4s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg transition-transform group-hover:scale-110 duration-300">{stat.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: "60px",
                      background: `linear-gradient(90deg, ${stat.color}40 0%, ${stat.color} ${stat.value}%, #E5E7EB ${stat.value}%)`,
                    }}
                  />
                  <span className="text-sm font-black w-9 text-right" style={{ color: stat.color }}>
                    {stat.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)" }} />

          {/* Company & Job Details Section */}
          <div className="space-y-2">
            {/* Company Name & Category */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#DBEAFE" }}
              >
                <Building2 className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold block" style={{ color: "#6B7280" }}>
                  {job.company}
                </span>
                <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                  {job.companyCategory}
                </span>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#D1FAE5" }}
              >
                <DollarSign className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                {job.salary}
              </span>
            </div>

            {/* Job Type */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#E0E7FF" }}
              >
                <Briefcase className="w-3.5 h-3.5" style={{ color: "#6366F1" }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                {job.jobType}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                {job.location}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px my-2" style={{ background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)" }} />

            {/* Website */}
            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: "#DBEAFE" }}
                >
                  <Building2 className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
                </div>
                <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                  Company Website
                </span>
                <ExternalLink
                  className="w-3.5 h-3.5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300"
                  style={{ color: "#9CA3AF" }}
                />
              </a>
            )}

            {/* LinkedIn */}
            {job.companyLinkedin && (
              <a
                href={job.companyLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: "#DBEAFE" }}
                >
                  <Building2 className="w-3.5 h-3.5" style={{ color: "#0A66C2" }} />
                </div>
                <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                  Company LinkedIn
                </span>
                <ExternalLink
                  className="w-3.5 h-3.5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300"
                  style={{ color: "#9CA3AF" }}
                />
              </a>
            )}

            {/* HR Contact */}
            {job.hrName && (
              <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: "#F3F4F6" }}
                >
                  <UserCircle className="w-3.5 h-3.5" style={{ color: "#6B7280" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block" style={{ color: "#6B7280" }}>
                    {job.hrName}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                    Hiring Manager
                  </span>
                </div>
                {job.hrLinkedin && (
                  <a
                    href={job.hrLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-110 duration-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" style={{ color: "#0A66C2" }} />
                  </a>
                )}
              </div>
            )}

            {/* Posted Time */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                Posted {job.postedTime}
              </span>
            </div>

            {/* Applicants */}
            <div className="flex items-center gap-2.5 group hover:translate-x-1 transition-all duration-300">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: "#FCE7F3" }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: "#EC4899" }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: "#6B7280" }}>
                {job.applicants} applicants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Overlay with Confirmation Dialog */}
      {showApplyOverlay && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50 rounded-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "fadeIn 0.3s ease-out",
            padding: "24px",
          }}
        >
          <div
            className="relative flex flex-col items-center rounded-2xl"
            style={{
              gap: "20px",
              padding: "32px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
              minWidth: "300px",
              animation: "scaleIn 0.3s ease-out",
            }}
          >
            {/* Icon */}
            <Image
              src="/V3.png"
              alt="Application Icon"
              width={64}
              height={64}
              style={{
                animation: "scaleIn 0.3s ease-out",
              }}
            />

            {/* Title */}
            <h3
              className="text-lg font-bold text-center"
              style={{
                color: "#353E5C",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                animation: "fadeIn 0.4s ease-out",
                margin: 0,
              }}
            >
              Have you applied?
            </h3>

            {/* Description */}
            <p
              className="text-sm text-center"
              style={{
                color: "#6B7280",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                animation: "fadeIn 0.5s ease-out",
                margin: 0,
              }}
            >
              Let us know if you've submitted your application
            </p>

            {/* Buttons */}
            <div
              className="flex gap-3 w-full"
              style={{
                animation: "fadeIn 0.6s ease-out"
              }}
            >
              <button
                onClick={handleDenyApplied}
                className="flex-1 py-3 px-4 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }}
              >
                No
              </button>
              <button
                onClick={handleConfirmApplied}
                className="flex-1 py-3 px-4 rounded-lg text-white text-sm transition-all"
                style={{
                  background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                  border: "1px solid rgba(35, 112, 255, 0.30)",
                  boxShadow: "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                  textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export function JobRecommendations() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filters: { id: FilterType; label: string; icon?: any }[] = [
    { id: "all", label: "All Jobs" },
    { id: "high-match", label: "85+ Match", icon: Sparkles },
    { id: "remote", label: "Remote" },
    { id: "urgent", label: "Urgent" },
    { id: "internships", label: "Internships" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-6"
        style={{
          background: "linear-gradient(180deg, #474FA3 0%, #2A338B 100%)",
          boxShadow: "0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset"
        }}
      >
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 animate-pulse" />
              Hey Advika, Secure the bag! 💼
            </h1>
            <p className="text-white/90 text-lg">We found {sampleJobs.length} perfect matches for you</p>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <div className="backdrop-blur-md rounded-full px-6 py-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <p className="text-white text-sm font-medium">🔥 Trending this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: isActive ? "#2370FF" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#353E5C",
                border: `1px solid ${isActive ? "#2370FF" : "#E1E4ED"}`,
                boxShadow: isActive ? "0 2px 8px rgba(35, 112, 255, 0.3)" : "none",
              }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {sampleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
