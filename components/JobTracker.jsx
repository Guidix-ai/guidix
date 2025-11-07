import { useState, useCallback, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/JobCard";
import { AddJobDialog } from "@/components/AddJobDialog";
import { MoveJobDialog } from "@/components/MoveJobDialog";
import styles from "@/app/styles/components/JobTracker.module.css";
import { getUserJobStatuses, setJobStatus } from "@/services/jobService";

/* ---------------- data ---------------- */
const initialColumns = [
  { id: "shortlist", title: "Shortlist", jobs: [] },
  { id: "auto-apply", title: "Auto Apply", jobs: [] },
  { id: "applied", title: "Applied", jobs: [] },
  { id: "interview", title: "Interview", jobs: [] },
  { id: "rejected", title: "Rejected", jobs: [] },
];

// Status mapping from API to local column IDs
const statusMapping = {
  'wishlist': 'shortlist',
  'viewed': 'shortlist',
  'applied': 'applied',
  'interviewed': 'interview',
  'interviewing': 'interview',
  'accepted': 'interview',
  'rejected': 'rejected',
  'uninterested': 'rejected',
};

// Map column IDs back to API status
const apiStatusMap = {
  'shortlist': 'wishlist',
  'auto-apply': 'wishlist',
  'applied': 'applied',
  'interview': 'interviewing',
  'rejected': 'rejected',
};

/* ---------- corner background under header (glow + dots) ---------- */
function CornerBG() {
  return (
    <>
      {/* soft glow */}
      <div
        className="
          absolute top-[10px] left-[12px] w-[300px] h-[120px] z-0 pointer-events-none
          bg-[radial-gradient(140px_95px_at_110px_20px,rgba(100,167,255,0.34)_0%,rgba(100,167,255,0.20)_45%,rgba(100,167,255,0.10)_70%,transparent_100%)]
          [mask-image:radial-gradient(220px_150px_at_135px_52px,#000_0%,rgba(0,0,0,0.9)_45%,transparent_85%)]
        "
      />
      {/* dotted layer */}
      <div
        className="
          absolute top-[10px] left-[12px] w-[300px] h-[120px] z-0 pointer-events-none opacity-55
          bg-[radial-gradient(#a5c6ff_1px,transparent_1px)]
          [background-size:8px_8px]
          [mask-image:radial-gradient(220px_150px_at_135px_52px,#000_0%,rgba(0,0,0,0.9)_45%,transparent_85%)]
        "
      />
    </>
  );
}

export function JobTracker() {
  const [columns, setColumns] = useState(initialColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("shortlist");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [jobToMove, setJobToMove] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Fetch job data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all job statuses for the user
        const response = await getUserJobStatuses(null, 100, 0);

        if (response.success && response.data) {
          // Initialize columns
          const jobsByStatus = initialColumns.map((column) => ({
            ...column,
            jobs: []
          }));

          // Map jobs to columns based on their status
          response.data.forEach((jobStatus) => {
            const job = jobStatus.job;
            const localStatus = statusMapping[jobStatus.status] || 'shortlist';

            const transformedJob = {
              id: job.id,
              title: job.title || "Untitled",
              location: job.location || "No location",
              status: localStatus,
              url: job.application_url || "",
              notes: "",
              documents: [],
              jobDescription: job.description || "",
              salary: job.salary_min && job.salary_max
                ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                : job.salary_min
                ? `$${job.salary_min.toLocaleString()}+`
                : "Not specified",
              company: job.company || "Unknown",
              jobType: job.job_type || "Full-time",
              experienceLevel: job.experience_level || "Mid-level",
              matchScore: job.match_score || null,
              isWishlisted: jobStatus.status === 'wishlist',
              isNotInterested: jobStatus.status === 'uninterested',
            };

            const columnIndex = jobsByStatus.findIndex(col => col.id === localStatus);
            if (columnIndex !== -1) {
              jobsByStatus[columnIndex].jobs.push(transformedJob);
            }
          });

          setColumns(jobsByStatus);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load jobs');
        // Keep showing empty columns on error
        setColumns(initialColumns);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Detect mobile/tablet
  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      const isSmall = window.innerWidth < 1200;
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      const uaMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|webOS|BlackBerry/i.test(
        navigator.userAgent
      );
      setIsMobile(isSmall || isTouch || uaMobile);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const availableFilters = ["Remote", "On-site", "Hybrid", "High Salary", "Recent"];

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredColumns = useMemo(() => {
    if (!searchQuery && activeFilters.length === 0) return columns;
    return columns.map((column) => ({
      ...column,
      jobs: column.jobs.filter((job) => {
        const search =
          !searchQuery ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.notes && job.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const filterMatch =
          activeFilters.length === 0 ||
          activeFilters.every((filter) => {
            switch (filter) {
              case "Remote":
                return job.location.toLowerCase().includes("remote");
              case "On-site":
                return (
                  !job.location.toLowerCase().includes("remote") &&
                  !job.location.toLowerCase().includes("hybrid")
                );
              case "Hybrid":
                return job.location.toLowerCase().includes("hybrid");
              case "High Salary":
                return job.salary && job.salary.match(/120|130|150/);
              case "Recent":
                return job.notes && job.notes.toLowerCase().includes("recent");
              default:
                return true;
            }
          });

        return search && filterMatch;
      }),
    }));
  }, [columns, searchQuery, activeFilters]);

  const handleDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result || {};
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const sourceCol = columns.find((c) => c.id === source.droppableId);
      if (!sourceCol) return;

      const moved = sourceCol.jobs.find((j) => j.id === draggableId);
      if (!moved) return;

      const updated = { ...moved, status: destination.droppableId };

      // Optimistically update UI
      const prevColumns = columns;
      setColumns((prev) =>
        prev.map((c) => {
          if (c.id === source.droppableId) {
            return { ...c, jobs: c.jobs.filter((j) => j.id !== draggableId) };
          }
          if (c.id === destination.droppableId) {
            const arr = [...c.jobs];
            arr.splice(destination.index, 0, updated);
            return { ...c, jobs: arr };
          }
          return c;
        })
      );

      // Update backend
      try {
        const apiStatus = apiStatusMap[destination.droppableId] || 'wishlist';
        await setJobStatus(draggableId, apiStatus);
      } catch (err) {
        console.error('Error updating job status:', err);
        // Revert on error
        setColumns(prevColumns);
      }
    },
    [columns]
  );

  const handleAddJob = (id) => {
    setSelectedColumn(id);
    setIsAddJobOpen(true);
  };

  const handleSaveJob = (newJob) => {
    const job = {
      ...newJob,
      id: Date.now().toString(),
      company: "Manual Entry",
      matchScore: null,
    };
    setColumns((prev) =>
      prev.map((c) => (c.id === job.status ? { ...c, jobs: [...c.jobs, job] } : c))
    );
    setIsAddJobOpen(false);
  };

  const handleUpdateJob = (updatedJob) => {
    setColumns((prev) => {
      const old = prev.flatMap((c) => c.jobs).find((j) => j.id === updatedJob.id);
      if (!old) return prev;
      if (old.status === updatedJob.status) {
        return prev.map((c) =>
          c.jobs.some((j) => j.id === updatedJob.id)
            ? { ...c, jobs: c.jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)) }
            : c
        );
      }
      return prev.map((c) =>
        c.id === updatedJob.status
          ? { ...c, jobs: [...c.jobs, updatedJob] }
          : { ...c, jobs: c.jobs.filter((j) => j.id !== updatedJob.id) }
      );
    });
  };

  const handleDeleteJob = (id) => {
    setColumns((prev) =>
      prev.map((c) => ({ ...c, jobs: c.jobs.filter((j) => j.id !== id) }))
    );
  };

  const openMoveDialog = (job) => {
    setJobToMove(job);
    setIsMoveDialogOpen(true);
  };

  const handleMoveJob = async (id, status) => {
    const col = columns.find((c) => c.jobs.some((j) => j.id === id));
    if (!col) return;
    const job = col.jobs.find((j) => j.id === id);
    if (!job) return;

    const updated = { ...job, status };

    // Optimistically update UI
    const prevColumns = columns;
    setColumns((prev) =>
      prev.map((c) =>
        c.id === status
          ? { ...c, jobs: [...c.jobs, updated] }
          : { ...c, jobs: c.jobs.filter((j) => j.id !== id) }
      )
    );

    setIsMoveDialogOpen(false);
    setJobToMove(null);

    // Update backend
    try {
      const apiStatus = apiStatusMap[status] || 'wishlist';
      await setJobStatus(id, apiStatus);
    } catch (err) {
      console.error('Error updating job status:', err);
      // Revert on error
      setColumns(prevColumns);
    }
  };

  if (!isClient) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Job Tracker</h2>
          <p className={styles.subtitle}>Track your job applications</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Loading…</div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Failed to load jobs</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div
            className="relative flex items-center"
            style={{
              width: "320px",
              height: "54px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#fff",
              padding: "8px 12px",
            }}
          >
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              placeholder="Search Jobs..."
              className="flex-1 outline-none bg-transparent text-gray-600 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                background: "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                boxShadow:
                  "0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset, 0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset",
                color: "#FFFFFF",
                textShadow:
                  "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "125%",
                border: "none",
                cursor: "pointer",
              }}
              className="transition-all hover:opacity-90"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/30">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleAddJob("shortlist")}
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                background: "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                boxShadow:
                  "0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset, 0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset",
                color: "#FFFFFF",
                textShadow:
                  "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "125%",
                border: "none",
                cursor: "pointer",
              }}
              className="transition-all hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Job</span>
            </button>

            {(searchQuery || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: "#6B7280" }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {availableFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  style={
                    activeFilters.includes(f)
                      ? {
                          padding: "8px 12px",
                          borderRadius: "10px",
                          background: "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                          color: "#FFFFFF",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                          cursor: "pointer",
                        }
                      : {
                          padding: "8px 12px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          background: "#FFFFFF",
                          color: "#6B7280",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }
                  }
                  className="transition-all hover:opacity-90"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {(searchQuery || activeFilters.length > 0) && (
        <div className="rounded-lg px-4 py-3 border" style={{ backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }}>
          <p className="text-sm" style={{ color: "#1E40AF" }}>
            <span className="font-semibold">
              {filteredColumns.reduce((t, c) => t + c.jobs.length, 0)} jobs
            </span>
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilters.length > 0 &&
              ` with ${activeFilters.length} filter${activeFilters.length > 1 ? "s" : ""}`}
          </p>
        </div>
      )}

      {/* Job Board */}
      {isMobile ? (
        /* Mobile */
        <div className="space-y-4">
          {filteredColumns.map((col) => (
            <Card key={col.id} className="border border-blue-200 shadow-sm">
              <CardHeader
                className="pb-3 px-4 pt-4"
                style={{
                  backgroundImage: "url(/jobtrackerheader.svg)",
                  backgroundPosition: "0 center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "auto 150%",
                }}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold" style={{ color: "#002A79" }}>
                    {col.title}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white/80 text-xs px-2 py-1" style={{ color: "#64A7FF" }}>
                    {col.jobs.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[120px] p-4">
                {col.jobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <div className="text-3xl mb-3 opacity-60">📋</div>
                    <p className="text-sm font-medium text-gray-500">No jobs yet</p>
                  </div>
                ) : (
                  col.jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onUpdate={handleUpdateJob}
                      onDelete={handleDeleteJob}
                      onMove={() => openMoveDialog(job)}
                      isMobile={true}
                      accentColor="#64A7FF"
                    />
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Desktop */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="flex gap-4 lg:gap-6 min-w-max pb-4">
              {filteredColumns.map((col) => (
                <div key={col.id} className="w-72 lg:w-80 flex-shrink-0">
                  <Card className="h-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader
                      className="pb-3 px-4 pt-4"
                      style={{
                        backgroundImage: "url(/jobtrackerheader.svg)",
                        backgroundPosition: "0 center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "auto 150%",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold" style={{ color: "#002A79" }}>
                          {col.title}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white/80 text-xs px-3 py-1 border" style={{ color: "#64A7FF" }}>
                          {col.jobs.length}
                        </Badge>
                      </div>
                    </CardHeader>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <CardContent
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-3 min-h-[500px] p-4 ${
                            snapshot.isDraggingOver ? "bg-blue-50/50 border-2 border-dashed border-blue-300" : ""
                          }`}
                        >
                          {col.jobs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                              <div className="text-5xl mb-4 opacity-40">📋</div>
                              <p className="text-sm font-medium text-gray-500">No jobs yet</p>
                              <p className="text-xs text-gray-400 mt-2">Drag jobs here</p>
                            </div>
                          ) : (
                            col.jobs.map((job, idx) => (
                              <Draggable key={job.id} draggableId={job.id} index={idx}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={snapshot.isDragging ? "opacity-90 rotate-1 scale-105 shadow-xl" : ""}
                                  >
                                    <JobCard
                                      job={job}
                                      onUpdate={handleUpdateJob}
                                      onDelete={handleDeleteJob}
                                      isMobile={false}
                                      accentColor="#64A7FF"
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </CardContent>
                      )}
                    </Droppable>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      <AddJobDialog
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onSave={handleSaveJob}
        defaultStatus={selectedColumn}
      />

      <MoveJobDialog
        isOpen={isMoveDialogOpen}
        onClose={() => {
          setIsMoveDialogOpen(false);
          setJobToMove(null);
        }}
        onMove={handleMoveJob}
        job={jobToMove}
        columns={initialColumns}
      />
    </div>
  );
}
