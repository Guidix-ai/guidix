'use client';
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Plus, Search, X, Calendar as CalendarIcon, Sparkles,
  ChevronLeft, ChevronRight, ChevronDown, ExternalLink,
  Briefcase, Users, XCircle, Bookmark, MoreHorizontal
} from "lucide-react";

// =========================
// Local data (no API)
// =========================
const initialColumns = [
  { id: "shortlist", title: "Saved", jobs: [] },
  { id: "applied", title: "Applied", jobs: [] },
  { id: "interview", title: "Interview", jobs: [] },
  { id: "rejected", title: "Rejected", jobs: [] },
];

const sampleJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    status: "shortlist",
    url: "https://example.com/job1",
    notes: "Interesting role with React and TypeScript",
    documents: [],
    jobDescription: "We are looking for a senior frontend developer...",
    salary: "$120,000 - $150,000",
    appliedDate: "2025-11-20",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    status: "applied",
    url: "https://example.com/job2",
    notes: "Applied through company website",
    documents: [],
    jobDescription: "Full stack position with Node.js and React...",
    salary: "$100,000 - $130,000",
    appliedDate: "2025-11-22",
  },
  {
    id: "3",
    title: "Software Engineer",
    company: "Innovation Labs",
    location: "New York, NY",
    status: "interview",
    url: "https://example.com/job3",
    notes: "Phone interview scheduled for Friday",
    documents: [],
    jobDescription: "Software engineer role at a growing startup...",
    salary: "$90,000 - $120,000",
    appliedDate: "2025-11-18",
    interviewDate: "2025-11-29",
  },
  {
    id: "4",
    title: "Backend Developer",
    company: "DataFlow Inc",
    location: "Austin, TX",
    status: "applied",
    url: "https://example.com/job4",
    notes: "Python and Django experience required",
    documents: [],
    jobDescription: "Backend developer for data processing systems...",
    salary: "$110,000 - $140,000",
    appliedDate: "2025-11-25",
  },
];

const STORAGE_KEY = "job-tracker-columns-v2";

// =========================
// Small UI helpers
// =========================
const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl mx-4">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-[#002A79]">{title}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5 text-[#6477B4]" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t p-3">{footer}</div>}
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-[#002A79]">{label}</span>
    {children}
  </label>
);

const TextInput = (props) => (
  <input
    {...props}
    className={`h-10 rounded-lg border border-[#D5E4FF] px-3 text-sm outline-none focus:border-[#2370FF] bg-[#F4F8FF] text-[#002A79] ${props.className || ""}`}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={`min-h-[90px] rounded-lg border border-[#D5E4FF] p-3 text-sm outline-none focus:border-[#2370FF] bg-[#F4F8FF] text-[#002A79] ${props.className || ""}`}
  />
);

const PrimaryBtn = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={`transition-all hover:opacity-90 ${className}`}
    style={{
      display: 'inline-flex',
      padding: '12px 16px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '8px',
      border: '1px solid rgba(35, 112, 255, 0.3)',
      background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
      boxShadow: '0px 2px 4px 0px rgba(77, 145, 225, 0.10), 0px 1px 0.3px 0px rgba(255, 255, 255, 0.25) inset, 0px -1px 0.3px 0px rgba(0, 19, 88, 0.25) inset',
      color: '#FFFFFF',
      textAlign: 'center',
      textShadow: '0px 0.5px 1.5px rgba(0, 19, 88, 0.30), 0px 2px 5px rgba(0, 19, 88, 0.10)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '125%',
    }}
  >
    {children}
  </button>
);

const OutlineBtn = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#D5E4FF] bg-white px-4 py-2 text-sm font-medium text-[#002A79] hover:bg-[#F4F8FF] ${className}`}
  >
    {children}
  </button>
);

