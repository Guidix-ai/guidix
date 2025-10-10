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
  const [isHoveringMatchScore, setIsHoveringMatchScore] = useState(false);
  const [isHoveringCompanyDetails, setIsHoveringCompanyDetails] =
    useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const handleCardClick = (e) => {
    // Card click disabled - no routing
  };

  const handleShowLess = (e) => {
    e.stopPropagation();
    setIsHoveringMatchScore(false);
  };

  const totalBlocks = 5;

  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(null);

  useEffect(() => {
    if (cardRef.current && !cardHeight) {
      // Measure the full card height including sticky buttons
      const fullHeight = cardRef.current.offsetHeight;
      setCardHeight(fullHeight);
    }
  }, [cardHeight]);

  return (
    <div
      ref={cardRef}
      className="rounded-lg shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F3F7",
        boxShadow: shadowBoxStyle,
        overflow: "hidden",
        position: "relative",
        minHeight: cardHeight ? `${cardHeight}px` : "auto",
      }}
      onMouseLeave={() => {
        setIsHoveringMatchScore(false);
        setIsHoveringCompanyDetails(false);
      }}
    >
      {!isHoveringMatchScore && !isHoveringCompanyDetails ? (
        <div
          className="px-4 pb-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="flex justify-between items-center py-3 mb-3">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              onMouseEnter={() => setIsHoveringCompanyDetails(true)}
              data-company-details="true"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white"
                style={{ border: "1px solid #E1E4ED" }}
              >
                <Image
                  src={`https://logo.clearbit.com/${job.company
                    .toLowerCase()
                    .replace(/\s+/g, "")}.com`}
                  alt={job.company}
                  className="w-full h-full object-contain rounded-lg"
                  width={40}
                  height={40}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#0F2678", display: "none" }}
                >
                  {job.company.charAt(0)}
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#002A79" }}
                >
                  {job.company}
                </div>
                <div className="text-xs" style={{ color: "#6D7586" }}>
                  {job.companyType.split(" · ")[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(job.id);
                }}
                style={{
                  ...buttonStyles,
                  padding: "4px",
                  background: "transparent",
                  boxShadow: "none",
                }}
                className="hover:opacity-70 transition-all"
                title="Dismiss"
              >
                <Image
                  src="/dismiss.svg"
                  alt="Dismiss"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(job.id);
                }}
                style={{
                  ...buttonStyles,
                  background: "transparent",
                  padding: "4px",
                  boxShadow: "none",
                }}
                className="transition-all hover:opacity-70"
                title="Save Job"
              >
                <Image
                  src="/wishlist.svg"
                  alt="Save"
                  width={20}
                  height={20}
                  style={{ opacity: isSaved ? 1 : 0.6 }}
                />
              </button>
            </div>
          </div>

          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "#002A79" }}
          >
            {job.title}
          </h3>

          <div className="flex items-center gap-4 text-xs mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Image src="/salary.svg" alt="Salary" width={20} height={20} />
              <span style={{ fontWeight: "500", color: "#353E5C" }}>
                {job.salary}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Image src="/jobtype.svg" alt="Job Type" width={20} height={20} />
              <span style={{ fontWeight: "500", color: "#353E5C" }}>
                {job.type}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/location.svg"
                alt="Location"
                width={20}
                height={20}
              />
              <span style={{ fontWeight: "500", color: "#353E5C" }}>
                {job.location}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mb-3">
            <div style={{ fontWeight: "500", color: "#6477b4" }}>
              {job.posted} • {job.applicants} applicants
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-3 pt-3"
            style={{ borderTop: "1px solid #F1F3F7" }}
          >
            <div
              className="cursor-pointer text-sm flex-1"
              style={{ color: "#353E5C", fontWeight: 500 }}
              onMouseEnter={() => setIsHoveringMatchScore(true)}
              data-match-score="true"
            >
              You match{" "}
              <span style={{ fontWeight: 700, color: "#2370FF" }}>
                {job.matchScore}%
              </span>{" "}
              and success rate is{" "}
              <span style={{ fontWeight: 700, color: "#74D184" }}>
                {job.predictabilityScore}%
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(job.id);
              }}
              disabled={isApplied}
              style={{
                ...applyButtonStyles,
                background: isApplied
                  ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
                  : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                cursor: isApplied ? "not-allowed" : "pointer",
              }}
              className="transition-all hover:opacity-90"
            >
              {isApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
        </div>
      ) : isHoveringMatchScore ? (
        <div
          className="hover-overlay-scroll"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            overflowY: "auto",
            animation: "slideUpBlur 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Sticky Top row with company logo and action icons */}
          <div
            className="flex justify-between items-center py-3 px-4 mb-3"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#FFFFFF",
              zIndex: 10,
              borderBottom: "1px solid #F1F3F7",
            }}
          >
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              onMouseEnter={() => setIsHoveringCompanyDetails(true)}
              data-company-details="true"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white"
                style={{ border: "1px solid #E1E4ED" }}
              >
                <Image
                  src={`https://logo.clearbit.com/${job.company
                    .toLowerCase()
                    .replace(/\s+/g, "")}.com`}
                  alt={job.company}
                  className="w-full h-full object-contain rounded-lg"
                  width={40}
                  height={40}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#0F2678", display: "none" }}
                >
                  {job.company.charAt(0)}
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#002A79" }}
                >
                  {job.company}
                </div>
                <div className="text-xs" style={{ color: "#6D7586" }}>
                  {job.companyType.split(" · ")[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(job.id);
                }}
                style={{
                  ...buttonStyles,
                  padding: "4px",
                  background: "transparent",
                  boxShadow: "none",
                }}
                className="hover:opacity-70 transition-all"
                title="Dismiss"
              >
                <Image
                  src="/dismiss.svg"
                  alt="Dismiss"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(job.id);
                }}
                style={{
                  ...buttonStyles,
                  background: "transparent",
                  padding: "4px",
                  boxShadow: "none",
                }}
                className="transition-all hover:opacity-70"
                title="Save Job"
              >
                <Image
                  src="/wishlist.svg"
                  alt="Save"
                  width={20}
                  height={20}
                  style={{ opacity: isSaved ? 1 : 0.6 }}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(job.id);
                }}
                disabled={isApplied}
                style={{
                  ...applyButtonStyles,
                  background: isApplied
                    ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
                    : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                  cursor: isApplied ? "not-allowed" : "pointer",
                }}
                className="transition-all hover:opacity-90"
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-base font-bold"
                style={{ color: "#002A79" }}
              >
                {job.title}
              </h3>
              <div className="flex gap-2">
                <div
                  className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1"
                  onMouseLeave={() => setIsHoveringMatchScore(false)}
                  data-match-score="true"
                >
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Match</div>
                    <div className="text-sm font-bold">{job.matchScore}%</div>
                  </div>
                </div>
                <div
                  className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1"
                  onMouseLeave={() => setIsHoveringMatchScore(false)}
                  data-match-score="true"
                >
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Success</div>
                    <div className="text-sm font-bold">
                      {job.predictabilityScore}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p
              className="text-xs mb-2.5 leading-relaxed line-clamp-2"
              style={{ color: "#6D7586" }}
            >
              {job.companyDescription}
            </p>
            <div className="grid grid-cols-1 gap-1 mb-1">
              <div
                className="rounded-lg p-1.5"
                style={{
                  backgroundColor: "#EBF1FF",
                  border: "1px solid #B2CDFF",
                }}
              >
                <h4
                  className="text-xs font-bold mb-1"
                  style={{ color: "#003598" }}
                >
                  Match Breakdown
                </h4>
                <div className="space-y-1">
                  {[
                    {
                      label: "Skills",
                      value: job.skillsMatch,
                      color: "#2370FF",
                    },
                    {
                      label: "Experience",
                      value: job.experienceMatch,
                      color: "#679CFF",
                    },
                  ].map((stat, index) => {
                    const filledBlocks = Math.round(
                      (stat.value / 100) * totalBlocks
                    );

                    return (
                      <div
                        key={stat.label}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className="text-xs font-semibold w-16 flex-shrink-0"
                          style={{ color: "#353E5C" }}
                        >
                          {stat.label}
                        </span>

                        <div className="flex gap-0.5" style={{ width: "50%" }}>
                          {[...Array(totalBlocks)].map((_, blockIndex) => (
                            <div
                              key={blockIndex}
                              className="flex-1 rounded"
                              style={{
                                height: "3px",
                                backgroundColor:
                                  blockIndex < filledBlocks && animated
                                    ? stat.color
                                    : "#E5E7EB",
                                opacity: animated ? 1 : 0.3,
                                transition: "all 300ms",
                                transitionDelay: animated
                                  ? `${300 + index * 60 + blockIndex * 40}ms`
                                  : "0ms",
                                transform: animated
                                  ? "scale(1)"
                                  : "scale(0.85)",
                              }}
                            />
                          ))}
                        </div>

                        <span
                          className="text-xs font-bold w-8 text-right"
                          style={{
                            color: stat.color,
                            opacity: animated ? 1 : 0,
                            transition: "opacity 300ms",
                            transitionDelay: `${300 + index * 60 + 250}ms`,
                          }}
                        >
                          {animated ? `${stat.value}%` : "0%"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="rounded-lg p-1.5"
                style={{
                  backgroundColor: "#F8F9FF",
                  border: "1px solid #E1E4ED",
                }}
              >
                <h4
                  className="text-xs font-bold mb-1"
                  style={{ color: "#003598" }}
                >
                  Success Rate
                </h4>
                <div className="space-y-1">
                  <div className="text-xs" style={{ color: "#6D7586" }}>
                    <span className="font-semibold">
                      Based on similar profiles
                    </span>
                  </div>
                  <div className="flex gap-0.5" style={{ width: "50%" }}>
                    {[...Array(totalBlocks)].map((_, blockIndex) => {
                      const successFilledBlocks = Math.round(
                        (job.predictabilityScore / 100) * totalBlocks
                      );
                      return (
                        <div
                          key={blockIndex}
                          className="flex-1 rounded"
                          style={{
                            height: "3px",
                            backgroundColor:
                              blockIndex < successFilledBlocks && animated
                                ? "#82A5FF"
                                : "#E5E7EB",
                            opacity: animated ? 1 : 0.3,
                            transition: "all 300ms",
                            transitionDelay: animated
                              ? `${600 + blockIndex * 40}ms`
                              : "0ms",
                            transform: animated ? "scale(1)" : "scale(0.85)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="hover-overlay-scroll"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            overflowY: "auto",
            animation: "slideUpBlur 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Sticky Top row with company logo and action icons */}
          <div
            className="flex justify-between items-center py-3 px-4 mb-3"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#FFFFFF",
              zIndex: 10,
              borderBottom: "1px solid #F1F3F7",
            }}
            data-company-details="true"
          >
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              onMouseEnter={() => setIsHoveringCompanyDetails(true)}
              data-company-details="true"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white"
                style={{ border: "1px solid #E1E4ED" }}
              >
                <Image
                  src={`https://logo.clearbit.com/${job.company
                    .toLowerCase()
                    .replace(/\s+/g, "")}.com`}
                  alt={job.company}
                  className="w-full h-full object-contain rounded-lg"
                  width={40}
                  height={40}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#0F2678", display: "none" }}
                >
                  {job.company.charAt(0)}
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#002A79" }}
                >
                  {job.company}
                </div>
                <div className="text-xs" style={{ color: "#6D7586" }}>
                  {job.companyType.split(" · ")[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(job.id);
                }}
                style={{
                  ...buttonStyles,
                  padding: "4px",
                  background: "transparent",
                  boxShadow: "none",
                }}
                className="hover:opacity-70 transition-all"
                title="Dismiss"
              >
                <Image
                  src="/dismiss.svg"
                  alt="Dismiss"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(job.id);
                }}
                style={{
                  ...buttonStyles,
                  background: "transparent",
                  padding: "4px",
                  boxShadow: "none",
                }}
                className="transition-all hover:opacity-70"
                title="Save Job"
              >
                <Image
                  src="/wishlist.svg"
                  alt="Save"
                  width={20}
                  height={20}
                  style={{ opacity: isSaved ? 1 : 0.6 }}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(job.id);
                }}
                disabled={isApplied}
                style={{
                  ...applyButtonStyles,
                  background: isApplied
                    ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
                    : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                  cursor: isApplied ? "not-allowed" : "pointer",
                }}
                className="transition-all hover:opacity-90"
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-2" data-company-details="true">
            <h3
              className="text-base font-bold mb-1.5"
              style={{ color: "#002A79" }}
            >
              {job.title}
            </h3>
            <p
              className="text-xs mb-2.5 leading-relaxed line-clamp-2"
              style={{ color: "#6D7586" }}
            >
              {job.companyDescription}
            </p>

            <div
              className="rounded-lg p-2.5"
              style={{
                backgroundColor: "#F8F9FF",
                border: "1px solid #EBF1FF",
              }}
            >
              <h4
                className="font-bold mb-2 text-xs"
                style={{ color: "#002A79" }}
              >
                Company Links
              </h4>
              <div className="space-y-1.5">
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg transition-all text-xs hover:opacity-80"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Image
                    src="/companywebsite.svg"
                    alt="Website"
                    width={20}
                    height={20}
                  />
                  <span style={{ fontWeight: "600", color: "#353E5C" }}>
                    Company Website
                  </span>
                </a>
                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg transition-all text-xs hover:opacity-80"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Image
                    src="/companylinkedin.svg"
                    alt="Company LinkedIn"
                    width={20}
                    height={20}
                  />
                  <span style={{ fontWeight: "600", color: "#353E5C" }}>
                    Company LinkedIn
                  </span>
                </a>
                <a
                  href={job.hrLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg transition-all text-xs hover:opacity-80"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Image
                    src="/hrlinkedin.svg"
                    alt="HR LinkedIn"
                    width={20}
                    height={20}
                  />
                  <span style={{ fontWeight: "600", color: "#353E5C" }}>
                    HR LinkedIn
                  </span>
                </a>
              </div>
            </div>

            <div
              className="rounded-lg p-2.5"
              style={{
                backgroundColor: "#EBF1FF",
                border: "1px solid #B2CDFF",
              }}
            >
              <h4
                className="font-bold mb-2 text-xs"
                style={{ color: "#003598" }}
              >
                Company Insights
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EBF1FF",
                  }}
                >
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#6D7586" }}
                  >
                    Team
                  </div>
                  <div
                    className="font-bold text-xs"
                    style={{ color: "#353E5C" }}
                  >
                    {job.teamSize}
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EBF1FF",
                  }}
                >
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#6D7586" }}
                  >
                    Founded
                  </div>
                  <div
                    className="font-bold text-xs"
                    style={{ color: "#353E5C" }}
                  >
                    {job.foundedYear}
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EBF1FF",
                  }}
                >
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#6D7586" }}
                  >
                    Industry
                  </div>
                  <div
                    className="font-bold text-xs"
                    style={{ color: "#353E5C" }}
                  >
                    {job.companyType.split(" · ")[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
  const fullText = ` Hey ${userName}, 85+ Matches Across 25 Job Portals!`;
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
        border-radius: 10px;
        border: 2px solid #F8F9FF;
      }
      .hover-overlay-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #2370FF 0%, #1a5acc 100%);
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
        <div
          className="relative py-6 px-8 overflow-hidden flex items-center"
          style={{
            backgroundImage: "url(/header-banner.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100px",
            boxShadow: "0 4px 20px 0 #2370FF66",
            borderRadius: "16px",
          }}
        >
          <div className="relative z-10">
            <h1
              className="text-white font-bold mb-2"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                fontSize: "32px",
                lineHeight: "1.2",
                maxWidth: "800px",
              }}
            >
              {typewriterText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h1>
          </div>
        </div>

        <div
          className="bg-white px-8 py-5 border-b"
          style={{ borderColor: "#E1E4ED", backgroundColor: "#FFFFFF" }}
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
                          background: "#073DA3",
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
              <label className="text-sm font-semibold text-gray-700">
                Sort by:
              </label>
              <div
                style={{ position: "relative", minWidth: "160px" }}
                data-dropdown-container
              >
                <div
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full text-sm font-medium text-gray-700 cursor-pointer focus:outline-none flex items-center justify-between"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #F0F4FA",
                    background: "#FFF",
                    boxShadow:
                      "0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)",
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
                            sortBy === option.value ? "#2370FF" : "#374151",
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

        <div className="px-8 py-6" style={{ backgroundColor: "transparent" }}>
          {filteredJobs.length === 0 ? (
            <div
              className="text-center py-16 rounded-xl shadow-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1F3F7",
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <EnhancedJobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onSave={handleSaveJob}
                  onBlock={handleBlock}
                  isApplied={appliedJobs.has(job.id)}
                  isSaved={savedJobs.has(job.id)}
                  router={router}
                />
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
