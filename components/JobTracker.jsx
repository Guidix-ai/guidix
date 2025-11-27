'use client';
import React, { useState, useCallback, useMemo, useEffect } from "react";


import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Search, Filter, X, Weight } from "lucide-react";
import { JobCard } from "@/components/JobCard";
// =========================
// Local data (no API)
// =========================
const initialColumns = [
  { id: "shortlist", title: "Shortlist", jobs: [] },
  { id: "applied", title: "Applied", jobs: [] },
  { id: "interview", title: "Interview", jobs: [] },
  { id: "rejected", title: "Rejected", jobs: [] },
];

const sampleJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    status: "shortlist",
    url: "https://example.com/job1",
    notes: "Interesting role with React and TypeScript",
    documents: [],
    jobDescription: "We are looking for a senior frontend developer...",
    salary: "$120,000 - $150,000",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    location: "Remote",
    status: "applied",
    url: "https://example.com/job2",
    notes: "Applied through company website",
    documents: [],
    jobDescription: "Full stack position with Node.js and React...",
    salary: "$100,000 - $130,000",
  },
  {
    id: "3",
    title: "Software Engineer",
    location: "New York, NY",
    status: "interview",
    url: "https://example.com/job3",
    notes: "Phone interview scheduled for Friday",
    documents: [],
    jobDescription: "Software engineer role at a growing startup...",
    salary: "$90,000 - $120,000",
  },
];

const STORAGE_KEY = "job-tracker-columns-v1";

// =========================
// Small UI helpers (no external UI kit)
// =========================
const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5" />
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
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {children}
  </label>
);

const TextInput = (props) => (
  <input
    {...props}
    className={`h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 ${props.className || ""
      }`}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={`min-h-[90px] rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 ${props.className || ""
      }`}
  />
);

const PrimaryBtn = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const OutlineBtn = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 ${className}`}
  >
    {children}
  </button>
);

// =========================
// Local-only Add/Edit Dialog (no API)
// =========================
const AddJobDialog = ({ isOpen, onClose, onSave, defaultStatus, jobToEdit }) => {
  const [form, setForm] = useState(
    jobToEdit || {
      id: "",
      title: "",
      location: "",
      status: defaultStatus,
      url: "",
      notes: "",
      jobDescription: "",
      salary: "",
    }
  );

  useEffect(() => {
    setForm(
      jobToEdit || {
        id: "",
        title: "",
        location: "",
        status: defaultStatus,
        url: "",
        notes: "",
        jobDescription: "",
        salary: "",
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
      title={jobToEdit ? "Edit job" : "Add job"}
      footer={
        <>
          <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
          <PrimaryBtn onClick={submit}>{jobToEdit ? "Save" : "Add"}</PrimaryBtn>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3">
        <Field label="Title">
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Location">
          <TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
        <Field label="Status">
          <select
            className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="shortlist">Shortlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
        </Field>
        <Field label="URL">
          <TextInput value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </Field>
        <Field label="Salary">
          <TextInput value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </Field>
        <Field label="Notes">
          <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
      </div>
    </Modal>
  );
};

// =========================
// Local-only Move Dialog (no API)
// =========================
const MoveJobDialog = ({ isOpen, onClose, onMove, job }) => {
  const [status, setStatus] = useState(job?.status || "shortlist");
  useEffect(() => {
    setStatus(job?.status || "shortlist");
  }, [job]);

  if (!job) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Move "${job.title}"`}
      footer={
        <>
          <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
          <PrimaryBtn onClick={() => { onMove(job.id, status); onClose(); }}>Move</PrimaryBtn>
        </>
      }
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Select a new column:</p>
        <select
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="shortlist">Shortlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </Modal>
  );
};