// =========================
// Add/Edit Dialog
// =========================
const AddJobDialog = ({ isOpen, onClose, onSave, defaultStatus, jobToEdit }) => {
  const [form, setForm] = useState(
    jobToEdit || {
      id: "",
      title: "",
      company: "",
      location: "",
      status: defaultStatus,
      url: "",
      notes: "",
      jobDescription: "",
      salary: "",
      appliedDate: new Date().toISOString().split('T')[0],
    }
  );

  useEffect(() => {
    setForm(
      jobToEdit || {
        id: "",
        title: "",
        company: "",
        location: "",
        status: defaultStatus,
        url: "",
        notes: "",
        jobDescription: "",
        salary: "",
        appliedDate: new Date().toISOString().split('T')[0],
      }
    );
  }, [jobToEdit, defaultStatus]);

  const submit = () => {
    const id = form.id || Date.now().toString();
    onSave({ ...form, id });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={jobToEdit ? "Edit Job" : "Add New Job"}
      footer={
        <>
          <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
          <PrimaryBtn onClick={submit}>{jobToEdit ? "Save" : "Add Job"}</PrimaryBtn>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto">
        <Field label="Job Title">
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Software Engineer" />
        </Field>
        <Field label="Company">
          <TextInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g., Google" />
        </Field>
        <Field label="Location">
          <TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Remote, San Francisco" />
        </Field>
        <Field label="Status">
          <select
            className="h-10 rounded-lg border border-[#D5E4FF] px-3 text-sm outline-none focus:border-[#2370FF] bg-[#F4F8FF] text-[#002A79]"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="shortlist">Saved</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
        </Field>
        <Field label="Job URL">
          <TextInput value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
        </Field>
        <Field label="Salary">
          <TextInput value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g., $80,000 - $100,000" />
        </Field>
        <Field label="Notes">
          <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add any notes..." />
        </Field>
      </div>
    </Modal>
  );
};

// =========================
// Compact Calendar Widget
// =========================
const CalendarWidget = ({ jobs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const interviewDates = jobs
    .filter(job => job.interviewDate)
    .map(job => {
      const date = new Date(job.interviewDate);
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        return date.getDate();
      }
      return null;
    })
    .filter(Boolean);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: '12px',
        boxShadow: '0px 1px 3px rgba(0, 42, 121, 0.08), 0px 1px 2px rgba(0, 42, 121, 0.06)',
      }}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: '#002A79' }}>Calendar</h3>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-0.5 hover:bg-[#F4F8FF] rounded">
              <ChevronLeft className="w-3.5 h-3.5 text-[#6477B4]" />
            </button>
            <span className="text-xs font-medium text-[#002A79] min-w-[80px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-0.5 hover:bg-[#F4F8FF] rounded">
              <ChevronRight className="w-3.5 h-3.5 text-[#6477B4]" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((day, i) => (
            <div key={i} className="text-center text-[9px] font-medium text-[#6477B4] py-0.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-5" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasInterview = interviewDates.includes(day);

            return (
              <div
                key={day}
                className={`h-5 flex items-center justify-center text-[10px] rounded relative cursor-pointer transition-all
                  ${isToday(day) ? 'bg-[#2370FF] text-white font-semibold' : ''}
                  ${hasInterview && !isToday(day) ? 'bg-[#DBEAFE] text-[#1E40AF] font-medium' : ''}
                  ${!isToday(day) && !hasInterview ? 'text-[#002A79] hover:bg-[#F4F8FF]' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================
// AI Suggestions Widget with Email Templates
// =========================
const AISuggestionsWidget = ({ jobs }) => {
  const [activeSection, setActiveSection] = useState('tips');
  const [copiedEmail, setCopiedEmail] = useState(null);

  const interviewCount = jobs.filter(j => j.status === 'interview').length;
  const appliedCount = jobs.filter(j => j.status === 'applied').length;

  const emailTemplates = [
    {
      id: 'followup',
      title: 'Follow-up Email',
      icon: '📧',
      template: `Subject: Following Up - [Job Title] Application

Dear [Hiring Manager],

I hope this email finds you well. I recently applied for the [Job Title] position and wanted to follow up on my application.

I'm very excited about this opportunity and believe my skills in [Key Skills] align well with the role.

I would welcome the chance to discuss how I can contribute to your team.

Best regards,
[Your Name]`
    },
    {
      id: 'thankyou',
      title: 'Thank You Email',
      icon: '🙏',
      template: `Subject: Thank You - [Job Title] Interview

Dear [Interviewer Name],

Thank you for taking the time to meet with me today to discuss the [Job Title] position.

I enjoyed learning more about the role and [Company Name]. Our conversation reinforced my enthusiasm for this opportunity.

I look forward to hearing from you.

Best regards,
[Your Name]`
    }
  ];

  const tips = [
    {
      icon: '🎯',
      title: 'Interview Prep',
      description: interviewCount > 0
        ? `Prepare for ${interviewCount} upcoming interview${interviewCount > 1 ? 's' : ''}`
        : 'Research company before interviews',
    },
    {
      icon: '📝',
      title: 'Resume Tip',
      description: 'Tailor your resume for each application',
    },
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: '12px',
        boxShadow: '0px 1px 3px rgba(0, 42, 121, 0.08), 0px 1px 2px rgba(0, 42, 121, 0.06)',
      }}
    >
      {/* Header */}
      <div className="p-3 pb-2">
        <h3 className="text-sm font-semibold" style={{ color: '#002A79' }}>AI Suggestions</h3>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        {/* Section Tabs */}
        <div
          className="flex gap-1 mb-2 p-0.5 rounded-lg"
          style={{ backgroundColor: '#E9F1FF' }}
        >
          <button
            onClick={() => setActiveSection('tips')}
            className="flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={{
              background: activeSection === 'tips' ? '#FFFFFF' : 'transparent',
              color: activeSection === 'tips' ? '#002A79' : '#6477B4',
              boxShadow: activeSection === 'tips' ? '1px 1px 4px -1px rgba(0, 19, 88, 0.08)' : 'none',
            }}
          >
            Tips
          </button>
          <button
            onClick={() => setActiveSection('emails')}
            className="flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={{
              background: activeSection === 'emails' ? '#FFFFFF' : 'transparent',
              color: activeSection === 'emails' ? '#002A79' : '#6477B4',
              boxShadow: activeSection === 'emails' ? '1px 1px 4px -1px rgba(0, 19, 88, 0.08)' : 'none',
            }}
          >
            Emails
          </button>
        </div>

        {/* Tips Section */}
        {activeSection === 'tips' && (
          <div className="space-y-1.5">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-[#F4F8FF] rounded-lg">
                <span className="text-sm">{tip.icon}</span>
                <div>
                  <h4 className="font-medium text-[#002A79] text-xs">{tip.title}</h4>
                  <p className="text-[10px] text-[#6477B4] mt-0.5">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Templates Section */}
        {activeSection === 'emails' && (
          <div className="space-y-1.5">
            {emailTemplates.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-2 bg-[#F4F8FF] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{email.icon}</span>
                  <h4 className="font-medium text-[#002A79] text-xs">{email.title}</h4>
                </div>
                <button
                  onClick={() => copyToClipboard(email.template, email.id)}
                  className="transition-all hover:opacity-90 text-[10px] px-2 py-1 rounded"
                  style={{
                    background: copiedEmail === email.id ? '#D4F4DD' : '#2370FF',
                    color: copiedEmail === email.id ? '#2D7738' : '#FFFFFF',
                    fontWeight: 500,
                  }}
                >
                  {copiedEmail === email.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================
// Job Card - Matching dashboard card design
// =========================
const JobCardHorizontal = ({ job, onDelete, onStatusChange }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusColors = {
    shortlist: { bg: '#D4F4DD', text: '#2D7738' },
    applied: { bg: '#FEF3C7', text: '#92400E' },
    interview: { bg: '#DBEAFE', text: '#1E40AF' },
    rejected: { bg: '#FEE2E2', text: '#991B1B' },
  };

  const statusLabels = {
    shortlist: "shortlist",
    applied: "applied",
    interview: "interview",
    rejected: "rejected",
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(job.id, newStatus);
    setShowStatusDropdown(false);
  };

  const currentStatus = statusColors[job.status] || statusColors.applied;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0px 1px 3px rgba(0, 42, 121, 0.08), 0px 1px 2px rgba(0, 42, 121, 0.06)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '120px',
      }}
    >
      <div>
        {/* Top row: Title, dropdown, menu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '1.2',
                letterSpacing: '-0.36px',
                color: '#002A79',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {job.title ? (job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title) : "Untitled"}
            </h3>
            <ChevronDown style={{ width: '16px', height: '16px', flexShrink: 0, color: '#6477B4' }} />
          </div>
          <button
            style={{
              padding: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              color: '#6477B4',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4F8FF'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <MoreHorizontal style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Location */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '150%',
            color: '#6477B4',
            margin: '0 0 12px 0',
          }}
        >
          {job.location || "No location"}
        </p>
      </div>

      {/* Bottom row: Status badge and View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontWeight: 500,
              backgroundColor: currentStatus.bg,
              color: currentStatus.text,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {statusLabels[job.status]}
          </button>

          {showStatusDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#FFFFFF',
                zIndex: 10,
                minWidth: '100px',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0px 4px 16px rgba(0, 42, 121, 0.12), 0px 0px 1px rgba(0, 42, 121, 0.1)',
              }}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleStatusChange(value)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#002A79',
                    backgroundColor: job.status === value ? '#F4F8FF' : 'transparent',
                    fontWeight: job.status === value ? 500 : 400,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4F8FF'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = job.status === value ? '#F4F8FF' : 'transparent'}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <ExternalLink style={{ width: '14px', height: '14px', color: '#2370FF' }} />
          <span style={{ fontSize: '12px', color: '#2370FF', fontWeight: 500 }}>View</span>
        </div>
      </div>
    </div>
  );
};

// =========================
// Main Component
// =========================
export default function JobTrackerNew() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");
  const [columns, setColumns] = useState(() => initialColumns.map((c) => ({ ...c, jobs: [] })));
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);

  // Client-only effects
  useEffect(() => {
    setIsClient(true);

    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColumns(parsed);
      } catch {
        seedWithSamples();
      }
    } else {
      seedWithSamples();
    }
  }, []);

  // Persist columns
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns, isClient]);

  const seedWithSamples = () => {
    const seeded = initialColumns.map((col) => ({
      ...col,
      jobs: sampleJobs.filter((j) => j.status === col.id),
    }));
    setColumns(seeded);
  };

  // Get all jobs flat
  const allJobs = useMemo(() => columns.flatMap(col => col.jobs), [columns]);

  // Get jobs for current tab
  const currentJobs = useMemo(() => {
    const column = columns.find(c => c.id === activeTab);
    if (!column) return [];

    if (!searchQuery) return column.jobs;

    const q = searchQuery.toLowerCase();
    return column.jobs.filter(job =>
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (job.company || "").toLowerCase().includes(q) ||
      (job.notes || "").toLowerCase().includes(q)
    );
  }, [columns, activeTab, searchQuery]);

  // CRUD operations
  const handleSaveJob = useCallback((job) => {
    setColumns((prev) => {
      const exists = prev.some((col) => col.jobs.some((j) => j.id === job.id));
      if (!exists) {
        return prev.map((col) => (col.id === job.status ? { ...col, jobs: [...col.jobs, job] } : col));
      }
      const originalStatus = (prev.find((c) => c.jobs.some((j) => j.id === job.id)) || {}).id;
      if (originalStatus === job.status) {
        return prev.map((col) => (col.id === job.status ? { ...col, jobs: col.jobs.map((j) => (j.id === job.id ? job : j)) } : col));
      }
      return prev.map((col) => {
        if (col.id === originalStatus) return { ...col, jobs: col.jobs.filter((j) => j.id !== job.id) };
        if (col.id === job.status) return { ...col, jobs: [...col.jobs, job] };
        return col;
      });
    });
  }, []);

  const handleDeleteJob = useCallback((id) => {
    setColumns((prev) => prev.map((col) => ({ ...col, jobs: col.jobs.filter((j) => j.id !== id) })));
  }, []);

  const handleStatusChange = useCallback((jobId, newStatus) => {
    setColumns((prev) =>
      prev.map((col) => {
        const has = col.jobs.some((j) => j.id === jobId);
        if (!has && col.id !== newStatus) return col;
        if (has && col.id !== newStatus) return { ...col, jobs: col.jobs.filter((j) => j.id !== jobId) };
        if (col.id === newStatus) {
          const original = prev.flatMap((c) => c.jobs).find((j) => j.id === jobId);
          return original ? { ...col, jobs: [...col.jobs, { ...original, status: newStatus }] } : col;
        }
        return col;
      })
    );
  }, []);

  // Tab config with icons
  const tabs = [
    { id: 'applied', label: 'Applied', icon: Briefcase },
    { id: 'interview', label: 'Interview', icon: Users },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: 'shortlist', label: 'Saved', icon: Bookmark },
  ];

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Panel - Job Cards (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs - Following exact design */}
          <div
            className="rounded-xl shadow-sm border p-1 w-full overflow-x-auto"
            style={{
              borderColor: '#E9F1FF',
              backgroundColor: '#E9F1FF'
            }}
          >
            <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg transition-all whitespace-nowrap"
                    style={{
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#002A79' : '#6477B4',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #FFFFFF' : '1px solid transparent',
                      boxShadow: isActive ? '2px 2px 8px -2px rgba(0, 19, 88, 0.08)' : 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: '125%',
                      letterSpacing: '-0.32px',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Add */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6477B4]" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E9F1FF] bg-white text-[#002A79] placeholder-[#6477B4] text-sm outline-none focus:border-[#2370FF] transition-colors"
              />
            </div>
            <PrimaryBtn onClick={() => setIsAddJobOpen(true)} className="h-10 px-4">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Job</span>
            </PrimaryBtn>
          </div>

          {/* Job Cards Grid - 3 columns like screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentJobs.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-[#E9F1FF] p-6 text-center">
                <div className="text-3xl mb-2 opacity-50">📋</div>
                <h3 className="font-semibold text-[#002A79] text-sm mb-1">No jobs yet</h3>
                <p className="text-xs text-[#6477B4]">
                  {searchQuery ? 'No jobs match your search' : 'Add your first job to get started'}
                </p>
              </div>
            ) : (
              currentJobs.map((job) => (
                <JobCardHorizontal
                  key={job.id}
                  job={job}
                  onDelete={handleDeleteJob}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Widgets (1 col) */}
        <div className="space-y-4">
          <CalendarWidget jobs={allJobs} />
          <AISuggestionsWidget jobs={allJobs} />
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <AddJobDialog
        isOpen={isAddJobOpen}
        onClose={() => {
          setIsAddJobOpen(false);
          setEditJob(null);
        }}
        onSave={handleSaveJob}
        defaultStatus={activeTab}
        jobToEdit={editJob}
      />
    </div>
  );
}

export { JobTrackerNew };
