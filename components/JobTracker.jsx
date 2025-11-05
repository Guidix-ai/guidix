import { useState, useCallback, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, X, Move } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { AddJobDialog } from "@/components/AddJobDialog";
import { MoveJobDialog } from "@/components/MoveJobDialog";
import styles from "@/app/styles/components/JobTracker.module.css";

const initialColumns = [
  { id: "shortlist", title: "Shortlist", jobs: [] },
  { id: "auto-apply", title: "Auto Apply", jobs: [] },
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

export function JobTracker() {
  const [columns, setColumns] = useState(() => {
    const columnsWithJobs = initialColumns.map((column) => ({
      ...column,
      jobs: sampleJobs.filter((job) => job.status === column.id),
    }));
    return columnsWithJobs;
  });

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("shortlist");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [jobToMove, setJobToMove] = useState(null);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent hydration issues
  const [isClient, setIsClient] = useState(false);

  // Detect mobile/tablet devices
  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      // Be aggressive about detecting touch devices
      const isSmallScreen = window.innerWidth < 1200; // Increased threshold
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsMobile(isSmallScreen || isTouchDevice || isMobileUA);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const availableFilters = [
    "Remote",
    "On-site",
    "Hybrid",
    "High Salary",
    "Recent",
  ];

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredColumns = useMemo(() => {
    if (!searchQuery && activeFilters.length === 0) {
      return columns;
    }

    return columns.map((column) => ({
      ...column,
      jobs: column.jobs.filter((job) => {
        const matchesSearch =
          !searchQuery ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.notes &&
            job.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilters =
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
                return (
                  job.salary &&
                  (job.salary.includes("120") ||
                    job.salary.includes("130") ||
                    job.salary.includes("150"))
                );
              case "Recent":
                return job.notes && job.notes.toLowerCase().includes("recent");
              default:
                return true;
            }
          });

        return matchesSearch && matchesFilters;
      }),
    }));
  }, [columns, searchQuery, activeFilters]);

  const handleDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      if (!sourceColumn || !destColumn) return;

      const draggedJob = sourceColumn.jobs.find(
        (job) => job.id === draggableId
      );
      if (!draggedJob) return;

      const updatedJob = { ...draggedJob, status: destination.droppableId };

      setColumns((prevColumns) =>
        prevColumns.map((column) => {
          if (column.id === source.droppableId) {
            return {
              ...column,
              jobs: column.jobs.filter((job) => job.id !== draggableId),
            };
          } else if (column.id === destination.droppableId) {
            const newJobs = [...column.jobs];
            newJobs.splice(destination.index, 0, updatedJob);
            return { ...column, jobs: newJobs };
          }
          return column;
        })
      );
    },
    [columns]
  );

  const handleAddJob = useCallback((columnId) => {
    setSelectedColumn(columnId);
    setIsAddJobOpen(true);
  }, []);

  const handleSaveJob = useCallback((newJob) => {
    const job = { ...newJob, id: Date.now().toString() };
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === job.status
          ? { ...column, jobs: [...column.jobs, job] }
          : column
      )
    );
    setIsAddJobOpen(false);
  }, []);

  const handleUpdateJob = useCallback((updatedJob) => {
    setColumns((prevColumns) => {
      // Find the original job to check if status changed
      const originalJob = prevColumns
        .flatMap((col) => col.jobs)
        .find((job) => job.id === updatedJob.id);

      if (!originalJob) return prevColumns;

      // If status hasn't changed, just update the job in place
      if (originalJob.status === updatedJob.status) {
        return prevColumns.map((column) =>
          column.jobs.some((job) => job.id === updatedJob.id)
            ? {
                ...column,
                jobs: column.jobs.map((job) =>
                  job.id === updatedJob.id ? updatedJob : job
                ),
              }
            : column
        );
      }

      // If status changed, move the job to the new column
      return prevColumns.map((column) => {
        if (column.id === updatedJob.status) {
          // Add to new column
          return {
            ...column,
            jobs: [...column.jobs, updatedJob],
          };
        } else {
          // Remove from old column
          return {
            ...column,
            jobs: column.jobs.filter((job) => job.id !== updatedJob.id),
          };
        }
      });
    });
  }, []);

  const handleDeleteJob = useCallback((jobId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        jobs: column.jobs.filter((job) => job.id !== jobId),
      }))
    );
  }, []);

  const handleMoveJob = useCallback(
    (jobId, newStatus) => {
      const sourceColumn = columns.find((col) =>
        col.jobs.some((job) => job.id === jobId)
      );
      if (!sourceColumn) return;

      const job = sourceColumn.jobs.find((job) => job.id === jobId);
      if (!job) return;

      const updatedJob = { ...job, status: newStatus };

      setColumns((prevColumns) =>
        prevColumns.map((column) => {
          if (column.id === sourceColumn.id) {
            return {
              ...column,
              jobs: column.jobs.filter((job) => job.id !== jobId),
            };
          } else if (column.id === newStatus) {
            return {
              ...column,
              jobs: [...column.jobs, updatedJob],
            };
          }
          return column;
        })
      );

      setIsMoveDialogOpen(false);
      setJobToMove(null);
    },
    [columns]
  );

  const openMoveDialog = useCallback((job) => {
    setJobToMove(job);
    setIsMoveDialogOpen(true);
  }, []);

  // Show loading state until client-side detection is complete
  if (!isClient) {
    return (
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Job Tracker
            </h2>
            <p className={styles.subtitle}>
              Track your job applications through every stage
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div
            className="relative flex items-center"
            style={{
              width: '320px',
              height: '54px',
              minHeight: '54px',
              justifyContent: 'space-between',
              paddingTop: '8px',
              paddingRight: '8px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              borderRadius: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
              boxShadow: `
                var(--ShadowPositioningNone) var(--ShadowPositioningNone) var(--ShadowBlur2XSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark15),
                var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurExtraSmall) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4),
                var(--ShadowPositioningNone) var(--ShadowPositioningMedium) var(--ShadowBlurMedium) var(--ShadowSpreadNone) var(--ColorsOverlayColorsDark4),
                var(--ShadowPositioningNone) var(--ShadowPositioningNegativeMedium) var(--ShadowBlurExtraSmall) var(--ShadowBlurNone) var(--ColorsOverlayColorsDark10) inset
              `.replace(/\s+/g, ' ').trim()
            }}
          >
            <Search className="text-gray-400 w-5 h-5 flex-shrink-0" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search Jobs..."
              className="flex-1 outline-none border-none bg-transparent"
              style={{
                color: '#6B7280',
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                padding: '0',
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                background: "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                boxShadow: "0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset, 0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset",
                color: "#FFFFFF",
                textAlign: "center",
                textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "125%",
              }}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <span
                  className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                  }}
                >
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Clear All */}
            {(searchQuery || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#6B7280",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#E5E7EB";
                  e.target.style.color = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#F3F4F6";
                  e.target.style.color = "#6B7280";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {availableFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className="transition-all hover:opacity-90"
                  style={activeFilters.includes(filter)
                    ? {
                        display: "inline-flex",
                        padding: "8px 12px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "10px",
                        background: "linear-gradient(180deg, #0349cc 0%, #073b9c 100%)",
                        boxShadow: "0 -1.5px 1px 0 rgba(6, 51, 165, 0.37) inset, 0 1.5px 1px 0 rgba(255, 255, 255, 0.24) inset",
                        color: "#FFFFFF",
                        textAlign: "center",
                        textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "125%",
                      }
                    : {
                        display: "inline-flex",
                        padding: "8px 12px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        background: "#FFFFFF",
                        color: "#6B7280",
                        textAlign: "center",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "125%",
                      }
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {(searchQuery || activeFilters.length > 0) && (
        <div
          className="rounded-lg px-4 py-3 border"
          style={{
            backgroundColor: "#EFF6FF",
            borderColor: "#DBEAFE",
          }}
        >
          <p className="text-xs md:text-sm" style={{ color: "#1E40AF" }}>
            <span className="font-semibold">
              {filteredColumns.reduce((total, col) => total + col.jobs.length, 0)} jobs
            </span>
            {searchQuery && <span className="hidden sm:inline"> matching "{searchQuery}"</span>}
            {searchQuery && <span className="sm:hidden"> found</span>}
            {activeFilters.length > 0 && ` with ${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {/* Kanban Board */}
      {isMobile ? (
        // Mobile View: Clean and minimal
        <div className="space-y-4 md:space-y-5">
          {filteredColumns.map((column) => {
            const columnColors = {
              shortlist: {
                border: 'border-blue-200',
                bg: '#E3EFFF',
                accent: '#64A7FF'
              },
              'auto-apply': {
                border: 'border-purple-200',
                bg: '#E5E3FF',
                accent: '#8B5CF6'
              },
              applied: {
                border: 'border-amber-200',
                bg: '#FFFAE9',
                accent: '#EFC42C'
              },
              interview: {
                border: 'border-green-200',
                bg: '#EEF9F5',
                accent: '#74D184'
              },
              rejected: {
                border: 'border-red-200',
                bg: '#FFF5F6',
                accent: '#FE566B'
              }
            };

            return (
              <Card key={column.id} className={`border ${columnColors[column.id]?.border} shadow-sm`}>
                <CardHeader className="pb-3 md:pb-4 px-4 pt-4" style={{backgroundColor: columnColors[column.id]?.bg}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{backgroundColor: columnColors[column.id]?.accent}}
                      ></div>
                      <CardTitle className="text-base md:text-lg font-semibold" style={{color: '#002A79'}}>
                        {column.title}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-white/80 text-gray-600 text-xs px-2 py-1"
                    >
                      {column.jobs.length}
                    </Badge>
                  </div>
                  <button
                    onClick={() => handleAddJob(column.id)}
                    className="w-full mt-3 transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{
                      display: "inline-flex",
                      padding: "10px 16px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      border: "1px solid rgba(35, 112, 255, 0.30)",
                      background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                      boxShadow: "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                      color: "#FFFFFF",
                      textAlign: "center",
                      textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: "125%",
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Job
                  </button>
                </CardHeader>

                <CardContent className="space-y-3 min-h-[120px] p-4">
                  {column.jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <div className="text-3xl mb-3 opacity-60">📋</div>
                      <p className="text-sm font-medium text-gray-500">No jobs yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add job" to get started</p>
                    </div>
                  ) : (
                    column.jobs.map((job) => (
                      <div key={job.id} className="relative">
                        <JobCard
                          job={job}
                          onUpdate={handleUpdateJob}
                          onDelete={handleDeleteJob}
                          onMove={() => openMoveDialog(job)}
                          isMobile={true}
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // Desktop/Tablet View: Elegant drag and drop
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="flex gap-4 lg:gap-6 min-w-max pb-4">
              {filteredColumns.map((column) => {
                const columnStyles = {
                  shortlist: {
                    accent: '#64A7FF',
                    bg: '#E3EFFF',
                    border: 'border-blue-100'
                  },
                  'auto-apply': {
                    accent: '#8B5CF6',
                    bg: '#E5E3FF',
                    border: 'border-purple-100'
                  },
                  applied: {
                    accent: '#EFC42C',
                    bg: '#FFFAE9',
                    border: 'border-amber-100'
                  },
                  interview: {
                    accent: '#74D184',
                    bg: '#EEF9F5',
                    border: 'border-green-100'
                  },
                  rejected: {
                    accent: '#FE566B',
                    bg: '#FFF5F6',
                    border: 'border-red-100'
                  }
                };

                return (
                  <div key={column.id} className="w-72 lg:w-80 flex-shrink-0">
                    <Card className={`h-full border ${columnStyles[column.id]?.border} shadow-sm hover:shadow-md transition-shadow`}>
                      {/* Column Header */}
                      <CardHeader
                        className="pb-3 md:pb-4 px-4 pt-4 border-b"
                        style={{backgroundColor: columnStyles[column.id]?.bg}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{backgroundColor: columnStyles[column.id]?.accent}}
                            ></div>
                            <CardTitle className="text-base lg:text-lg font-semibold" style={{color: '#002A79'}}>
                              {column.title}
                            </CardTitle>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-white/80 text-gray-600 text-xs px-3 py-1 border"
                          >
                            {column.jobs.length}
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleAddJob(column.id)}
                          className="w-full mt-3 transition-all hover:opacity-90 flex items-center justify-center gap-2"
                          style={{
                            display: "inline-flex",
                            padding: "10px 16px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            border: "1px solid rgba(35, 112, 255, 0.30)",
                            background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                            boxShadow: "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                            color: "#FFFFFF",
                            textAlign: "center",
                            textShadow: "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "125%",
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add Job
                        </button>
                      </CardHeader>

                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <CardContent
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-3 min-h-[500px] p-4 transition-all duration-200 ${
                              snapshot.isDraggingOver
                                ? "bg-blue-50/50 border-2 border-dashed border-blue-300"
                                : ""
                            }`}
                          >
                            {column.jobs.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <div className="text-5xl mb-4 opacity-40">📋</div>
                                <p className="text-sm font-medium text-gray-500">No jobs yet</p>
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                  Drag jobs here or click "Add job"
                                </p>
                              </div>
                            ) : (
                              column.jobs.map((job, index) => (
                                <Draggable
                                  key={job.id}
                                  draggableId={job.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`transition-all duration-200 ${
                                        snapshot.isDragging
                                          ? "opacity-90 rotate-1 scale-105 shadow-xl z-50"
                                          : "hover:scale-[1.02] hover:shadow-md"
                                      }`}
                                    >
                                      <JobCard
                                        job={job}
                                        onUpdate={handleUpdateJob}
                                        onDelete={handleDeleteJob}
                                        isMobile={false}
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
                );
              })}
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
