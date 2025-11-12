"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  createContext,
  useContext,
  cloneElement,
} from "react";
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
} from "@/services/jobService";
import { handleApiError, logError } from "@/utils/errorHandler";
import Image from "next/image";

/* ================================
   Minimal, dependency-free Tooltip
   ================================= */
const TooltipCtx = createContext(null);
function TooltipProvider({ children }) {
  return children;
}
function Tooltip({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <TooltipCtx.Provider value={{ open, setOpen }}>
      <span style={{ position: "relative", display: "inline-flex" }}>
        {children}
      </span>
    </TooltipCtx.Provider>
  );
}
function TooltipTrigger({ asChild = false, children }) {
  const ctx = useContext(TooltipCtx);
  if (!ctx) return children;
  const triggerProps = {
    onMouseEnter: (e) => {
      children?.props?.onMouseEnter?.(e);
      ctx.setOpen(true);
    },
    onMouseLeave: (e) => {
      children?.props?.onMouseLeave?.(e);
      ctx.setOpen(false);
    },
    onFocus: (e) => {
      children?.props?.onFocus?.(e);
      ctx.setOpen(true);
    },
    onBlur: (e) => {
      children?.props?.onBlur?.(e);
      ctx.setOpen(false);
    },
    "aria-expanded": ctx.open ? "true" : "false",
  };
  if (asChild && children && typeof children === "object") {
    return cloneElement(children, triggerProps);
  }
  return (
    <span tabIndex={0} {...triggerProps} style={{ display: "inline-flex" }}>
      {children}
    </span>
  );
}
function TooltipContent({ children, side = "top", align = "center" }) {
  const ctx = useContext(TooltipCtx);
  if (!ctx || !ctx.open) return null;
  const style = {
    position: "absolute",
    zIndex: 9999,
    pointerEvents: "none",
    background: "white",
    borderRadius: 10,
    border: "1px solid #E5E9F2",
    boxShadow: "0 8px 24px rgba(0,20,40,0.08)",
    padding: 12,
    minWidth: 200,
    maxWidth: 300,
  };
  const s = { ...style };
  if (side === "top") s.bottom = "calc(100% + 8px)";
  if (side === "bottom") s.top = "calc(100% + 8px)";
  if (side === "left") s.right = "calc(100% + 8px)";
  if (side === "right") s.left = "calc(100% + 8px)";
  if (side === "top" || side === "bottom") {
    if (align === "start") s.left = 0;
    else if (align === "end") s.right = 0;
    else {
      s.left = "50%";
      s.transform = "translateX(-50%)";
    }
  } else {
    if (align === "start") s.top = 0;
    else if (align === "end") s.bottom = 0;
    else {
      s.top = "50%";
      s.transform = "translateY(-50%)";
    }
  }
  return <div style={s}>{children}</div>;
}

/* ================================
   Reusable tooltip card + icon
   ================================= */
function TooltipCard({ title, body }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          color: "#0F172A",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: "#475569" }}>
        {body}
      </div>
    </div>
  );
}
function InfoIconTrigger() {
  return (
    <span
      style={{
        cursor: "help",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: 6,
        background: "#F4F7FF",
        border: "1px solid #E5E9F2",
      }}
      tabIndex={0}
      aria-label="More info"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </span>
  );
}

/* ================================
   Demo jobs (same as yours)
   ================================= */
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
    salary: "25-35 LPA",
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
    salary: "18-28 LPA",
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
    salary: "15-25 LPA",
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
    salary: "20-30 LPA",
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
    salary: "12-18 LPA",
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
    salary: "12-18 LPA",
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

/* ================================
   Helpers
   ================================= */
