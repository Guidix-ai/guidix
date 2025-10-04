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

      {/* Minimal Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 border-gray-200 focus:border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs"
                  style={{backgroundColor: 'var(--brand-secondary)', color: 'var(--brand-primary)'}}
                >
                  {activeFilters.length}
                </Badge>
              )}
            </Button>

            {/* Clear All */}
            {(searchQuery || activeFilters.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {availableFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilters.includes(filter) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter)}
                  className={`text-xs ${
                    activeFilters.includes(filter)
                      ? 'text-white border-0'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  style={activeFilters.includes(filter)
                    ? {background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'}
                    : {}}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Minimal Results Summary */}
      {(searchQuery || activeFilters.length > 0) && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-700">
            <span className="font-medium">
              {filteredColumns.reduce((total, col) => total + col.jobs.length, 0)} jobs
            </span>
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilters.length > 0 && ` with ${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {/* Kanban Board */}
      {isMobile ? (
        // Mobile View: Clean and minimal
        <div className="space-y-5">
          {filteredColumns.map((column) => {
            const columnColors = {
              shortlist: {
                border: 'border-blue-200',
                bg: 'bg-blue-50/50',
                accent: 'var(--brand-primary)'
              },
              'auto-apply': {
                border: 'border-purple-200',
                bg: 'bg-purple-50/50',
                accent: '#8B5CF6'
              },
              applied: {
                border: 'border-amber-200',
                bg: 'bg-amber-50/50',
                accent: '#F59E0B'
              },
              interview: {
                border: 'border-green-200',
                bg: 'bg-green-50/50',
                accent: '#10B981'
              },
              rejected: {
                border: 'border-red-200',
                bg: 'bg-red-50/50',
                accent: '#EF4444'
              }
            };

            return (
              <Card key={column.id} className={`border ${columnColors[column.id]?.border} shadow-sm`}>
                <CardHeader className={`pb-4 ${columnColors[column.id]?.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{backgroundColor: columnColors[column.id]?.accent}}
                      ></div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddJob(column.id)}
                    className="w-full mt-3 border-dashed border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add job
                  </Button>
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
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-max pb-4">
              {filteredColumns.map((column) => {
                const columnStyles = {
                  shortlist: {
                    accent: 'var(--brand-primary)',
                    bg: 'var(--brand-secondary-lightest)',
                    border: 'border-blue-100'
                  },
                  'auto-apply': {
                    accent: '#8B5CF6',
                    bg: '#F3F4F6',
                    border: 'border-purple-100'
                  },
                  applied: {
                    accent: '#F59E0B',
                    bg: '#FFFBEB',
                    border: 'border-amber-100'
                  },
                  interview: {
                    accent: '#10B981',
                    bg: '#ECFDF5',
                    border: 'border-green-100'
                  },
                  rejected: {
                    accent: '#EF4444',
                    bg: '#FEF2F2',
                    border: 'border-red-100'
                  }
                };

                return (
                  <div key={column.id} className="w-80 flex-shrink-0">
                    <Card className={`h-full border ${columnStyles[column.id]?.border} shadow-sm hover:shadow-md transition-shadow`}>
                      {/* Column Header */}
                      <CardHeader
                        className="pb-4 border-b"
                        style={{backgroundColor: columnStyles[column.id]?.bg}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{backgroundColor: columnStyles[column.id]?.accent}}
                            ></div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddJob(column.id)}
                          className="w-full mt-3 border-dashed border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add job
                        </Button>
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
