"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  getJobsWithResumeUpload,
  addToWishlist,
  removeFromWishlist,
  markNotInterested,
  setJobStatus,
  JobStatusEnum,
  getJobDetails,
} from "@/services/jobService";
import { handleApiError, logError } from "@/utils/errorHandler";
import Image from "next/image";

// Button styles based on Figma config
const buttonStyles = {
  display: "inline-flex",
  padding: "2px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  background: "linear-gradient(180deg, #474FA3 0%, #2A338B 100%)",
  boxShadow:
    "0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset",
};

// Button text styles from Figma config
const buttonTextStyles = {
  color: "#FFFFFF",
  textAlign: "center",
  textShadow:
    "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "125%",
  letterSpacing: "-2%",
};

// Apply button specific styles - matching Upgrade Now button
const applyButtonStyles = {
  display: "inline-flex",
  padding: "8px 12px",
  alignItems: "center",
  borderRadius: "8px",
  border: "1px solid rgba(35, 112, 255, 0.30)",
  background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
  boxShadow:
    "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
  color: "#FFFFFF",
  textAlign: "center",
  textShadow:
    "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "125%",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const allJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Flipkart",
    companyType: "E-commerce · Technology · Public Company",
    location: "Bangalore",
    remote: true,
    type: "Full-time",
    level: "Senior Level, 4-6 Years",
    salary: "₹25-35 LPA",
    posted: "6 hours ago",
    applicants: 130,
    matchScore: 83,
    predictabilityScore: 92,
    experienceMatch: 100,
    skillsMatch: 75,
    teamSize: "50-100",
    linkedinUrl: "https://linkedin.com/company/flipkart",
    hrLinkedinUrl: "https://linkedin.com/in/flipkart-hr-manager",
    foundedYear: 2007,
    companyDescription:
      "Flipkart is India's leading e-commerce marketplace offering a wide range of products across categories like electronics, fashion, home & kitchen, and more.",
    companyWebsite: "https://www.flipkart.com/careers",
    isUrgent: true,
  },
  {
    id: 2,
    title: "React Engineer",
    company: "Zomato",
    companyType: "Food Tech · Startup · Public Company",
    location: "Gurgaon",
    remote: false,
    type: "Full-time",
    level: "Mid Level, 3-5 Years",
    salary: "₹18-28 LPA",
    posted: "5 hours ago",
    applicants: 85,
    matchScore: 89,
    predictabilityScore: 87,
    experienceMatch: 90,
    skillsMatch: 91,
    teamSize: "20-50",
    linkedinUrl: "https://linkedin.com/company/zomato",
    hrLinkedinUrl: "https://linkedin.com/in/zomato-talent-acquisition",
    foundedYear: 2008,
    companyDescription:
      "Zomato is a leading food delivery and restaurant discovery platform connecting millions of customers with restaurants across India and globally.",
    companyWebsite: "https://www.zomato.com/careers",
    isUrgent: false,
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "Swiggy",
    companyType: "Food Delivery · Technology · Private Company",
    location: "Hyderabad",
    remote: true,
    type: "Full-time",
    level: "Mid Level, 2-4 Years",
    salary: "₹15-25 LPA",
    posted: "1 day ago",
    applicants: 203,
    matchScore: 84,
    predictabilityScore: 78,
    experienceMatch: 85,
    skillsMatch: 87,
    teamSize: "100+",
    linkedinUrl: "https://linkedin.com/company/swiggy",
    hrLinkedinUrl: "https://linkedin.com/in/swiggy-hr-lead",
    foundedYear: 2014,
    companyDescription:
      "Swiggy is India's leading on-demand convenience platform that delivers food, groceries, and essentials to customers across 500+ cities.",
    companyWebsite: "https://careers.swiggy.com",
    isUrgent: false,
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "PhonePe",
    companyType: "FinTech · Payments · Private Company",
    location: "Mumbai",
    remote: true,
    type: "Full-time",
    level: "Mid Level, 3-5 Years",
    salary: "₹20-30 LPA",
    posted: "3 days ago",
    applicants: 156,
    matchScore: 78,
    predictabilityScore: 85,
    experienceMatch: 70,
    skillsMatch: 82,
    teamSize: "50-100",
    linkedinUrl: "https://linkedin.com/company/phonepe",
    hrLinkedinUrl: "https://linkedin.com/in/phonepe-recruiting",
    foundedYear: 2015,
    companyDescription:
      "PhonePe is India's leading digital payments platform, enabling secure and seamless transactions for millions of users across the country.",
    companyWebsite: "https://www.phonepe.com/careers",
    isUrgent: false,
  },
  {
    id: 5,
    title: "JavaScript Developer",
    company: "Razorpay",
    companyType: "FinTech · Payments · Private Company",
    location: "Pune",
    remote: false,
    type: "Full-time",
    level: "Entry Level, 1-3 Years",
    salary: "₹12-18 LPA",
    posted: "1 week ago",
    applicants: 245,
    matchScore: 72,
    predictabilityScore: 65,
    experienceMatch: 65,
    skillsMatch: 76,
    teamSize: "20-50",
    linkedinUrl: "https://linkedin.com/company/razorpay",
    hrLinkedinUrl: "https://linkedin.com/in/razorpay-talent-team",
    foundedYear: 2014,
    companyDescription:
      "Razorpay is a full-stack financial solutions company that enables businesses to accept, process and disburse payments with ease.",
    companyWebsite: "https://razorpay.com/jobs",
    isUrgent: false,
  },
  {
    id: 6,
    title: "JavaScript Developer",
    company: "Razorpay",
    companyType: "FinTech · Payments · Private Company",
    location: "Pune",
    remote: false,
    type: "Full-time",
    level: "Entry Level, 1-3 Years",
    salary: "₹12-18 LPA",
    posted: "1 week ago",
    applicants: 245,
    matchScore: 72,
    predictabilityScore: 65,
    experienceMatch: 65,
    skillsMatch: 76,
    teamSize: "20-50",
    linkedinUrl: "https://linkedin.com/company/razorpay",
    hrLinkedinUrl: "https://linkedin.com/in/razorpay-talent-team",
    foundedYear: 2014,
    companyDescription:
      "Razorpay is a full-stack financial solutions company that enables businesses to accept, process and disburse payments with ease.",
    companyWebsite: "https://razorpay.com/jobs",
    isUrgent: false,
  },
];

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