function parsePostedHours(posted) {
  if (!posted) return 0;
  const s = posted.toLowerCase();
  const hrMatch = s.match(/(\d+)\s*hour/);
  if (hrMatch) return Math.min(24, parseInt(hrMatch[1], 10));
  const dayMatch = s.match(/(\d+)\s*day/);
  if (dayMatch) return Math.min(24, parseInt(dayMatch[1], 10) * 24);
  const wkMatch = s.match(/(\d+)\s*week/);
  if (wkMatch) return 24;
  return 0;
}
function CircularPostedBadge({ posted }) {
  const hours = parsePostedHours(posted);
  const pct = Math.max(0, Math.min(100, (hours / 24) * 100));
  const ring = `conic-gradient(#3B82F6 ${pct}%, #E6ECF7 ${pct}% 100%)`;
  return (
    <div
      title={posted}
      aria-label={`Posted ${posted}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: ring,
          display: "grid",
          placeItems: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "inset 0 0 0 1px #E5E9F2",
          }}
        />
      </div>
      <span
        style={{ fontSize: 12, fontWeight: 700, color: "#64748B", lineHeight: 1 }}
      >
        {Math.min(hours, 24)}h
      </span>
    </div>
  );
}

/** ---------- Salary baseline + “Above market” tag logic ---------- **/
function parseSalaryLPA(salaryStr) {
  if (!salaryStr) return { min: 0, max: 0, midpoint: 0 };
  const nums = salaryStr
    .replace(/[^0-9\- ]/g, "")
    .split("-")
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !Number.isNaN(n));
  const min = nums[0] ?? 0;
  const max = nums[1] ?? nums[0] ?? 0;
  return { min, max, midpoint: (min + max) / 2 };
}
function marketBaselineMax(job) {
  const level = (job?.level || "").toLowerCase();
  if (level.includes("senior")) return 30;
  if (level.includes("mid")) return 25;
  if (level.includes("entry") || level.includes("junior") || level.includes("intern"))
    return 15;
  return 22;
}
function salaryMarketPosition(job) {
  const { max, midpoint } = parseSalaryLPA(job?.salary);
  const baselineMax = marketBaselineMax(job);
  if (!max) return { position: "unknown", reason: "" };
  const above = max >= baselineMax * 1.05 || midpoint >= baselineMax * 1.02;
  if (above) {
    return {
      position: "above",
      reason: `Range exceeds typical top of ~₹${baselineMax} LPA for ${
        job?.level?.split(",")[0] || "this level"
      }.`,
    };
  }
  const below = max <= baselineMax * 0.9;
  if (below) {
    return {
      position: "below",
      reason: `Range is below usual top of ~₹${baselineMax} LPA.`,
    };
  }
  return { position: "at", reason: `Roughly in line with ~₹${baselineMax} LPA.` };
}

/* ================================
   Enhanced Job Card
   ================================= */
const EnhancedJobCard = ({
  job,
  onApply,
  onSave,
  onBlock,
  isApplied,
  isSaved,
  router,
}) => {
  const getCompanyLogoUrl = (job) => {
    const directCandidates = [
      job?.company_logo_url,
      job?.companyLogo,
      job?.logoUrl,
      job?.logo,
    ];
    for (const c of directCandidates) if (c && typeof c === "string") return c;
    try {
      if (job?.companyWebsite) {
        const hostname = new URL(job.companyWebsite).hostname;
        if (hostname) return `https://logo.clearbit.com/${hostname}`;
      }
    } catch {}
    try {
      if (job?.company_website) {
        const hostname = new URL(job.company_website).hostname;
        if (hostname) return `https://logo.clearbit.com/${hostname}`;
      }
    } catch {}
    return null;
  };

  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  const [showDetails, setShowDetails] = useState(false);
  const [showApplyOverlay, setShowApplyOverlay] = useState(false);
  const [hasApplied, setHasApplied] = useState(isApplied);

  const containerRef = useRef(null);
  const summaryRef = useRef(null);
  const detailsRef = useRef(null);
  const topLineRef = useRef(null);

  useEffect(() => setIsBookmarked(isSaved), [isSaved]);
  useEffect(() => setHasApplied(isApplied), [isApplied]);
  useEffect(() => {
    const appliedStatus = localStorage.getItem(`job_applied_${job.id}`);
    if (appliedStatus === "true" && !isApplied) setHasApplied(true);
  }, [job.id, isApplied]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked((v) => !v);
    onSave(job.id);
  };
  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowDetails(true);
  };
  const handleBackClick = (e) => {
    e.stopPropagation();
    setShowDetails(false);
  };
  const handleApplyClick = (e, applyUrl) => {
    e.stopPropagation();
    if (applyUrl) window.open(applyUrl, "_blank");
    setShowApplyOverlay(true);
  };
  const handleConfirmApplied = () => {
    setHasApplied(true);
    setShowApplyOverlay(false);
    localStorage.setItem(`job_applied_${job.id}`, "true");
    onApply(job.id);
  };
  const handleDenyApplied = () => setShowApplyOverlay(false);

  const market = salaryMarketPosition(job);
  const shortDesc =
    job.shortDescription || job.description || job.companyDescription || "";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "550px",
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 20, 40, 0.08)",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "540px",
        maxHeight: "540px",
        height: "540px",
        fontFamily: "Inter, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 20, 40, 0.12)";
        if (topLineRef.current) topLineRef.current.style.width = "100%";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
        if (topLineRef.current) topLineRef.current.style.width = "0";
      }}
    >
      {/* Top animated line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          ref={topLineRef}
          style={{
            width: 0,
            height: "100%",
            background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
            transition: "width 300ms ease",
          }}
        />
      </div>

      {/* SUMMARY VIEW */}
      <div
        ref={summaryRef}
        style={{
          position: showDetails ? "absolute" : "relative",
          inset: 0,
          opacity: showDetails ? 0 : 1,
          transform: `translateY(${showDetails ? 8 : 0}px)`,
          transition: "opacity 280ms ease, transform 280ms ease",
          pointerEvents: showDetails ? "none" : "auto",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #e6f2ff 0%, rgba(0, 86, 179, 0.05) 100%)",
              opacity: 0.5,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              paddingRight: "100px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "10px",
                  padding: "2px",
                  background:
                    "linear-gradient(45deg, #2370FF, #4d8dff, #6ba1ff, #2370FF)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  animation: "borderRotate 3s linear infinite",
                }}
              />
              {(() => {
                const logoUrl = getCompanyLogoUrl(job);
                if (logoUrl) {
                  return (
                    <Image
                      src={logoUrl}
                      alt={`${job.company} logo`}
                      width={44}
                      height={44}
                      style={{
                        objectFit: "contain",
                        borderRadius: "10px",
                        background: "#ffffff",
                        boxShadow: "0 4px 20px rgba(0, 86, 179, 0.10)",
                      }}
                    />
                  );
                }
                return (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background:
                        "linear-gradient(135deg, #0056b3, #003d82)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      color: "white",
                      position: "relative",
                      animation: "logoFloat 3s infinite ease-in-out",
                      boxShadow: "0 4px 20px rgba(0, 86, 179, 0.25)",
                      zIndex: 1,
                    }}
                  >
                    {job.company.charAt(0)}
                  </div>
                );
              })()}
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 5,
                }}
              >
                {job.title}
              </h3>
              <p
                style={{
                  fontSize: "clamp(12px, 3vw, 14px)",
                  fontWeight: 600,
                  color: "rgb(0, 42, 121)",
                  marginBottom: 6,
                }}
              >
                {job.company}
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                <span
                  style={{
                    padding: "2px 7px",
                    background: "#2A85FF",
                    color: "#FFFFFF",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {job.level?.split(",")[0] || "Senior"}
                </span>
                <span
                  style={{
                    padding: "2px 7px",
                    background: "#f8f9fa",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6477B4",
                  }}
                >
                  {job.type}
                </span>
                <span
                  style={{
                    padding: "2px 7px",
                    background: "#f8f9fa",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6477B4",
                  }}
                >
                  {job.remote ? "Remote" : "On-site"}
                </span>
              </div>

              {/* Job description - 2-3 lines without ellipsis */}
              {shortDesc && (
                <div
                  title={shortDesc}
                  style={{
                    fontSize: 13,
                    color: "#334155",
                    lineHeight: 1.5,
                    maxHeight: "4.5em",
                    overflow: "hidden",
                    marginTop: 8,
                    marginLeft: 0,
                  }}
                >
                  {shortDesc.length > 150 ? shortDesc.substring(0, 150).trim() : shortDesc}
                </div>
              )}
            </div>
          </div>

          {/* right action area */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CircularPostedBadge posted={job.posted} />
              <button
                onClick={handleBookmarkClick}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Save"
              >
                <Image src="/wishlist.svg" alt="Save" width={24} height={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(job.id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Dismiss"
              >
                <Image src="/dismiss.svg" alt="Dismiss" width={24} height={24} />
              </button>
            </div>

            {/* Match Score Card */}
            <div
              title="Overall profile match score"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1.5px solid #6B9EFF",
                background: "#FFFFFF",
                minWidth: "85px",
                boxShadow: "0 2px 6px rgba(107, 158, 255, 0.12)",
              }}
            >
              {/* Match Score Label */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#6B7FD7",
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Match Score
              </div>

              {/* Percentage */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#003D82",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {Math.round(job.matchScore || 0)}%
              </div>

              {/* Graph SVG */}
              <Image
                src="/Graph.svg"
                alt="Match trend"
                width={60}
                height={18}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>

        {/* Meta Grid */}
        <div style={{ padding: "12px 16px" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Skills */}
            <div
              style={{
                background: "#f0f5ff",
                border: "1px solid #e5e9f2",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Skills
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIconTrigger />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <TooltipCard
                      title="Skills Match"
                      body="Measures how well your skills align with the job requirements."
                    />
                  </TooltipContent>
                </Tooltip>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "rgba(35,112,255,0.1)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${job.skillsMatch || job.matchScore}%`,
                      background: "#74D184",
                      borderRadius: 6,
                      transition:
                        "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0F172A",
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {job.skillsMatch || job.matchScore}%
                </span>
              </div>
            </div>

            {/* Experience */}
            <div
              style={{
                background: "#f0f5ff",
                border: "1px solid #e5e9f2",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Experience
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIconTrigger />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <TooltipCard
                      title="Experience Match"
                      body="Compares your years/level of experience to the role expectations."
                    />
                  </TooltipContent>
                </Tooltip>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "rgba(35,112,255,0.1)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${job.experienceMatch || 85}%`,
                      background: "#74D184",
                      borderRadius: 6,
                      transition:
                        "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0F172A",
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {job.experienceMatch || 85}%
                </span>
              </div>
            </div>

            {/* Applicants */}
            <div
              style={{
                background: "#f0f5ff",
                border: "1px solid #e5e9f2",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Applicants
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIconTrigger />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <TooltipCard
                      title="Applicants"
                      body="Total candidates who have applied so far."
                    />
                  </TooltipContent>
                </Tooltip>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", position: "relative" }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      background:
                        "linear-gradient(135deg,#2370FF,#4d8dff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                      zIndex: 3,
                    }}
                  >
                    A
                  </div>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      background:
                        "linear-gradient(135deg,#10b981,#34d399)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                      marginLeft: -8,
                      zIndex: 2,
                    }}
                  >
                    B
                  </div>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      background:
                        "linear-gradient(135deg,#f59e0b,#fbbf24)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                      marginLeft: -8,
                      zIndex: 1,
                    }}
                  >
                    +
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  {job.applicants}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location / ETA / Route / Salary */}
        <div
          style={{
            padding: "16px 16px",
            background: "#fbfcff",
            borderTop: "1px solid #e9eef8",
            borderBottom: "1px solid #e9eef8",
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ alignItems: "center" }}
          >
            {/* Location Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(245,158,11,0.2)",
                  border: "1px solid #FDE68A",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0B1B4A", marginBottom: 6 }}>
                  {job.location}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    ~2h
                  </span>
                  <span style={{ color: "#CBD5E1", fontSize: 11 }}>•</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#2563EB",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1D4ED8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#2563EB"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Route
                  </a>
                </div>
              </div>
            </div>

            {/* Salary Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-start" }} className="md:justify-end">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                }}
              >
                <Image src="/tabler_coin-rupee.svg" alt="Rupee" width={24} height={24} />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#047857", letterSpacing: "-0.02em" }}>
                    {job.salary}
                  </span>
                  {market.position === "above" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            padding: "4px 8px",
                            borderRadius: 999,
                            background: "#D1FAE5",
                            border: "1px solid #6EE7B7",
                            color: "#047857",
                            fontSize: 9,
                            fontWeight: 700,
                            lineHeight: 1,
                            cursor: "help",
                          }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          Above market
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end">
                        <TooltipCard title="Above market rate" body={market.reason} />
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>
                  per annum
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          style={{
            padding: "14px 16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          <button
            className="w-full transition-all hover:opacity-90"
            onClick={(e) => {
              if (!hasApplied)
                handleApplyClick(
                  e,
                  job.applyUrl || job.companyWebsite || job.company_website
                );
            }}
            disabled={hasApplied}
            style={{
              display: "inline-flex",
              width: "100%",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              border: hasApplied
                ? "1px solid rgba(16,185,129,0.30)"
                : "1px solid rgba(35,112,255,0.30)",
              background: hasApplied
                ? "linear-gradient(180deg,#10B981 0%, #059669 100%)"
                : "linear-gradient(180deg,#679CFF 0%, #2370FF 100%)",
              boxShadow:
                "0 2px 4px 0 rgba(77,145,225,0.10), 0 1px 0.3px 0 rgba(255,255,255,0.25) inset, 0 -1px 0.3px 0 rgba(0,19,88,0.25) inset",
              color: "#FFFFFF",
              textAlign: "center",
              textShadow:
                "0 0.5px 1.5px rgba(0,19,88,0.30), 0 2px 5px rgba(0,19,88,0.10)",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "125%",
              cursor: hasApplied ? "not-allowed" : "pointer",
              opacity: hasApplied ? 0.8 : 1,
            }}
          >
            {hasApplied ? "Applied ✓" : "Apply Now"}
          </button>

          <button
            className="w-full transition-all hover:opacity-90"
            onClick={handleDetailsClick}
            style={{
              display: "inline-flex",
              width: "100%",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              background: "linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)",
              borderTop: "1px solid #D5E4FF",
              boxShadow: "0 2px 4px rgba(0, 20, 40, 0.06)",
              color: "#0F172A",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "125%",
              cursor: "pointer",
            }}
          >
            Details
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            background: "#f8f9fa",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: 10,
            color: "#6477B4",
          }}
        >
          <div>
            Source:{" "}
            <span style={{ color: "rgb(0, 42, 121)", fontWeight: 600 }}>
              LinkedIn
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS VIEW */}
      <div
        ref={detailsRef}
        style={{
          position: showDetails ? "relative" : "absolute",
          inset: 0,
          opacity: showDetails ? 1 : 0,
          transform: `translateY(${showDetails ? 0 : -8}px)`,
          transition: "opacity 280ms ease, transform 280ms ease",
          pointerEvents: showDetails ? "auto" : "none",
          zIndex: 3,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                flexShrink: 0,
              }}
            >
              {(() => {
                const logoUrl = getCompanyLogoUrl(job);
                if (logoUrl) {
                  return (
                    <Image
                      src={logoUrl}
                      alt={`${job.company} logo`}
                      width={48}
                      height={48}
                      style={{
                        objectFit: "contain",
                        borderRadius: "10px",
                        background: "#ffffff",
                        boxShadow: "0 4px 20px rgba(0, 86, 179, 0.10)",
                      }}
                    />
                  );
                }
                return (
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, #0056b3, #003d82)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(0, 86, 179, 0.25)",
                    }}
                  >
                    {job.company.charAt(0)}
                  </div>
                );
              })()}
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#6477B4",
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                {job.title}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                {job.company}
              </h3>
            </div>
          </div>
        </div>

        {/* Detailed Job Description - Scrollable */}
        <div style={{ marginBottom: 12, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#2c3e50",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Job Description
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.7,
              flex: 1,
              overflow: "auto",
              padding: 16,
              background: "#f8f9fa",
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
            className="hover-overlay-scroll"
          >
            {job.description || `About the Role:

We are seeking an exceptional ${job.title} to join our dynamic team at ${job.company}. This is an exciting opportunity to work with cutting-edge technologies and contribute to products that impact millions of users. You'll be working in ${job.location} with a talented team of engineers, designers, and product managers.

Key Responsibilities:

• Design, develop, and maintain scalable web applications using modern frameworks and technologies
• Write clean, efficient, and well-documented code following industry best practices
• Collaborate with cross-functional teams including product, design, and backend engineers
• Participate in code reviews and provide constructive feedback to team members
• Debug and resolve complex technical issues in production environments
• Optimize application performance and ensure high-quality user experience
• Stay current with emerging technologies and industry trends
• Contribute to technical documentation and knowledge sharing
• Participate in agile ceremonies including sprint planning, standups, and retrospectives

Required Qualifications:

• ${job.level || 'Relevant professional experience'} in software development
• Strong proficiency in JavaScript, React, and modern web technologies
• Experience with RESTful APIs and integrating backend services
• Solid understanding of HTML5, CSS3, and responsive design principles
• Knowledge of state management libraries (Redux, Context API, etc.)
• Experience with version control systems (Git)
• Strong problem-solving and debugging skills
• Excellent communication and teamwork abilities

Preferred Qualifications:

• Experience with Next.js, TypeScript, or similar modern frameworks
• Understanding of CI/CD pipelines and deployment processes
• Knowledge of testing frameworks (Jest, React Testing Library)
• Experience with performance optimization and SEO
• Familiarity with cloud platforms (AWS, GCP, or Azure)
• Contributions to open-source projects

What We Offer:

• Competitive salary package: ${job.salary}
• Comprehensive health insurance and wellness benefits
• Flexible work arrangements and remote work options
• Learning and development opportunities
• Collaborative and innovative work environment
• Career growth and advancement opportunities
• State-of-the-art office facilities and equipment

${job.companyDescription || `About ${job.company}:\n\n${job.company} is a leading technology company dedicated to innovation and excellence. Join us to be part of a team that's shaping the future of technology.`}`}
          </div>
        </div>

        {/* Company Links Section - Sticky at bottom */}
        <div style={{ marginBottom: 8, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#2c3e50",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Company Links
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Company Website */}
            {(job.companyWebsite || job.company_website) && (
              <a
                href={job.companyWebsite || job.company_website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "#f8f9fa",
                  borderRadius: 6,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e9ecef",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e9ecef";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0056b3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6477B4", fontWeight: 600, marginBottom: 1 }}>
                    Company Website
                  </div>
                  <div style={{ fontSize: 11, color: "#0056b3", fontWeight: 500 }}>
                    Visit Website →
                  </div>
                </div>
              </a>
            )}

            {/* LinkedIn Company Page */}
            {job.linkedinUrl && (
              <a
                href={job.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "#f8f9fa",
                  borderRadius: 6,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e9ecef",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e9ecef";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#0077B5"
                  strokeWidth="0"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6477B4", fontWeight: 600, marginBottom: 1 }}>
                    Company LinkedIn
                  </div>
                  <div style={{ fontSize: 11, color: "#0077B5", fontWeight: 500 }}>
                    View Profile →
                  </div>
                </div>
              </a>
            )}

            {/* HR LinkedIn */}
            {job.hrLinkedinUrl && (
              <a
                href={job.hrLinkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "#f8f9fa",
                  borderRadius: 6,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e9ecef",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e9ecef";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#0077B5"
                  strokeWidth="0"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#6477B4", fontWeight: 600, marginBottom: 1 }}>
                    HR Contact
                  </div>
                  <div style={{ fontSize: 11, color: "#0077B5", fontWeight: 500 }}>
                    Connect on LinkedIn →
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>

        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e9ecef", flexShrink: 0 }}>
          <button
            onClick={handleBackClick}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "#ffffff",
              color: "#0056b3",
              border: "2px solid #0056b3",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            ← Back to Summary
          </button>
        </div>
      </div>

      {/* Apply confirmation overlay */}
      {showApplyOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "fadeIn 0.3s ease-out",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              padding: "32px 24px",
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              minWidth: 300,
              animation: "scaleIn 0.3s ease-out",
            }}
          >
            <Image
              src="/V1.svg"
              alt="Application Icon"
              width={64}
              height={64}
              style={{ animation: "scaleIn 0.3s ease-out" }}
            />
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                textAlign: "center",
                margin: 0,
                color: "#353E5C",
                fontFamily: "Inter, sans-serif",
                animation: "fadeIn 0.4s ease-out",
              }}
            >
              Have you applied?
            </h3>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                textAlign: "center",
                margin: 0,
                color: "#6B7280",
                fontFamily: "Inter, sans-serif",
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              Let us know if you&apos;ve submitted your application
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                width: "100%",
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              <button
                onClick={handleDenyApplied}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  padding: "12px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  cursor: "pointer",
                }}
              >
                No
              </button>
              <button
                onClick={handleConfirmApplied}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  padding: "12px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  border: "1px solid rgba(35,112,255,0.30)",
                  background:
                    "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                  boxShadow:
                    "0 2px 4px 0 rgba(77,145,225,0.10), 0 1px 0.3px 0 rgba(255,255,255,0.25) inset, 0 -1px 0.3px 0 rgba(0,19,88,0.25) inset",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes borderRotate {
          0% { opacity: 0; transform: rotate(0deg); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/* ================================
   Job Search Page
   ================================= */
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
      * { font-family: 'Inter', sans-serif !important; }
      body { font-family: 'Inter', sans-serif !important; }
      button, input, select, textarea { font-family: 'Inter', sans-serif !important; }
      @keyframes cardEntryStagger { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .hover-overlay-scroll::-webkit-scrollbar { width: 8px; }
      .hover-overlay-scroll::-webkit-scrollbar-track { background: #F8F9FF; border-radius: 10px; margin: 8px 0; }
      .hover-overlay-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #679CFF 0%, #2370FF 100%); borderRadius: 10px; border: 2px solid #F8F9FF; }
      .hover-overlay-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #2370FF 0%, #1a5acc 100%); }
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
      return () =>
        document.removeEventListener("click", handleClickOutside);
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
      filteredList.sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      );
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
    if (job && job.companyWebsite) window.open(job.companyWebsite, "_blank");

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
      if (isSaved) await removeFromWishlist(jobId);
      else await addToWishlist(jobId);

      setSavedJobs((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) next.delete(jobId);
        else next.add(jobId);
        return next;
      });
    } catch (err) {
      logError("JobSearchPage - Save", err);
      setSavedJobs((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) next.delete(jobId);
        else next.add(jobId);
        return next;
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
      <TooltipProvider>
        <div
          style={{ minHeight: "100vh", backgroundColor: "#F8F9FF", width: "100%" }}
        >
          {/* Header Banner */}
          <div
            style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 16px", width: "100%" }}
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
                marginBottom: "24px",
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

          {/* Filters */}
          <div
            className="bg-white border-b top-0 z-30"
            style={{
              borderColor: "#E1E4ED",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(35, 112, 255, 0.06)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                maxWidth: "1600px",
                margin: "0 auto",
                padding: "20px 24px",
                width: "100%",
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
                              fontSize: "14px",
                              fontWeight: 500,
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
                              color: "#474FA3",
                              fontSize: "14px",
                              fontWeight: 500,
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
                  <label className="text-sm font-semibold" style={{ color: "#000E41" }}>
                    Sort by:
                  </label>
                  <div style={{ position: "relative", minWidth: "160px" }} data-dropdown-container>
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
                        {[
                          { value: "match", label: "Match Score" },
                          { value: "recent", label: "Most Recent" },
                          { value: "salary", label: "Salary" },
                        ].find((opt) => opt.value === sortBy)?.label}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 20 20"
                        style={{
                          transform: showSortDropdown ? "rotate(180deg)" : "rotate(0deg)",
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
                          right: 0,
                          zIndex: 200,
                        }}
                      >
                        {[
                          { value: "match", label: "Match Score" },
                          { value: "recent", label: "Most Recent" },
                          { value: "salary", label: "Salary" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortDropdown(false);
                            }}
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

          {/* Job Cards */}
          <div
            className="py-[24px] px-[16px] md:py-[48px] md:px-[24px]"
            style={{
              backgroundColor: "transparent",
              maxWidth: "1400px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {filteredJobs.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F1F3F7",
                  maxWidth: "600px",
                  margin: "0 auto",
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
                  className="hover:opacity-90 transition-all"
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
                    fontSize: "18px",
                    fontWeight: 500,
                    letterSpacing: "-0.36px",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-start max-w-[1200px] mx-auto">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="job-card-wrapper"
                    style={{
                      animation: `cardEntryStagger 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                        index * 0.08
                      }s backwards`,
                      display: "flex",
                      justifyContent: "center",
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
                className="hover:text-gray-200 transition-all"
                style={{
                  display: "inline-flex",
                  padding: "4px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};

export default JobSearchPage;
