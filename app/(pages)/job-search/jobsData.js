 
 "use client";

 [ {
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
  const getCompanyLogoUrl = (job) => {
    const directCandidates = [
      job?.company_logo_url,
      job?.companyLogo,
      job?.logoUrl,
      job?.logo,
    ];
    for (const candidate of directCandidates) {
      if (candidate && typeof candidate === "string") return candidate;
    }
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
  const [lockedHeight, setLockedHeight] = useState(null);
  const [showApplyOverlay, setShowApplyOverlay] = useState(false);
  const [hasApplied, setHasApplied] = useState(isApplied);
  const containerRef = useRef(null);
  const summaryRef = useRef(null);
  const detailsRef = useRef(null);
  const topLineRef = useRef(null);

  useEffect(() => {
    setIsBookmarked(isSaved);
  }, [isSaved]);

  useEffect(() => {
    setHasApplied(isApplied);
  }, [isApplied]);

  // Check if job was previously marked as applied
  useEffect(() => {
    const appliedStatus = localStorage.getItem(`job_applied_${job.id}`);
    if (appliedStatus === 'true' && !isApplied) {
      setHasApplied(true);
    }
  }, [job.id, isApplied]);

  // Measure both views and lock to max height
  useEffect(() => {
    if (!containerRef.current || !summaryRef.current || !detailsRef.current)
      return;

    const measureHeights = () => {
      const prevSummaryVis = summaryRef.current.style.visibility;
      const prevDetailsVis = detailsRef.current.style.visibility;
      const prevSummaryPos = summaryRef.current.style.position;
      const prevDetailsPos = detailsRef.current.style.position;

      summaryRef.current.style.visibility = "hidden";
      detailsRef.current.style.visibility = "hidden";
      summaryRef.current.style.position = "static";
      detailsRef.current.style.position = "static";

      const summaryH = summaryRef.current.offsetHeight;
      const detailsH = detailsRef.current.offsetHeight;
      const maxH = Math.max(summaryH, detailsH);

      summaryRef.current.style.visibility = prevSummaryVis;
      detailsRef.current.style.visibility = prevDetailsVis;
      summaryRef.current.style.position = prevSummaryPos;
      detailsRef.current.style.position = prevDetailsPos;

      setLockedHeight(maxH);
    };

    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, []);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
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
    // Open the external URL
    if (applyUrl) {
      window.open(applyUrl, '_blank');
    }
    // Show the overlay immediately
    setShowApplyOverlay(true);
  };

  const handleConfirmApplied = () => {
    // User confirmed they applied
    setHasApplied(true);
    setShowApplyOverlay(false);
    // Persist to localStorage
    localStorage.setItem(`job_applied_${job.id}`, 'true');
    // Call the parent's onApply to update the main state
    onApply(job.id);
  };

  const handleDenyApplied = () => {
    // User didn't apply, just close the overlay
    setShowApplyOverlay(false);
  };

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
        height: "auto",
        fontFamily: "Inter, sans-serif",
      }}
      className="job-card"
      onMouseEnter={() => {
        if (topLineRef.current) topLineRef.current.style.width = "100%";
      }}
      onMouseLeave={() => {
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
        {/* Header Section */}
        <div
          style={{
            padding: "16px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "52px",
                height: "52px",
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
                      background: "linear-gradient(135deg, #0056b3, #003d82)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
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
              <p
                style={{
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                  color: "rgb(0, 42, 121)",
                  marginBottom: "5px",
                  fontWeight: 700,
                }}
              >
                {job.company}
              </p>
              <h3
                style={{
                  fontSize: "clamp(12px, 3vw, 16px)",
                  fontWeight: 600,
                  color: "#6477B4",
                  marginBottom: "3px",
                }}
              >
                {job.title}
              </h3>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "2px 7px",
                    background: "#2A85FF",
                    color: "#FFFFFF",
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
                    color: "#6477B4",
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
                    color: "#6477B4",
                  }}
                >
                  {job.remote ? "Remote" : "On-site"}
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "20px",
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick(e);
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
        </div>

        {/* Meta Grid - Enhanced Stats */}
        <div style={{ padding: "12px 20px" }}>
          <div
            style={{
              display: "grid",
              gap: "12px",
              marginBottom: "12px",
            }}
            className="grid-cols-1 md:grid-cols-3 "
          >
            {/* Skills Match */}
            <div
              style={{
                background: "#f0f5ff",
                border: "1px solid #e5e9f2",
                borderRadius: "12px",
                padding: "12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                }}
              >
                Skills
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "6px",
                    background: "rgba(35, 112, 255, 0.1)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${job.skillsMatch || job.matchScore}%`,
                      background: "#74D184",
                      borderRadius: "6px",
                      position: "relative",
                      boxShadow: "0 0 6px rgba(116, 209, 132, 0.25)",
                      transition:
                        "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0F172A",
                    minWidth: "32px",
                    textAlign: "right",
                  }}
                >
                  {job.skillsMatch || job.matchScore}%
                </span>
              </div>
            </div>

            {/* Experience Match */}
            <div
              style={{
                background: "#f0f5ff",
                border: "1px solid #e5e9f2",
                borderRadius: "12px",
                padding: "12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                }}
              >
                Experience
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "6px",
                    background: "rgba(35, 112, 255, 0.1)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${job.experienceMatch || 85}%`,
                      background: "#74D184",
                      borderRadius: "6px",
                      position: "relative",
                      boxShadow: "0 0 6px rgba(116, 209, 132, 0.25)",
                      transition:
                        "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0F172A",
                    minWidth: "32px",
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
                borderRadius: "12px",
                padding: "12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#0F172A",
                  fontWeight: 600,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: 0.8,
                }}
              >
                Applicants
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div style={{ display: "flex", position: "relative" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                      background: "linear-gradient(135deg, #2370FF, #4d8dff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "white",
                      zIndex: 3,
                    }}
                  >
                    A
                  </div>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                      background: "linear-gradient(135deg, #10b981, #34d399)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "white",
                      marginLeft: "-8px",
                      zIndex: 2,
                    }}
                  >
                    B
                  </div>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "white",
                      marginLeft: "-8px",
                      zIndex: 1,
                    }}
                  >
                    +
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "13px",
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

        {/* Match Score Bar */}
        <div style={{ padding: "0 20px 12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span
              style={{ fontSize: "11px", fontWeight: 600, color: "#6477B4" }}
            >
              Your Profile Match
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "rgb(0, 42, 121)",
              }}
            >
              {job.matchScore}% Match
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "#e9ecef",
              borderRadius: "6px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                borderRadius: "6px",
                width: `${job.matchScore}%`,
                position: "relative",
              }}
            />
          </div>
        </div>

        {/* Location and Salary Row */}
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
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#ffffff",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
              }}
            >
              <Image
                src="/location.svg"
                alt="Location"
                width={20}
                height={20}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgb(0, 42, 121)",
                }}
              >
                {job.location}
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#ffffff",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
              }}
            >
              <Image src="/salary.svg" alt="Salary" width={20} height={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgb(0, 42, 121)",
                }}
              >
                {job.salary}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            padding: "14px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          <button
            className="w-full transition-all hover:opacity-90"
            onClick={(e) => {
              if (!hasApplied) {
                handleApplyClick(e, job.applyUrl || job.companyWebsite || job.company_website);
              }
            }}
            disabled={hasApplied}
            style={{
              display: "inline-flex",
              width: "100%",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              border: hasApplied ? "1px solid rgba(16, 185, 129, 0.30)" : "1px solid rgba(35, 112, 255, 0.30)",
              background: hasApplied ? "linear-gradient(180deg, #10B981 0%, #059669 100%)" : "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
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
              borderRadius: "8px",
              background: "linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)",
              borderTop: "1px solid #D5E4FF",
              boxShadow:
                "2px var(--ShadowPositioningSmall) var(--ShadowBlurSmall) var(--ShadowSpreadExtraSmall) var(--ColorsOverlayColorsDark8)",
              color: "#0F172A",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
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
            padding: "12px 20px",
            background: "#f8f9fa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "10px",
            color: "#6477B4",
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
        }}
      >
        {/* Details Header */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #0056b3, #003d82)",
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
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6477B4",
                  fontWeight: 500,
                  marginBottom: "2px",
                }}
              >
                {job.title}
              </p>
              <h3
                style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}
              >
                {job.company}
              </h3>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: "16px", flex: 1, overflow: "auto" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#2c3e50",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Job Description
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#374151",
              lineHeight: 1.6,
              maxHeight: "200px",
              overflow: "auto",
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
            className="hover-overlay-scroll"
          >
            {job.companyDescription || "No description available"}
          </div>
        </div>

        {/* Links Section */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#2c3e50",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Quick Links
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  background: "#f0f5ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#0056b3",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e5e9f2",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e6f2ff";
                  e.currentTarget.style.borderColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f5ff";
                  e.currentTarget.style.borderColor = "#e5e9f2";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Company Website
              </a>
            )}
            {job.linkedinUrl && (
              <a
                href={job.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  background: "#f0f5ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#0056b3",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e5e9f2",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e6f2ff";
                  e.currentTarget.style.borderColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f5ff";
                  e.currentTarget.style.borderColor = "#e5e9f2";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Company LinkedIn
              </a>
            )}
            {job.hrLinkedinUrl && (
              <a
                href={job.hrLinkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  background: "#f0f5ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#0056b3",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  border: "1px solid #e5e9f2",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e6f2ff";
                  e.currentTarget.style.borderColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f5ff";
                  e.currentTarget.style.borderColor = "#e5e9f2";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                HR LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <button
            onClick={handleBackClick}
            style={{
              width: "100%",
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
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 20, 40, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            ← Back to Summary
          </button>
        </div>
      </div>

      {/* Glass Overlay with Confirmation Dialog */}
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
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              padding: "32px 24px",
              borderRadius: "16px",
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
              src="/V1.svg"
              alt="Application Icon"
              width={64}
              height={64}
              style={{
                animation: "scaleIn 0.3s ease-out",
              }}
            />

            {/* Title */}
            <h3
              style={{
                fontSize: "18px",
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

            {/* Description */}
            <p
              style={{
                fontSize: "14px",
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

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", width: "100%", animation: "fadeIn 0.6s ease-out" }}>
              <button
                onClick={handleDenyApplied}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  padding: "12px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "125%",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#F9FAFB";
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
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "1";
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

// const EnhancedJobCard = ({
//   job,
//   onApply,
//   onSave,
//   onBlock,
//   isApplied,
//   isSaved,
//   router,
// }) => {
//   const [isBookmarked, setIsBookmarked] = useState(isSaved);

//   useEffect(() => {
//     setIsBookmarked(isSaved);
//   }, [isSaved]);

//   const handleBookmarkClick = (e) => {
//     e.stopPropagation();
//     setIsBookmarked(!isBookmarked);
//     onSave(job.id);
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "550px",
//         background: "#ffffff",
//         borderRadius: "16px",
//         overflow: "hidden",
//         boxShadow: "0 4px 12px rgba(0, 20, 40, 0.08)",
//         position: "relative",
//         transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "translateY(-4px)";
//         e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 20, 40, 0.12)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "";
//         e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
//       }}
//     >
//       {/* Top gradient line */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: "2px",
//           background: "linear-gradient(90deg, #0056b3, #28a745, #0056b3)",
//           backgroundSize: "200% 100%",
//         }}
//       />

//       {/* Header Section - Reduced padding */}
//       <div style={{ padding: "16px 20px", position: "relative", overflow: "hidden" }}>
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "linear-gradient(135deg, #e6f2ff 0%, rgba(0, 86, 179, 0.05) 100%)",
//             opacity: 0.5,
//             zIndex: 0,
//           }}
//         />

//         <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "16px" }}>
//           <div
//             style={{
//               position: "relative",
//               width: "52px",
//               height: "52px",
//               flexShrink: 0,
//             }}
//           >
//             {/* Animated rotating border */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: "-2px",
//                 borderRadius: "14px",
//                 padding: "2px",
//                 background: "linear-gradient(45deg, #2370FF, #4d8dff, #6ba1ff, #2370FF)",
//                 WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                 WebkitMaskComposite: "xor",
//                 maskComposite: "exclude",
//                 animation: "borderRotate 3s linear infinite",
//               }}
//             />

//             {/* Company logo */}
//             <div
//               style={{
//                 width: "48px",
//                 height: "48px",
//                 background: "linear-gradient(135deg, #0056b3, #003d82)",
//                 borderRadius: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 color: "white",
//                 position: "relative",
//                 animation: "logoFloat 3s infinite ease-in-out",
//                 boxShadow: "0 4px 20px rgba(0, 86, 179, 0.25)",
//                 zIndex: 1,
//               }}
//             >
//               {job.company.charAt(0)}
//             </div>
//           </div>

//           <div style={{ flex: 1 }}>
//             <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#2c3e50", marginBottom: "3px" }}>
//               {job.company}
//             </h3>
//             <p style={{ fontSize: "13px", color: "#6c757d", marginBottom: "5px" }}>{job.title}</p>
//             <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
//               <span
//                 style={{
//                   padding: "2px 7px",
//                   background: "#28a745",
//                   color: "white",
//                   borderRadius: "4px",
//                   fontSize: "10px",
//                   fontWeight: 600,
//                 }}
//               >
//                 {job.level?.split(",")[0] || "Senior"}
//               </span>
//               <span
//                 style={{
//                   padding: "2px 7px",
//                   background: "#f8f9fa",
//                   borderRadius: "4px",
//                   fontSize: "10px",
//                   fontWeight: 600,
//                   color: "#6c757d",
//                 }}
//               >
//                 {job.type}
//               </span>
//               <span
//                 style={{
//                   padding: "2px 7px",
//                   background: "#f8f9fa",
//                   borderRadius: "4px",
//                   fontSize: "10px",
//                   fontWeight: 600,
//                   color: "#6c757d",
//                 }}
//               >
//                 {job.remote ? "Remote" : "On-site"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Header Actions */}
//         <div style={{ position: "absolute", top: "16px", right: "20px", display: "flex", gap: "18px" }}>
//           <button
//             onClick={handleBookmarkClick}
//             style={{
//               width: "30px",
//               height: "30px",
//               borderRadius: "8px",
//               border: "1px solid #e9ecef",
//               background: isBookmarked ? "#0056b3" : "#ffffff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               transition: "all 0.3s",
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               style={{
//                 stroke: isBookmarked ? "white" : "#6c757d",
//                 fill: isBookmarked ? "white" : "none",
//                 strokeWidth: 2,
//               }}
//             >
//               <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//             {/* Meta Grid - Enhanced Stats */}
//       <div style={{ padding: "12px 20px" }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "10px",
//             marginBottom: "12px"
//           }}
//         >
//           {/* Skills Match */}
//           <div
//             style={{
//               background: "#f0f5ff",
//               border: "1px solid #e5e9f2",
//               borderRadius: "12px",
//               padding: "12px",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div style={{
//               fontSize: "10px",
//               color: "#6b7280",
//               fontWeight: 600,
//               marginBottom: "6px",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               opacity: 0.8
//             }}>
//               Skills
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <div style={{
//                 flex: 1,
//                 height: "6px",
//                 background: "rgba(35, 112, 255, 0.1)",
//                 borderRadius: "6px",
//                 overflow: "hidden",
//                 position: "relative"
//               }}>
//                 <div style={{
//                   height: "100%",
//                   width: `${job.skillsMatch || job.matchScore}%`,
//                   background: (job.skillsMatch || job.matchScore) >= 80
//                     ? "linear-gradient(90deg, #22c55e, #10b981)"
//                     : "linear-gradient(90deg, #f59e0b, #fbbf24)",
//                   borderRadius: "6px",
//                   position: "relative",
//                   boxShadow: (job.skillsMatch || job.matchScore) >= 80
//                     ? "0 0 10px rgba(34, 197, 94, 0.5)"
//                     : "0 0 10px rgba(245, 158, 11, 0.5)",
//                   transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
//                 }} />
//               </div>
//               <span style={{
//                 fontSize: "13px",
//                 fontWeight: 700,
//                 color: "#1a1a1a",
//                 minWidth: "32px",
//                 textAlign: "right"
//               }}>
//                 {job.skillsMatch || job.matchScore}%
//               </span>
//             </div>
//           </div>

//           {/* Experience Match */}
//           <div
//             style={{
//               background: "#f0f5ff",
//               border: "1px solid #e5e9f2",
//               borderRadius: "12px",
//               padding: "12px",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div style={{
//               fontSize: "10px",
//               color: "#6b7280",
//               fontWeight: 600,
//               marginBottom: "6px",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               opacity: 0.8
//             }}>
//               Experience
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <div style={{
//                 flex: 1,
//                 height: "6px",
//                 background: "rgba(35, 112, 255, 0.1)",
//                 borderRadius: "6px",
//                 overflow: "hidden",
//                 position: "relative"
//               }}>
//                 <div style={{
//                   height: "100%",
//                   width: `${job.experienceMatch || 85}%`,
//                   background: (job.experienceMatch || 85) >= 80
//                     ? "linear-gradient(90deg, #22c55e, #10b981)"
//                     : "linear-gradient(90deg, #f59e0b, #fbbf24)",
//                   borderRadius: "6px",
//                   position: "relative",
//                   boxShadow: (job.experienceMatch || 85) >= 80
//                     ? "0 0 10px rgba(34, 197, 94, 0.5)"
//                     : "0 0 10px rgba(245, 158, 11, 0.5)",
//                   transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s"
//                 }} />
//               </div>
//               <span style={{
//                 fontSize: "13px",
//                 fontWeight: 700,
//                 color: "#1a1a1a",
//                 minWidth: "32px",
//                 textAlign: "right"
//               }}>
//                 {job.experienceMatch || 85}%
//               </span>
//             </div>
//           </div>

//           {/* Applicants */}
//           <div
//             style={{
//               background: "#f0f5ff",
//               border: "1px solid #e5e9f2",
//               borderRadius: "12px",
//               padding: "12px",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div style={{
//               fontSize: "10px",
//               color: "#6b7280",
//               fontWeight: 600,
//               marginBottom: "6px",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               opacity: 0.8
//             }}>
//               Applicants
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <div style={{ display: "flex", position: "relative" }}>
//                 {/* Avatar 1 */}
//                 <div style={{
//                   width: "24px",
//                   height: "24px",
//                   borderRadius: "50%",
//                   border: "2px solid #ffffff",
//                   background: "linear-gradient(135deg, #2370FF, #4d8dff)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "9px",
//                   fontWeight: 700,
//                   color: "white",
//                   zIndex: 3
//                 }}>
//                   A
//                 </div>
//                 {/* Avatar 2 */}
//                 <div style={{
//                   width: "24px",
//                   height: "24px",
//                   borderRadius: "50%",
//                   border: "2px solid #ffffff",
//                   background: "linear-gradient(135deg, #10b981, #34d399)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "9px",
//                   fontWeight: 700,
//                   color: "white",
//                   marginLeft: "-8px",
//                   zIndex: 2
//                 }}>
//                   B
//                 </div>
//                 {/* Avatar 3 */}
//                 <div style={{
//                   width: "24px",
//                   height: "24px",
//                   borderRadius: "50%",
//                   border: "2px solid #ffffff",
//                   background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "9px",
//                   fontWeight: 700,
//                   color: "white",
//                   marginLeft: "-8px",
//                   zIndex: 1
//                 }}>
//                   +
//                 </div>
//               </div>
//               <span style={{
//                 fontSize: "13px",
//                 fontWeight: 700,
//                 color: "#1a1a1a"
//               }}>
//                 {job.applicants}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Match Score Bar - Reduced padding */}
//       <div style={{ padding: "0 20px 12px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
//           <span style={{ fontSize: "11px", fontWeight: 600, color: "#6c757d" }}>Your Profile Match</span>
//           <span style={{ fontSize: "11px", fontWeight: 700, color: "#0056b3" }}>{job.matchScore}% Match</span>
//         </div>
//         <div style={{ height: "6px", background: "#e9ecef", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
//           <div
//             style={{
//               height: "100%",
//               background: "linear-gradient(90deg, #0056b3, #28a745)",
//               borderRadius: "6px",
//               width: `${job.matchScore}%`,
//               position: "relative",
//             }}
//           />
//         </div>
//       </div>

//       {/* Location and Salary Row - Reduced padding */}
//       <div
//         style={{
//           padding: "12px 20px",
//           display: "flex",
//           gap: "12px",
//           borderTop: "1px solid #e9ecef",
//           borderBottom: "1px solid #e9ecef",
//           background: "#f8f9fa",
//         }}
//       >
//         <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               borderRadius: "7px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//               boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
//             }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="#0056b3">
//               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
//             </svg>
//           </div>
//           <div style={{ flex: 1 }}>
//             <div
//               style={{
//                 fontSize: "9px",
//                 color: "#adb5bd",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.5px",
//               }}
//             >
//               Location
//             </div>
//             <div style={{ fontSize: "12px", fontWeight: 600, color: "#2c3e50" }}>{job.location}</div>
//           </div>
//         </div>

//         <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               borderRadius: "7px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//               boxShadow: "0 2px 4px rgba(0, 20, 40, 0.04)",
//             }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="#0056b3">
//               <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
//             </svg>
//           </div>
//           <div style={{ flex: 1 }}>
//             <div
//               style={{
//                 fontSize: "9px",
//                 color: "#adb5bd",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.5px",
//               }}
//             >
//               Salary
//             </div>
//             <div style={{ fontSize: "12px", fontWeight: 600, color: "#2c3e50" }}>{job.salary}</div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section - Reduced padding */}
//       <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onApply(job.id);
//           }}
//           disabled={isApplied}
//           style={{
//             padding: "12px",
//             borderRadius: "10px",
//             fontSize: "13px",
//             fontWeight: 600,
//             border: "none",
//             cursor: isApplied ? "not-allowed" : "pointer",
//             background: isApplied ? "#28a745" : "#0056b3",
//             color: "white",
//             transition: "all 0.3s",
//             position: "relative",
//             overflow: "hidden",
//           }}
//           onMouseEnter={(e) => {
//             if (!isApplied) {
//               e.currentTarget.style.background = "#003d82";
//               e.currentTarget.style.transform = "translateY(-2px)";
//               e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 86, 179, 0.3)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!isApplied) {
//               e.currentTarget.style.background = "#0056b3";
//               e.currentTarget.style.transform = "";
//               e.currentTarget.style.boxShadow = "";
//             }
//           }}
//         >
//           {isApplied ? "Applied" : "Apply Now"}
//         </button>

//         <button
//           onClick={() => router.push(`/job-details/${job.id}`)}
//           style={{
//             padding: "12px",
//             borderRadius: "10px",
//             fontSize: "13px",
//             fontWeight: 600,
//             background: "#ffffff",
//             color: "#0056b3",
//             border: "2px solid #0056b3",
//             cursor: "pointer",
//             transition: "all 0.3s",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "#e6f2ff";
//             e.currentTarget.style.transform = "translateY(-2px)";
//             e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 20, 40, 0.08)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "#ffffff";
//             e.currentTarget.style.transform = "";
//             e.currentTarget.style.boxShadow = "";
//           }}
//         >
//           Details
//         </button>
//       </div>

//       {/* Footer - Reduced padding */}
//       <div
//         style={{
//           padding: "12px 20px",
//           background: "#f8f9fa",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           fontSize: "10px",
//           color: "#adb5bd",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//           <div
//             style={{
//               width: "5px",
//               height: "5px",
//               background: "#28a745",
//               borderRadius: "50%",
//             }}
//           />
//           <span>Posted {job.posted}</span>
//         </div>
//         <div>
//           Source: <span style={{ color: "#0056b3", fontWeight: 600 }}>LinkedIn</span>
//         </div>
//       </div>
//     </div>
//   );
// };