// =========================
// Main Component (NO API — localStorage only)
// =========================
export default function JobTracker() {
  // Hydration-safe device hint
  const [isMobile, setIsMobile] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Columns state (persisted locally)
  const [columns, setColumns] = useState(() => {
    return initialColumns.map((c) => ({ ...c, jobs: [] }));
  });

  // dialogs
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("shortlist");
  const [editJob, setEditJob] = useState(null);

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [jobToMove, setJobToMove] = useState(null);

  // search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // --- Client-only effects
  useEffect(() => {
    setIsClient(true);

    const checkIsMobile = () => {
      const isSmall = window.innerWidth < 1200;
      const isTouch = "ontouchstart" in window || (navigator && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0));
      const isUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");
      setIsMobile(isSmall || isTouch || isUA);
    };

    // hydrate columns from localStorage (or seed with samples once)
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out "auto-apply" columns and migrate jobs
        const validColumnIds = new Set(initialColumns.map(col => col.id));
        const migratedColumns = parsed
          .filter(col => col.id !== "auto-apply") // Remove auto-apply columns
          .map(col => ({
            ...col,
            jobs: col.jobs.map(job => {
              // Migrate jobs with "auto-apply" status to "applied"
              if (job.status === "auto-apply") {
                return { ...job, status: "applied" };
              }
              return job;
            }).filter(job => validColumnIds.has(job.status)) // Only keep jobs with valid statuses
          }))
          .filter(col => validColumnIds.has(col.id)); // Only keep valid columns

        // Ensure all initial columns exist
        const finalColumns = initialColumns.map(initialCol => {
          const existing = migratedColumns.find(col => col.id === initialCol.id);
          return existing || { ...initialCol, jobs: [] };
        });

        setColumns(finalColumns);
      } catch {
        seedWithSamples();
      }
    } else {
      seedWithSamples();
    }

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist columns
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

  const availableFilters = ["Remote", "On-site", "Hybrid", "High Salary", "Recent"];

  const toggleFilter = (f) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const filteredColumns = useMemo(() => {
    if (!searchQuery && activeFilters.length === 0) return columns;
    return columns.map((column) => ({
      ...column,
      jobs: column.jobs.filter((job) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          job.title.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          (job.notes || "").toLowerCase().includes(q);
        const matchesFilters =
          activeFilters.length === 0 ||
          activeFilters.every((filter) => {
            switch (filter) {
              case "Remote":
                return job.location.toLowerCase().includes("remote");
              case "On-site":
                return !job.location.toLowerCase().includes("remote") && !job.location.toLowerCase().includes("hybrid");
              case "Hybrid":
                return job.location.toLowerCase().includes("hybrid");
              case "High Salary":
                return job.salary && /120|130|150/.test(job.salary);
              case "Recent":
                return (job.notes || "").toLowerCase().includes("recent");
              default:
                return true;
            }
          });
        return matchesSearch && matchesFilters;
      }),
    }));
  }, [columns, searchQuery, activeFilters]);

  // =========================
  // DND handlers
  // =========================
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result || {};
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find((c) => c.id === source.droppableId);
    const destColumn = columns.find((c) => c.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    const dragged = sourceColumn.jobs.find((j) => j.id === draggableId);
    if (!dragged) return;

    const updatedJob = { ...dragged, status: destColumn.id };

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, jobs: col.jobs.filter((j) => j.id !== draggableId) };
        } else if (col.id === destination.droppableId) {
          const newJobs = [...col.jobs];
          newJobs.splice(destination.index, 0, updatedJob);
          return { ...col, jobs: newJobs };
        }
        return col;
      })
    );
  }, [columns]);

  // =========================
  // CRUD (local only)
  // =========================
  const openAddFor = useCallback((columnId) => {
    setSelectedColumn(columnId);
    setEditJob(null);
    setIsAddJobOpen(true);
  }, []);

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

  const openMoveDialog = useCallback((job) => {
    setJobToMove(job);
    setIsMoveDialogOpen(true);
  }, []);

  const handleMoveJob = useCallback((jobId, newStatus) => {
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

  // Early loading shell (avoids SSR hydration mismatch)
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Job Tracker</h2>
            <p className="text-sm text-gray-500">Track your job applications through every stage</p>
          </div>
        </div>
        <div className="rounded-lg border p-6 text-gray-500">Loading…</div>
      </div>
    );
  }

  const sameStyle = {
    accent: "#D9D9D9",
    bg: "linear-gradient(135deg, #2370FF 0%, #B2CDFF 100%)",
    border: "border-blue-100",
  };

  const columnStyles = {
    shortlist: sameStyle,
    applied: sameStyle,
    interview: sameStyle,
    rejected: sameStyle,
  };

  // Helper function to safely get column styles with fallback
  const getColumnStyle = (columnId) => {
    return columnStyles[columnId] || sameStyle;
  };


  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4">
          {/* Search */}
          <div className="relative flex h-[54px] w-[320px] items-center justify-between rounded-lg border border-gray-200 bg-white px-3 shadow-sm">
            <Search className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search Jobs…"
              className="w-full flex-1 border-none bg-transparent text-sm text-gray-600 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-blue-700 to-blue-900 px-3 py-2 text-sm font-medium text-white shadow-inner"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-medium text-white/90">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {(searchQuery || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="rounded-lg bg-gray-100 p-2.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {["Remote", "On-site", "Hybrid", "High Salary", "Recent"].map((f) => {
                const active = activeFilters.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${active
                        ? "bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-inner"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filter Summary */}
      {(searchQuery || activeFilters.length > 0) && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs md:text-sm text-blue-900">
            <span className="font-semibold">
              {filteredColumns.reduce((t, c) => t + c.jobs.length, 0)} jobs
            </span>
            {searchQuery && (
              <>
                <span className="sm:ml-1 hidden sm:inline">
                  matching "{searchQuery}"
                </span>
                <span className="sm:hidden"> found</span>
              </>
            )}
            {activeFilters.length > 0 &&
              ` with ${activeFilters.length} filter${activeFilters.length > 1 ? "s" : ""
              }`}
          </p>
        </div>
      )}

      {/* Job Board */}
 {isMobile ? (
  // ---------- MOBILE VIEW ----------
  <div className="rounded-lg">
    {filteredColumns.map((column) => (
      <div
        key={column.id}
        className={`rounded-xl bg-white shadow-sm mb-4`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl relative overflow-hidden  px-4 py-3"
          style={{
            backgroundImage: "url('/Decoration.png')",
            backgroundSize: "100px auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top left",
          }}
        >
          <h3 className="text-base font-semibold text-[#002A79] relative z-10">
            {column.title}
          </h3>

          <span className="text-sm font-medium text-[#6B7A99] relative z-10 pr-4">
            {column.jobs.length}
          </span>
        </div>

        {/* Card content */}
        <div className="p-4">
          {column.jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-8 text-gray-400">
              <div className="mb-1 text-3xl opacity-60">📋</div>
              <p className="text-sm font-medium text-[#002A79]">No jobs yet</p>
              <p className="text-center text-xs text-[#6477B4]">
                Drag jobs here or click "Add job"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {column.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onUpdate={handleSaveJob}
                  onDelete={handleDeleteJob}
                  onMove={() => openMoveDialog(job)}
                  isMobile={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
  // ---------- DESKTOP VIEW ----------
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="overflow-x-auto px-2 rounded-lg">
      <div className="flex min-w-max gap-4 lg:gap-6">
        {filteredColumns.map((column) => (
          <div key={column.id} className="w-72 flex-shrink-0 lg:w-80">
            <div
              className={`h-full rounded-xl border ${getColumnStyle(column.id).border} shadow-sm transition-shadow hover:shadow-md`}
            >
              {/* Header with decoration */}
              <div
                className="relative flex justify-between items-center rounded-t-xl pb-6 pt-0 p-2"
                style={{
                  backgroundImage: "url('/Decoration.png')",
                  backgroundSize: "40% auto",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top left",
                }}
              >
                <h3 className="text-base font-semibold text-[#002A79] relative z-10 p-4">
                  {column.title}
                </h3>

                <span className="text-sm font-medium text-[#6B7A99] relative z-10 pr-4">
                  {column.jobs.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[500px] space-y-3 p-4 transition-all duration-200 ${
                      snapshot.isDraggingOver
                        ? "border-2 border-dashed border-blue-300 bg-blue-50/50"
                        : ""
                    }`}
                  >
                    {column.jobs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
                        <div className="mb-1 text-5xl opacity-40">📋</div>
                        <p className="text-sm font-medium text-[#002A79]">
                          No jobs yet
                        </p>
                        <p className="text-center text-xs text-[#6477B4]">
                          Drag jobs here or click "Add job"
                        </p>
                      </div>
                    ) : (
                      column.jobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`${
                                snap.isDragging
                                  ? "z-50 scale-105 rotate-1 opacity-90 shadow-xl"
                                  : "hover:scale-[1.02] hover:shadow-md"
                              } transition-all duration-200`}
                            >
                              <JobCard
                                job={job}
                                onUpdate={handleSaveJob}
                                onDelete={handleDeleteJob}
                                onMove={() => openMoveDialog(job)}
                                isMobile={false}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DragDropContext>
)}

      {/* Dialogs */}
      <AddJobDialog
        isOpen={isAddJobOpen}
        onClose={() => {
          setIsAddJobOpen(false);
          setEditJob(null);
        }}
        onSave={handleSaveJob}
        defaultStatus={selectedColumn}
        jobToEdit={editJob}
      />

      <MoveJobDialog
        isOpen={isMoveDialogOpen}
        onClose={() => {
          setIsMoveDialogOpen(false);
          setJobToMove(null);
        }}
        onMove={handleMoveJob}
        job={jobToMove}
      />
    </div>
  );
  

}

// Optional named export (so you can `import { JobTracker } ...` as well)
export { JobTracker };