const EnhancedJobCard = ({
  job,
  onApply,
  onSave,
  onBlock,
  isApplied,
  isSaved,
  router,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isSaved);

  useEffect(() => {
    setIsBookmarked(isSaved);
  }, [isSaved]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onSave(job.id);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "550px",
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 20, 40, 0.08)",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 20, 40, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #0056b3, #28a745, #0056b3)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Header Section - Reduced padding */}
      <div style={{ padding: "16px 20px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #e6f2ff 0%, rgba(0, 86, 179, 0.05) 100%)",
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #0056b3, #003d82)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "white",
              flexShrink: 0,
            }}
          >
            {job.company.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#2c3e50", marginBottom: "3px" }}>
              {job.company}
            </h3>
            <p style={{ fontSize: "13px", color: "#6c757d", marginBottom: "5px" }}>{job.title}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 7px",
                  background: "#28a745",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {job.level?.split(",")[0] || "Senior"}
              </span>
              <span
                style={{
                  padding: "2px 7px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#6c757d",
                }}
              >
                {job.type}
              </span>
              <span
                style={{
                  padding: "2px 7px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#6c757d",
                }}
              >
                {job.remote ? "Remote" : "On-site"}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ position: "absolute", top: "16px", right: "20px", display: "flex", gap: "18px" }}>
          <button
            onClick={handleBookmarkClick}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
              background: isBookmarked ? "#0056b3" : "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              style={{
                stroke: isBookmarked ? "white" : "#6c757d",
                fill: isBookmarked ? "white" : "none",
                strokeWidth: 2,
              }}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Grid - More compact */}
      <div style={{ padding: "12px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        <div
          style={{
            textAlign: "center",
            padding: "10px 6px",
            background: "#f8f9fa",
            borderRadius: "10px",
            transition: "all 0.3s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e6f2ff";
            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0056b3", marginBottom: "3px", display: "block" }}>
            {job.matchScore}%
          </span>
          <span style={{ fontSize: "10px", color: "#6c757d", fontWeight: 500 }}>Match Score</span>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "10px 6px",
            background: "#f8f9fa",
            borderRadius: "10px",
            transition: "all 0.3s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e6f2ff";
            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0056b3", marginBottom: "3px", display: "block" }}>
            {job.applicants}
          </span>
          <span style={{ fontSize: "10px", color: "#6c757d", fontWeight: 500 }}>Applicants</span>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "10px 6px",
            background: "#f8f9fa",
            borderRadius: "10px",
            transition: "all 0.3s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e6f2ff";
            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0056b3", marginBottom: "3px", display: "block" }}>
            {job.experienceMatch}%
          </span>
          <span style={{ fontSize: "10px", color: "#6c757d", fontWeight: 500 }}>Experience</span>
        </div>
      </div>

      {/* Match Score Bar - Reduced padding */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#6c757d" }}>Your Profile Match</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0056b3" }}>{job.matchScore}% Match</span>
        </div>
        <div style={{ height: "6px", background: "#e9ecef", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #0056b3, #28a745)",
              borderRadius: "6px",
              width: `${job.matchScore}%`,
              position: "relative",
            }}
          />
        </div>
      </div>

      {/* Location and Salary Row - Reduced padding */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          gap: "12px",
          borderTop: "1px solid #e9ecef",
          borderBottom: "1px solid #e9ecef",
          background: "#f8f9fa",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#ffffff",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0056b3">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "9px",
                color: "#adb5bd",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Location
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#2c3e50" }}>{job.location}</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#ffffff",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0056b3">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "9px",
                color: "#adb5bd",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Salary
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#2c3e50" }}>{job.salary}</div>
          </div>
        </div>
      </div>

      {/* CTA Section - Reduced padding */}
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply(job.id);
          }}
          disabled={isApplied}
          style={{
            padding: "12px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: isApplied ? "not-allowed" : "pointer",
            background: isApplied ? "#28a745" : "#0056b3",
            color: "white",
            transition: "all 0.3s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (!isApplied) {
              e.currentTarget.style.background = "#003d82";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 86, 179, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isApplied) {
              e.currentTarget.style.background = "#0056b3";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }
          }}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>

        <button
          onClick={() => router.push(`/job-details/${job.id}`)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#ffffff",
            color: "#0056b3",
            border: "2px solid #0056b3",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e6f2ff";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          Details
        </button>
      </div>

      {/* Footer - Reduced padding */}
      <div
        style={{
          padding: "12px 20px",
          background: "#f8f9fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#adb5bd",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div
            style={{
              width: "5px",
              height: "5px",
              background: "#28a745",
              borderRadius: "50%",
            }}
          />
          <span>Posted {job.posted}</span>
        </div>
        <div>
          Source: <span style={{ color: "#0056b3", fontWeight: 600 }}>LinkedIn</span>
        </div>
      </div>
    </div>
  );
};

const JobSearchPage = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [dismissedJobs, setDismissedJobs] = useState(new Set());
  const [showApplyBanner, setShowApplyBanner] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const userName = user?.full_name || "User";
  const fullText = `85+ Matches, 25 Portals,  5+ Hours Saved`;
  const [jobs, setJobs] = useState(allJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobsWithResume = async () => {
      setLoading(true);
      setError(null);

      try {
        const savedResumeId =
          sessionStorage.getItem("uploadedResumeId") ||
          sessionStorage.getItem("createdResumeId");
        setJobs(allJobs);
        setLoading(false);
      } catch (err) {
        const errorMessage = handleApiError(err);
        logError("JobSearchPage - Fetch Jobs", err);
        setError(errorMessage);
        setJobs(allJobs);
        setLoading(false);
      }
    };

    fetchJobsWithResume();
  }, []);

  useEffect(() => {
    const googleFontsLink = document.createElement("link");
    googleFontsLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    googleFontsLink.rel = "stylesheet";
    document.head.appendChild(googleFontsLink);

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        font-family: 'Inter', sans-serif !important;
      }
      body {
        font-family: 'Inter', sans-serif !important;
      }
      button, input, select, textarea {
        font-family: 'Inter', sans-serif !important;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUpBlur {
        0% {
          opacity: 0;
          transform: translateY(30px);
          filter: blur(10px);
        }
        60% {
          filter: blur(0px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
        }
      }

      @keyframes fadeOut {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      /* Custom scrollbar for hover views */
      .hover-overlay-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .hover-overlay-scroll::-webkit-scrollbar-track {
        background: #F8F9FF;
        border-radius: 10px;
        margin: 8px 0;
      }
      .hover-overlay-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #679CFF 0%, #2370FF 100%);
        borderRadius: 10px;
        border: 2px solid #F8F9FF;
      }
      .hover-overlay-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #2370FF 0%, #1a5acc 100%);
      }

      /* New Job Card Animations */
      @keyframes cardEntry {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      @keyframes logoFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      @keyframes timePulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(35, 112, 255, 0.3); }
        50% { box-shadow: 0 0 0 8px rgba(35, 112, 255, 0); }
      }

      @keyframes clockSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes metaItemEntry {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes barGrow {
        to { transform: scaleX(1); }
      }

      @keyframes avatarPop {
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pinBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      @keyframes salaryPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      @keyframes chipGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        50% { box-shadow: 0 0 20px 5px rgba(34, 197, 94, 0.2); }
      }

      @keyframes infoRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes barRise {
        to { transform: scaleY(1); }
      }

      @keyframes arrowFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }

      @keyframes tagFade {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @keyframes cardEntryStagger {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Responsive Grid Improvements */
      @media (max-width: 480px) {
        .job-grid {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
          padding: 0 16px !important;
        }
      }

      @media (min-width: 481px) and (max-width: 900px) {
        .job-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
          max-width: 550px !important;
        }
      }

      @media (min-width: 901px) and (max-width: 1399px) {
        .job-grid {
          grid-template-columns: repeat(2, 550px) !important;
          gap: 40px !important;
        }
      }

      @media (min-width: 1400px) {
        .job-grid {
          grid-template-columns: repeat(2, 550px) !important;
          gap: 48px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    setTypewriterText("");
    setShowCursor(true);
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, currentIndex));
      currentIndex++;
      if (currentIndex > fullText.length) {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("[data-dropdown-container]")) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showSortDropdown]);

  const filteredJobs = useMemo(() => {
    let filteredList = jobs.filter((job) => !dismissedJobs.has(job.id));
    if (filterBy === "remote")
      filteredList = filteredList.filter((job) => job.remote);
    else if (filterBy === "urgent")
      filteredList = filteredList.filter((job) => job.isUrgent);
    else if (filterBy === "high-match")
      filteredList = filteredList.filter((job) => job.matchScore >= 85);
    else if (filterBy === "internships")
      filteredList = filteredList.filter(
        (job) => job.level && job.level.toLowerCase().includes("intern")
      );

    if (sortBy === "match")
      filteredList.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    else if (sortBy === "recent") filteredList.sort((a, b) => b.id - a.id);
    else if (sortBy === "salary") {
      const getSalaryMax = (salary) => {
        if (!salary) return 0;
        const parts = salary.split("-");
        if (parts.length === 2)
          return parseInt(parts[1].replace(/[^\d]/g, ""), 10);
        return parseInt(parts[0].replace(/[^\d]/g, ""), 10);
      };
      filteredList.sort(
        (a, b) => getSalaryMax(b.salary) - getSalaryMax(a.salary)
      );
    }
    return filteredList;
  }, [jobs, filterBy, sortBy, dismissedJobs]);

  const handleApply = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job && job.companyWebsite) {
      window.open(job.companyWebsite, "_blank");
    }

    try {
      await setJobStatus(jobId, JobStatusEnum.APPLIED, {
        applied_at: new Date().toISOString(),
        application_url: job?.companyWebsite,
      });

      setTimeout(() => {
        setAppliedJobs((prev) => new Set(prev).add(jobId));
        setShowApplyBanner(true);
        setTimeout(() => setShowApplyBanner(false), 3000);
      }, 500);
    } catch (err) {
      logError("JobSearchPage - Apply", err);
      setTimeout(() => {
        setAppliedJobs((prev) => new Set(prev).add(jobId));
        setShowApplyBanner(true);
        setTimeout(() => setShowApplyBanner(false), 3000);
      }, 500);
    }
  };

  const handleSaveJob = async (jobId) => {
    const isSaved = savedJobs.has(jobId);

    try {
      if (isSaved) {
        await removeFromWishlist(jobId);
      } else {
        await addToWishlist(jobId);
      }

      setSavedJobs((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) newSet.delete(jobId);
        else newSet.add(jobId);
        return newSet;
      });
    } catch (err) {
      logError("JobSearchPage - Save", err);
      setSavedJobs((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) newSet.delete(jobId);
        else newSet.add(jobId);
        return newSet;
      });
    }
  };

  const handleBlock = async (jobId) => {
    try {
      await markNotInterested(jobId);
      setDismissedJobs((prev) => new Set(prev).add(jobId));
    } catch (err) {
      logError("JobSearchPage - Block", err);
      setDismissedJobs((prev) => new Set(prev).add(jobId));
    }
  };

  const sortOptions = [
    { value: "match", label: "Match Score" },
    { value: "recent", label: "Most Recent" },
    { value: "salary", label: "Salary" },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setShowSortDropdown(false);
  };

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F8F9FF",
          width: "100%",
        }}
      >
        {/* Header Banner Container */}
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "0 16px",
            width: "100%"
          }}
        >
          <div
            className="relative py-8 px-6 sm:px-8 lg:px-12 overflow-hidden flex items-center"
            style={{
              backgroundImage: "url(/header-banner.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "120px",
              boxShadow: "0 4px 20px 0 #2370FF66",
              borderRadius: "20px",
              marginBottom: "24px"
            }}
          >
            <div className="relative z-10">
              <h1
                className="text-white font-semibold mb-2"
                style={{
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: "clamp(20px, 4vw, 32px)",
                  lineHeight: "1.2",
                  maxWidth: "800px",
                }}
              >
                {typewriterText}
                {showCursor && <span className="animate-pulse">|</span>}
              </h1>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className="bg-white border-b sticky top-0 z-30"
          style={{
            borderColor: "#E1E4ED",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(35, 112, 255, 0.06)"
          }}
        >
          <div
            style={{
              maxWidth: "1600px",
              margin: "0 auto",
              padding: "20px 24px",
              width: "100%"
            }}
          >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-3 flex-wrap">
              {[
                { key: "all", label: "All Jobs" },
                { key: "high-match", label: "85+ Match" },
                { key: "remote", label: "Remote" },
                { key: "urgent", label: "Urgent" },
                { key: "internships", label: "Internships" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterBy(filter.key)}
                  style={
                    filterBy === filter.key
                      ? {
                          display: "inline-flex",
                          padding: "8px 12px",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                          boxShadow:
                            "0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset, 0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset",
                          color: "#FFFFFF",
                          textShadow:
                            "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "125%",
                          letterSpacing: "-0.36px",
                          whiteSpace: "nowrap",
                        }
                      : {
                          display: "inline-flex",
                          padding: "8px 12px",
                          gap: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "10px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "#D5E4FF",
                          borderTop: "1px solid #D5E4FF",
                          background:
                            "linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)",
                          boxShadow: "0 4px 8px -2px rgba(0, 19, 88, 0.10)",
                          opacity: 1,
                          color: "#474FA3",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "125%",
                          letterSpacing: "-0.32px",
                          whiteSpace: "nowrap",
                        }
                  }
                  className="transition-all hover:opacity-90"
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label
                className="text-sm font-semibold"
                style={{ color: "#000E41" }}
              >
                Sort by:
              </label>
              <div
                style={{ position: "relative", minWidth: "160px" }}
                data-dropdown-container
              >
                <div
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full text-sm font-medium cursor-pointer focus:outline-none flex items-center justify-between"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #F0F4FA",
                    background: "#FFF",
                    boxShadow:
                      "0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)",
                    color: "#000E41",
                  }}
                >
                  <span>
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 20 20"
                    style={{
                      transform: showSortDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {showSortDropdown && (
                  <div
                    style={{
                      display: "flex",
                      minWidth: "200px",
                      padding: "16px",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "4px",
                      borderRadius: "12px",
                      border: "1px solid #F0F4FA",
                      background: "#FFF",
                      boxShadow:
                        "0 -4px 2px 0 rgba(17, 35, 89, 0.08) inset, 0 1.5px 1.5px 0 rgba(17, 35, 89, 0.17), 0 2px 5px 0 rgba(17, 35, 89, 0.03), 0 12px 45px 0 rgba(13, 57, 170, 0.15)",
                      position: "absolute",
                      top: "60px",
                      right: "0",
                      zIndex: 50,
                    }}
                  >
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50 text-sm font-medium"
                        style={{
                          backgroundColor:
                            sortBy === option.value
                              ? "rgba(35, 112, 255, 0.08)"
                              : "transparent",
                          color:
                            sortBy === option.value ? "#000E41" : "#374151",
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Job Cards Section */}
        <div
          className="py-12"
          style={{
            backgroundColor: "transparent",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            padding: "48px 24px"
          }}
        >
          {filteredJobs.length === 0 ? (
            <div
              className="text-center py-16 rounded-xl shadow-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F3F7",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              <div className="text-6xl mb-6">😞</div>
              <div
                className="mb-6 text-xl font-semibold"
                style={{ color: "#353E5C" }}
              >
                No jobs match your criteria
              </div>
              <button
                onClick={() => setDismissedJobs(new Set())}
                style={{
                  display: "inline-flex",
                  padding: "12px 32px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(180deg, #474FA3 0%, #2A338B 100%)",
                  boxShadow:
                    "0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset",
                  color: "#FFFFFF",
                  textShadow:
                    "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "125%",
                  letterSpacing: "-0.36px",
                }}
                className="hover:opacity-90 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className="job-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(500px, 550px))",
                gap: "40px",
                justifyContent: "center",
                alignItems: "start",
                maxWidth: "1200px",
                margin: "0 auto"
              }}
            >
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="job-card-wrapper"
                  style={{
                    animation: `cardEntryStagger 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s backwards`,
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <EnhancedJobCard
                    job={job}
                    onApply={handleApply}
                    onSave={handleSaveJob}
                    onBlock={handleBlock}
                    isApplied={appliedJobs.has(job.id)}
                    isSaved={savedJobs.has(job.id)}
                    router={router}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {showApplyBanner && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
            <span className="font-semibold">Successfully applied!</span>
            <button
              onClick={() => setShowApplyBanner(false)}
              style={{
                ...buttonStyles,
                padding: "4px",
                background: "transparent",
                color: "#FFFFFF",
                textShadow:
                  "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 500,
              }}
              className="hover:text-gray-200 transition-all"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobSearchPage;
