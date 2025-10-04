'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { getJobsWithResumeUpload, addToWishlist, removeFromWishlist, markNotInterested, setJobStatus, JobStatusEnum, getJobDetails } from '@/services/jobService'
import { handleApiError, logError } from '@/utils/errorHandler'

// Button styles based on Figma config
const buttonStyles = {
  display: 'inline-flex',
  padding: '2px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
  boxShadow: '0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset'
}

// Button text styles from Figma config
const buttonTextStyles = {
  color: '#FFFFFF',
  textAlign: 'center',
  textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '125%',
  letterSpacing: '-2%'
}

// Apply button specific styles from Figma
const applyButtonStyles = {
  display: 'inline-flex',
  maxWidth: '180px',
  padding: '8px 12px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '8px',
  border: '1px solid rgba(35, 112, 255, 0.30)',
  background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
  boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
  ...buttonTextStyles
}

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
    companyDescription: "Flipkart is India's leading e-commerce marketplace offering a wide range of products across categories like electronics, fashion, home & kitchen, and more.",
    companyWebsite: "https://www.flipkart.com/careers",
    isUrgent: true
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
    companyDescription: "Zomato is a leading food delivery and restaurant discovery platform connecting millions of customers with restaurants across India and globally.",
    companyWebsite: "https://www.zomato.com/careers",
    isUrgent: false
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
    companyDescription: "Swiggy is India's leading on-demand convenience platform that delivers food, groceries, and essentials to customers across 500+ cities.",
    companyWebsite: "https://careers.swiggy.com",
    isUrgent: false
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
    companyDescription: "PhonePe is India's leading digital payments platform, enabling secure and seamless transactions for millions of users across the country.",
    companyWebsite: "https://www.phonepe.com/careers",
    isUrgent: false
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
    companyDescription: "Razorpay is a full-stack financial solutions company that enables businesses to accept, process and disburse payments with ease.",
    companyWebsite: "https://razorpay.com/jobs",
    isUrgent: false
  }
];

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`;

const EnhancedJobCard = ({ job, onApply, onSave, onBlock, isApplied, isSaved, router }) => {
  const [isHoveringMatchScore, setIsHoveringMatchScore] = useState(false)
  const [showCompanyDetails, setShowCompanyDetails] = useState(false)

  const handleCardClick = (e) => {
    const target = e.target;
    const isButtonClick = target.closest('button') || target.closest('[data-match-score]') || target.closest('[data-company-details]')
    if (!isButtonClick) {
      // Open job details page in a new tab
      const jobDataString = encodeURIComponent(JSON.stringify(job))
      window.open(`/job-details/${job.id}?data=${jobDataString}`, '_blank')
    }
  }

  const handleCompanyDetailsClick = (e) => {
    e.stopPropagation()
    setShowCompanyDetails(!showCompanyDetails)
  }

  const handleShowLess = (e) => {
    e.stopPropagation()
    setIsHoveringMatchScore(false)
  }

  // Apply button specific styles
  const getApplyButtonStyles = (isApplied) => {
    if (isApplied) {
      return {
        ...applyButtonStyles,
        background: '#22c55e',
        border: '1px solid rgba(34, 197, 94, 0.30)',
        cursor: 'not-allowed'
      }
    }
    return applyButtonStyles
  }

  return (
   
    <div
      className="rounded-lg shadow-sm relative transition-all hover:shadow-md cursor-pointer mb-3"
      style={{ 
        backgroundColor: '#FFFFFF',
        border: '1px solid #F1F3F7',
        boxShadow: shadowBoxStyle,
      }}
      onMouseLeave={() => setIsHoveringMatchScore(false)}
      onClick={handleCardClick}
    >
      <div className="p-4">
        {!isHoveringMatchScore ? (
          <>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#0F2678' }}>
                  {job.company.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#002A79' }}>{job.company}</div>
                  <div className="text-xs" style={{ color: '#6D7586' }}>{job.companyType.split(' · ')[0]}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className="text-white rounded-lg px-2 py-1 cursor-pointer transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0F2678' }}
                  onMouseEnter={() => setIsHoveringMatchScore(true)}
                  data-match-score="true"
                >
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Match</div>
                    <div className="text-sm font-bold">{job.matchScore}%</div>
                  </div>
                </div>
                <div
                  className="text-white rounded-lg px-2 py-1 cursor-pointer transition-all hover:opacity-90"
                  style={{ backgroundColor: '#003598' }}
                  onMouseEnter={() => setIsHoveringMatchScore(true)}
                  data-match-score="true"
                >
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Success</div>
                    <div className="text-sm font-bold">{job.predictabilityScore}%</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2" style={{ color: '#002A79' }}>{job.title}</h3>

            <div className="flex items-center gap-4 text-xs mb-2 flex-wrap">
              <div className="flex items-center gap-1">
                <svg width="12" height="12" fill="none" viewBox="0 0 16 16" style={{ color: '#2370FF' }}>
                  <path d="M2 6H14L12 2H4L2 6ZM2 8V14H14V8H2Z" fill="currentColor"/>
                </svg>
                <span style={{ color: '#2370FF', fontWeight: '600' }}>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" fill="none" viewBox="0 0 16 16" style={{ color: '#679CFF' }}>
                  <path d="M8 2L12 6V14H4V6L8 2Z" fill="currentColor"/>
                </svg>
                <span style={{ fontWeight: '500', color: '#353E5C' }}>{job.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" fill="none" viewBox="0 0 16 16" style={{ color: '#B2ASFF' }}>
                  <path d="M8 2C6.1 2 4 3.8 4 6.5C4 9.3 8 14 8 14S12 9.3 12 6.5C12 3.8 9.9 2 8 2ZM8 8C7.2 8 6.5 7.3 6.5 6.5S7.2 5 8 5S9.5 5.7 9.5 6.5S8.8 8 8 8Z" fill="currentColor"/>
                </svg>
                <span style={{ fontWeight: '500', color: '#353E5C' }}>{job.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <div style={{ fontWeight: '500', color: '#6D7586' }}>{job.posted} • {job.applicants} applicants</div>
            </div>

            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F1F3F7' }}>
              <div
                className="flex items-center gap-1 text-xs hover:opacity-80 cursor-pointer font-medium transition-all"
                style={{ color: '#6D7586' }}
                onClick={handleCompanyDetailsClick}
                data-company-details="true"
              >
                <svg width="10" height="10" fill="none" viewBox="0 0 14 14" className={`transition-transform ${showCompanyDetails ? 'rotate-180' : ''}`}>
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Company Details
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onBlock(job.id); }} style={{...buttonStyles, padding: '6px', background: '#F8F9FF'}} className="hover:opacity-70 transition-all" title="Dismiss">
                  <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                    <path d="M4 4L12 12M4 12L12 4" stroke="#6D7586" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onSave(job.id); }} style={{...buttonStyles, background: isSaved ? '#EBF1FF' : '#F8F9FF', padding: '6px'}} className="transition-all hover:opacity-70" title="Save Job">
                  <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                    <path d="M4 2V14L8 11L12 14V2H4Z" stroke={isSaved ? "#2370FF" : "#6D7586"} strokeWidth="2" fill={isSaved ? "#2370FF" : "none"}/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onApply(job.id); }}
                  disabled={isApplied}
                  style={getApplyButtonStyles(isApplied)}
                  className="transition-all hover:opacity-90"
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>

            {showCompanyDetails && (
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FF', border: '1px solid #EBF1FF' }} data-company-details="true">
                <h4 className="font-bold mb-2 text-xs" style={{ color: '#002A79' }}>Company Links</h4>
                <div className="space-y-1">
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1.5 rounded-lg transition-all text-xs hover:opacity-80" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF1FF' }}>
                      <svg width="10" height="10" fill="none" viewBox="0 0 16 16">
                        <path d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5L8 0Z" fill="#2370FF"/>
                      </svg>
                    </div>
                    <span style={{ fontWeight: '600', color: '#353E5C' }}>Company Website</span>
                  </a>
                  <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1.5 rounded-lg transition-all text-xs hover:opacity-80" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF1FF' }}>
                      <svg width="10" height="10" fill="none" viewBox="0 0 16 16">
                        <path d="M4 2H12C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14H4C2.9 14 2 13.1 2 12V4C2 2.9 2.9 2 4 2Z" fill="#2370FF"/>
                      </svg>
                    </div>
                    <span style={{ fontWeight: '600', color: '#353E5C' }}>Company LinkedIn</span>
                  </a>
                  <a href={job.hrLinkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1.5 rounded-lg transition-all text-xs hover:opacity-80" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF1FF' }}>
                      <svg width="10" height="10" fill="none" viewBox="0 0 16 16">
                        <path d="M8 8C9.1 8 10 7.1 10 6C10 4.9 9.1 4 8 4C6.9 4 6 4.9 6 6C6 7.1 6.9 8 8 8ZM8 9C6.3 9 3 9.8 3 11.5V13H13V11.5C13 9.8 9.7 9 8 9Z" fill="#2370FF"/>
                      </svg>
                    </div>
                    <span style={{ fontWeight: '600', color: '#353E5C' }}>HR LinkedIn</span>
                  </a>
                </div>
                <div className="mt-3 pt-2" style={{ borderTop: '1px solid #EBF1FF' }}>
                  <h4 className="font-bold mb-2 text-xs" style={{ color: '#002A79' }}>Company Insights</h4>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBF1FF' }}>
                      <div className="text-xs font-medium" style={{ color: '#6D7586' }}>Team</div>
                      <div className="font-bold text-xs" style={{ color: '#353E5C' }}>{job.teamSize}</div>
                    </div>
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBF1FF' }}>
                      <div className="text-xs font-medium" style={{ color: '#6D7586' }}>Founded</div>
                      <div className="font-bold text-xs" style={{ color: '#353E5C' }}>{job.foundedYear}</div>
                    </div>
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBF1FF' }}>
                      <div className="text-xs font-medium" style={{ color: '#6D7586' }}>Industry</div>
                      <div className="font-bold text-xs" style={{ color: '#353E5C' }}>{job.companyType.split(' · ')[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#0F2678' }}>
                  {job.company.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#002A79' }}>{job.company}</div>
                  <div className="text-xs" style={{ color: '#6D7586' }}>Score Analysis</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1" onMouseLeave={() => setIsHoveringMatchScore(false)} data-match-score="true">
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Match</div>
                    <div className="text-sm font-bold">{job.matchScore}%</div>
                  </div>
                </div>
                <div className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1" onMouseLeave={() => setIsHoveringMatchScore(false)} data-match-score="true">
                  <div className="text-center">
                    <div className="text-xs mb-0.5">Success</div>
                    <div className="text-sm font-bold">{job.predictabilityScore}%</div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#002A79' }}>{job.title}</h3>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#6D7586' }}>{job.companyDescription}</p>
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="rounded-lg p-3" style={{ backgroundColor: '#EBF1FF', border: '1px solid #B2CDFF' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#003598' }}>Match Breakdown</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#353E5C' }}>Skills</span>
                      <span className="text-xs font-bold" style={{ color: '#2370FF' }}>{job.skillsMatch}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#F8F9FF' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${job.skillsMatch}%`, backgroundColor: '#2370FF' }}/>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#353E5C' }}>Experience</span>
                      <span className="text-xs font-bold" style={{ color: '#679CFF' }}>{job.experienceMatch}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#F8F9FF' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${job.experienceMatch}%`, backgroundColor: '#679CFF' }}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: '#F8F9FF', border: '1px solid #E1E4ED' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#003598' }}>Success Rate</h4>
                <div className="space-y-1">
                  <div className="text-xs" style={{ color: '#6D7586' }}>
                    <span className="font-semibold">Based on similar profiles</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#EBF1FF' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${job.predictabilityScore}%`, backgroundColor: '#82A5FF' }}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F1F3F7' }}>
              <button onClick={handleShowLess} style={{
                display: 'inline-flex',
                padding: '6px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
                boxShadow: '0 1px 0.5px 0 rgba(255, 255, 255, 0.24) inset, 0 -1px 0.5px 0 rgba(6, 51, 165, 0.37) inset',
                color: '#FFFFFF',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '125%',
                letterSpacing: '-0.24px'
              }} className="transition-all hover:opacity-80">
                Show Less
              </button>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onBlock(job.id); }} style={{...buttonStyles, padding: '6px', background: '#F8F9FF'}} className="hover:opacity-70 transition-all" title="Dismiss">
                  <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                    <path d="M4 4L12 12M4 12L12 4" stroke="#6D7586" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onSave(job.id); }} style={{...buttonStyles, background: isSaved ? '#EBF1FF' : '#F8F9FF', padding: '6px'}} className="transition-all hover:opacity-70" title="Save Job">
                  <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                    <path d="M4 2V14L8 11L12 14V2H4Z" stroke={isSaved ? "#2370FF" : "#6D7586"} strokeWidth="2" fill={isSaved ? "#2370FF" : "none"}/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onApply(job.id); }}
                  disabled={isApplied}
                  style={getApplyButtonStyles(isApplied)}
                  className="transition-all hover:opacity-90"
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const JobSearchPage = () => {
  const router = useRouter()
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [dismissedJobs, setDismissedJobs] = useState(new Set())
  const [showApplyBanner, setShowApplyBanner] = useState(false)
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("match")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [typewriterText, setTypewriterText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullText = "Hey Advika! We've curated the perfect matches. Secure the bag!"
  const [jobs, setJobs] = useState(allJobs) // Start with mock data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch jobs with resume upload on page load
  useEffect(() => {
    const fetchJobsWithResume = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check if there's a saved resume file or resume_id in sessionStorage
        const savedResumeId = sessionStorage.getItem('uploadedResumeId') || sessionStorage.getItem('createdResumeId')

        // For now, we'll use mock data as fallback
        // In production, you would either:
        // 1. Get resume file from user upload
        // 2. Use resume_id to fetch jobs with getJobsWithAIScoring

        // If you have a resume file stored somewhere, uncomment this:
        // const resumeFile = ... // Get file from somewhere
        // const response = await getJobsWithResumeUpload(resumeFile, 20, 0)

        // Transform API response to match current job structure
        // if (response.success && response.data.jobs) {
        //   const transformedJobs = response.data.jobs.map(apiJob => ({
        //     id: apiJob.job_id,
        //     title: apiJob.title,
        //     company: apiJob.company || 'Company',
        //     location: apiJob.location || 'Location',
        //     matchScore: apiJob.overall_score || 0,
        //     // ... map other fields
        //   }))
        //   setJobs(transformedJobs)
        // }

        // For now, keep using mock data
        setJobs(allJobs)
        setLoading(false)
      } catch (err) {
        const errorMessage = handleApiError(err)
        logError('JobSearchPage - Fetch Jobs', err)
        setError(errorMessage)
        // Fallback to mock data on error
        setJobs(allJobs)
        setLoading(false)
      }
    }

    fetchJobsWithResume()
  }, [])

  // Apply Google Fonts Inter on component mount
  useEffect(() => {
    const googleFontsLink = document.createElement('link')
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    googleFontsLink.rel = 'stylesheet'
    document.head.appendChild(googleFontsLink)

    // Apply Inter font globally to the entire document and all elements
    const style = document.createElement('style')
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
    `
    document.head.appendChild(style)
  }, [])

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, currentIndex))
      currentIndex++
      if (currentIndex > fullText.length) {
        clearInterval(interval)
        setShowCursor(false)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown-container]')) {
        setShowSortDropdown(false)
      }
    }
    
    if (showSortDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSortDropdown])

  const filteredJobs = useMemo(() => {
    let filteredList = jobs.filter(job => !dismissedJobs.has(job.id))
    if (filterBy === "remote") filteredList = filteredList.filter(job => job.remote)
    else if (filterBy === "urgent") filteredList = filteredList.filter(job => job.isUrgent)
    else if (filterBy === "high-match") filteredList = filteredList.filter(job => job.matchScore >= 85)
    else if (filterBy === "internships") filteredList = filteredList.filter(job => job.level && job.level.toLowerCase().includes("intern"))

    if (sortBy === "match") filteredList.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    else if (sortBy === "recent") filteredList.sort((a, b) => b.id - a.id)
    else if (sortBy === "salary") {
      const getSalaryMax = (salary) => {
        if (!salary) return 0
        const parts = salary.split("-")
        if (parts.length === 2) return parseInt(parts[1].replace(/[^\d]/g, ""), 10)
        return parseInt(parts[0].replace(/[^\d]/g, ""), 10)
      }
      filteredList.sort((a, b) => getSalaryMax(b.salary) - getSalaryMax(a.salary))
    }
    return filteredList
  }, [jobs, filterBy, sortBy, dismissedJobs])

  const handleApply = async (jobId) => {
    const job = jobs.find(j => j.id === jobId)
    if (job && job.companyWebsite) {
      window.open(job.companyWebsite, '_blank')
    }

    // Call API to mark as applied
    try {
      await setJobStatus(jobId, JobStatusEnum.APPLIED, {
        applied_at: new Date().toISOString(),
        application_url: job?.companyWebsite
      })

      setTimeout(() => {
        setAppliedJobs(prev => new Set(prev).add(jobId))
        setShowApplyBanner(true)
        setTimeout(() => setShowApplyBanner(false), 3000)
      }, 500)
    } catch (err) {
      logError('JobSearchPage - Apply', err)
      // Still update UI even if API fails
      setTimeout(() => {
        setAppliedJobs(prev => new Set(prev).add(jobId))
        setShowApplyBanner(true)
        setTimeout(() => setShowApplyBanner(false), 3000)
      }, 500)
    }
  }

  const handleSaveJob = async (jobId) => {
    const isSaved = savedJobs.has(jobId)

    // Call API to add/remove from wishlist
    try {
      if (isSaved) {
        // Remove from wishlist
        await removeFromWishlist(jobId)
      } else {
        // Add to wishlist
        await addToWishlist(jobId)
      }

      // Update UI
      setSavedJobs(prev => {
        const newSet = new Set(prev)
        if (newSet.has(jobId)) newSet.delete(jobId)
        else newSet.add(jobId)
        return newSet
      })
    } catch (err) {
      logError('JobSearchPage - Save', err)
      // Still update UI even if API fails
      setSavedJobs(prev => {
        const newSet = new Set(prev)
        if (newSet.has(jobId)) newSet.delete(jobId)
        else newSet.add(jobId)
        return newSet
      })
    }
  }

  const handleBlock = async (jobId) => {
    // Call API to mark as not interested
    try {
      await markNotInterested(jobId)

      // Update UI
      setDismissedJobs(prev => new Set(prev).add(jobId))
    } catch (err) {
      logError('JobSearchPage - Block', err)
      // Still update UI even if API fails
      setDismissedJobs(prev => new Set(prev).add(jobId))
    }
  }

  const sortOptions = [
    { value: 'match', label: 'Match Score' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary', label: 'Salary' }
  ]

  const handleSortChange = (value) => {
    setSortBy(value)
    setShowSortDropdown(false)
  }

  return (
    <DashboardLayout>
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF' }}>
      <div className="relative py-6 px-8 overflow-hidden flex items-center" style={{
        backgroundImage: 'url(/banner.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100px',
        boxShadow: '0 4px 20px 0 #2370FF66',
        borderRadius: '16px'
      }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-white font-bold mb-2" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontSize: '32px', lineHeight: '1.2', maxWidth: '800px' }}>
            {typewriterText}
            {showCursor && <span className="animate-pulse">|</span>}
          </h1>
        </div>
      </div>

      <div className="bg-white px-8 py-5 border-b" style={{ borderColor: '#E1E4ED', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-3 flex-wrap">
            {[
              { key: "all", label: "All Jobs" },
              { key: "high-match", label: "85+ Match" },
              { key: "remote", label: "Remote" },
              { key: "urgent", label: "Urgent" },
              { key: "internships", label: "Internships" }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterBy(filter.key)}
                style={filterBy === filter.key 
                  ? { 
                      display: 'inline-flex',
                      padding: '10px 20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '12px',
                      background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
                      boxShadow: '0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset',
                      color: '#FFFFFF',
                      textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: '125%',
                      letterSpacing: '-0.36px'
                    }
                  : { 
                      display: 'inline-flex',
                      width: '92px',
                      height: '47px',
                      minHeight: '44px',
                      padding: '8px 16px',
                      gap: '8px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '12px',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#D5E4FF',
                      borderTop: '1px solid #D5E4FF',
                      background: 'linear-gradient(180deg, #F4F8FF 0%, #E9F1FF 100%)',
                      boxShadow: '0 4px 8px -2px rgba(0, 19, 88, 0.10)',
                      opacity: 1,
                      color: '#474FA3',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '125%',
                      letterSpacing: '-0.32px'
                    }
                }
                className="transition-all hover:opacity-90"
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Sort by:</label>
            <div style={{position: 'relative', minWidth: '200px'}} data-dropdown-container>
              <div
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full text-sm font-medium text-gray-700 cursor-pointer focus:outline-none flex items-center justify-between"
                style={{
                  height: '54px',
                  minHeight: '54px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #F0F4FA',
                  background: '#FFF',
                  boxShadow: '0 -4px 4px 0 rgba(0, 19, 88, 0.10) inset, 0 4px 16px 0 rgba(0, 19, 88, 0.04), 0 4px 4px 0 rgba(0, 19, 88, 0.04), 0 0 2px 0 rgba(0, 19, 88, 0.15)'
                }}
              >
                <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{
                  transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {showSortDropdown && (
                <div
                  style={{
                    display: 'flex',
                    width: '272px',
                    padding: '16px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                    borderRadius: '12px',
                    border: '1px solid #F0F4FA',
                    background: '#FFF',
                    boxShadow: '0 -4px 2px 0 rgba(17, 35, 89, 0.08) inset, 0 1.5px 1.5px 0 rgba(17, 35, 89, 0.17), 0 2px 5px 0 rgba(17, 35, 89, 0.03), 0 12px 45px 0 rgba(13, 57, 170, 0.15)',
                    position: 'absolute',
                    top: '60px',
                    left: '0',
                    zIndex: 50
                  }}
                >
                  {sortOptions.map(option => (
                    <div
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className="w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50 text-sm font-medium"
                      style={{
                        backgroundColor: sortBy === option.value ? 'rgba(35, 112, 255, 0.08)' : 'transparent',
                        color: sortBy === option.value ? '#2370FF' : '#374151'
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

      <div className="max-w-6xl mx-auto px-8 py-6" style={{ backgroundColor: 'transparent' }}>
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F3F7' }}>
            <div className="text-6xl mb-6">😞</div>
            <div className="mb-6 text-xl font-semibold" style={{ color: '#353E5C' }}>No jobs match your criteria</div>
            <button
              onClick={() => setDismissedJobs(new Set())}
              style={{ 
                display: 'inline-flex',
                padding: '12px 32px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
                boxShadow: '0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset',
                color: '#FFFFFF',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '125%',
                letterSpacing: '-0.36px'
              }}
              className="hover:opacity-90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredJobs.map(job => (
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
          ))
        )}
      </div>

      {showApplyBanner && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span className="font-semibold">Successfully applied!</span>
          <button onClick={() => setShowApplyBanner(false)} style={{
            ...buttonStyles, 
            padding: '4px', 
            background: 'transparent',
            color: '#FFFFFF',
            textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: 500
          }} className="hover:text-gray-200 transition-all">
            ✕
          </button>
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}

export default JobSearchPage
