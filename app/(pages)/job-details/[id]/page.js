'use client'
import React, { useState } from 'react'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSearchParams, useRouter } from 'next/navigation'

// Button styles matching job-search page
const buttonStyles = {
  display: 'inline-flex',
  padding: '2px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  background: 'linear-gradient(180deg, #474FA3 0%, #2A338B 100%)',
  boxShadow: '0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset, 0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset'
}

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

const shadowBoxStyle = `
  0 0 6px 0 rgba(0, 0, 0, 0.12),
  0 2px 3px 0 rgba(0, 0, 0, 0.04),
  0 2px 6px 0 rgba(0, 0, 0, 0.04),
  inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
`

// Function to generate job description
const generateJobDescription = (title, company) => {
  const descriptions = {
    "Senior Frontend Developer": `We are seeking an experienced Senior Frontend Developer to join our dynamic team at ${company}. This role offers an exciting opportunity to lead frontend development initiatives and mentor junior developers while working on cutting-edge technologies.

As a Senior Frontend Developer, you will architect and implement scalable frontend solutions, collaborate with product and design teams, and drive technical excellence across our platform. You'll be responsible for delivering high-quality user experiences that serve millions of users.

Key Responsibilities:
• Lead frontend architecture decisions and implementation
• Mentor junior developers and conduct code reviews
• Collaborate with cross-functional teams to deliver features
• Optimize applications for performance and scalability
• Stay current with emerging frontend technologies
• Implement responsive and accessible web applications
• Work closely with backend teams on API integration
• Drive technical best practices and standards`,
    "React Engineer": `Join our engineering team at ${company} as a React Engineer and help build the next generation of our platform. This role is perfect for developers passionate about creating exceptional user experiences using modern React technologies.

As a React Engineer, you'll work on feature development, performance optimization, and maintaining our React-based applications. You'll collaborate with designers, product managers, and backend engineers to deliver seamless user experiences.

Key Responsibilities:
• Develop and maintain React applications
• Implement responsive and intuitive user interfaces
• Collaborate with design and product teams
• Write clean, testable, and maintainable code
• Optimize components for performance
• Participate in code reviews and technical discussions
• Work with state management libraries (Redux/Context)
• Integrate with RESTful APIs and GraphQL`,
    "Full Stack Engineer": `We're looking for a talented Full Stack Engineer to join ${company}'s engineering team. This role offers the opportunity to work across the entire technology stack, from frontend user interfaces to backend services and databases.

As a Full Stack Engineer, you'll contribute to both client-side and server-side development, helping to build scalable and robust applications that power our platform. You'll work in a collaborative environment with opportunities for growth and learning.

Key Responsibilities:
• Develop full-stack applications using modern technologies
• Build responsive frontend interfaces and robust backend APIs
• Design and implement database schemas and queries
• Collaborate with product and design teams on feature development
• Write comprehensive tests and maintain code quality
• Deploy and monitor applications in production
• Participate in technical architecture discussions
• Continuously learn and adopt new technologies`,
    "Frontend Developer": `${company} is seeking a skilled Frontend Developer to join our growing engineering team. This role is ideal for developers who are passionate about creating beautiful, functional, and user-friendly web applications.

As a Frontend Developer, you'll work on implementing designs, building reusable components, and ensuring our applications provide excellent user experiences across different devices and browsers.

Key Responsibilities:
• Implement pixel-perfect designs using HTML, CSS, and JavaScript
• Build reusable and maintainable frontend components
• Ensure cross-browser compatibility and responsive design
• Collaborate with UX/UI designers and backend developers
• Optimize applications for speed and performance
• Write clean, well-documented code
• Stay updated with latest frontend trends and technologies
• Participate in code reviews and team meetings`,
    "JavaScript Developer": `Join ${company} as a JavaScript Developer and work on exciting projects that leverage the full power of modern JavaScript. This role offers opportunities to work with cutting-edge technologies and contribute to innovative solutions.

As a JavaScript Developer, you'll be involved in both frontend and backend development, creating dynamic applications and APIs that serve our users' needs.

Key Responsibilities:
• Develop JavaScript applications using modern frameworks
• Build interactive frontend components and features
• Create and maintain backend services and APIs
• Write efficient, scalable, and maintainable code
• Collaborate with cross-functional teams
• Debug and troubleshoot applications
• Implement automated testing strategies
• Stay current with JavaScript ecosystem developments`
  }

  return descriptions[title] || `We are seeking a talented ${title} to join our team at ${company}. This role offers an excellent opportunity to work with modern technologies and contribute to innovative projects.`
}

// Function to extract key skills
const extractKeySkills = (title) => {
  const skillMap = {
    "Senior Frontend Developer": ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Webpack", "Git", "REST APIs", "GraphQL", "Testing", "Performance Optimization"],
    "React Engineer": ["React", "JavaScript", "TypeScript", "Redux", "React Router", "HTML5", "CSS3", "Git", "npm/yarn", "Webpack", "Jest", "GraphQL"],
    "Full Stack Engineer": ["React", "Node.js", "JavaScript", "Python", "MongoDB", "PostgreSQL", "REST APIs", "Git", "Docker", "AWS", "HTML5", "CSS3"],
    "Frontend Developer": ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design", "Git", "Webpack", "SASS/SCSS", "jQuery", "Bootstrap", "REST APIs", "Cross-browser Testing"],
    "JavaScript Developer": ["JavaScript", "Node.js", "React", "Express.js", "MongoDB", "HTML5", "CSS3", "Git", "npm/yarn", "REST APIs", "Testing", "ES6+"]
  }

  return skillMap[title] || ["JavaScript", "HTML5", "CSS3", "Git", "React"]
}

// Default job data
const defaultJob = {
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
}

const JobDetailsPage = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobData = searchParams.get('data')
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showCompanyDetails, setShowCompanyDetails] = useState(false)

  let job = defaultJob
  if (jobData) {
    try {
      const parsedJob = JSON.parse(decodeURIComponent(jobData))
      job = parsedJob
    } catch (error) {
      console.error('Error parsing job data:', error)
    }
  }

  const jobDescription = generateJobDescription(job.title, job.company)
  const keySkills = extractKeySkills(job.title)

  const handleApply = () => {
    if (job.companyWebsite) {
      window.open(job.companyWebsite, '_blank')
    }
    setTimeout(() => {
      setIsApplied(true)
    }, 500)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const getApplyButtonStyles = (applied) => {
    if (applied) {
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
    <DashboardLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF' }}>
        {/* Header matching job-search page */}
        <div className="relative py-12 px-8 overflow-hidden flex items-center justify-center" style={{
          background: '#000E41',
          minHeight: '200px',
          boxShadow: '0 4px 20px 0 #2370FF66',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          {/* Gradient blur effects */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, rgba(96, 165, 250, 0.4) 40%, transparent 70%)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: '0.8'
          }} />

          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-white font-bold mb-2" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontSize: '42px', lineHeight: '1.2' }}>
              {job.title}
            </h1>
            <p className="text-white text-xl" style={{ opacity: 0.9 }}>
              {job.company} • {job.location}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* Job Card - Same as job-search page */}
          <div
            className="rounded-lg shadow-sm relative transition-all mb-6"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F1F3F7',
              boxShadow: shadowBoxStyle,
            }}
          >
            <div className="p-4">
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
                    className="text-white rounded-lg px-2 py-1"
                    style={{ backgroundColor: '#0F2678' }}
                  >
                    <div className="text-center">
                      <div className="text-xs mb-0.5">Match</div>
                      <div className="text-sm font-bold">{job.matchScore}%</div>
                    </div>
                  </div>
                  <div
                    className="text-white rounded-lg px-2 py-1"
                    style={{ backgroundColor: '#003598' }}
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
                  onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                >
                  <svg width="10" height="10" fill="none" viewBox="0 0 14 14" className={`transition-transform ${showCompanyDetails ? 'rotate-180' : ''}`}>
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Company Details
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSave} style={{...buttonStyles, background: isSaved ? '#EBF1FF' : '#F8F9FF', padding: '6px'}} className="transition-all hover:opacity-70" title="Save Job">
                    <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                      <path d="M4 2V14L8 11L12 14V2H4Z" stroke={isSaved ? "#2370FF" : "#6D7586"} strokeWidth="2" fill={isSaved ? "#2370FF" : "none"}/>
                    </svg>
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={isApplied}
                    style={getApplyButtonStyles(isApplied)}
                    className="transition-all hover:opacity-90"
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>

              {showCompanyDetails && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FF', border: '1px solid #EBF1FF' }}>
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
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F3F7', boxShadow: shadowBoxStyle }}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#002A79' }}>Job Description</h2>
                  <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#353E5C' }}>
                    {jobDescription}
                  </div>
                </div>
              </div>

              {/* Key Skills */}
              <div className="rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F3F7', boxShadow: shadowBoxStyle }}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#002A79' }}>Key Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {keySkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: '#EBF1FF',
                          color: '#2370FF',
                          border: '1px solid #B2CDFF'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Information */}
            <div className="space-y-6">
              {/* Job Information Card */}
              <div className="rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F3F7', boxShadow: shadowBoxStyle }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#002A79' }}>Job Information</h3>
                  <div className="space-y-4">
                    <div className="pb-3" style={{ borderBottom: '1px solid #F1F3F7' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Role</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>{job.title}</div>
                    </div>
                    <div className="pb-3" style={{ borderBottom: '1px solid #F1F3F7' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Industry Type</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>{job.companyType}</div>
                    </div>
                    <div className="pb-3" style={{ borderBottom: '1px solid #F1F3F7' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Department</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>Engineering - Software & QA</div>
                    </div>
                    <div className="pb-3" style={{ borderBottom: '1px solid #F1F3F7' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Employment Type</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>{job.type}</div>
                    </div>
                    <div className="pb-3" style={{ borderBottom: '1px solid #F1F3F7' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Education</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>B.Tech/B.E., MCA, M.Tech</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#6D7586' }}>Role Category</div>
                      <div className="text-sm font-semibold" style={{ color: '#353E5C' }}>Software Development</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F3F7', boxShadow: shadowBoxStyle }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#002A79' }}>About Company</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#6D7586' }}>
                    {job.companyDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobDetailsPage
