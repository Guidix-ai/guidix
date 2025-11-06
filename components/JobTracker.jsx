import { useState, useCallback, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    return initialColumns.map((column) => ({
      ...column,
      jobs: sampleJobs.filter((job) => job.status === column.id),
    }));
  });

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("shortlist");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [jobToMove, setJobToMove] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [isClient, setIsClient] = useState(false);

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

  // COLUMN background (on the Card itself). It cannot overlap content due to z-index plan.
  const columnBackgroundClass =
    "relative overflow-hidden " + // card is the stacking context host
    // soft blue glow
    "before:content-[''] before:absolute before:top-0 before:left-0 before:w-[260px] before:h-[180px] " +
    "before:z-0 before:pointer-events-none " +
    "before:bg-[radial-gradient(130px_95px_at_70px_48px,rgba(100,167,255,0.32)_0%,rgba(100,167,255,0.18)_45%,rgba(100,167,255,0.08)_75%,transparent_100%)] " +
    "before:[mask-image:radial-gradient(170px_120px_at_95px_60px,#000_0%,transparent_82%)] " +
    // dotted layer
    "after:content-[''] after:absolute after:top-0 after:left-0 after:w-[260px] after:h-[180px] " +
    "after:z-0 after:pointer-events-none after:opacity-60 after:text-[#a5c6ff] " +
    "after:bg-[radial-gradient(currentColor_1px,transparent_1px)] after:[background-size:8px_8px] " +
    "after:[mask-image:radial-gradient(170px_120px_at_95px_60px,#000_0%,transparent_82%)]";

  // All visible content inside card should be above z-0 background
  const sectionContentClass = "relative z-[1]";

  const handleDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const sourceCol = columns.find((c) => c.id === source.droppableId);
      const moved = sourceCol.jobs.find((j) => j.id === draggableId);
      const updated = { ...moved, status: destination.droppableId };

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
    },
    [columns]
  );

  const handleAddJob = (id) => {
    setSelectedColumn(id);
    setIsAddJobOpen(true);
  };

  const handleSaveJob = (newJob) => {
    const job = { ...newJob, id: Date.now().toString() };
    setColumns((prev) =>
      prev.map((c) =>
        c.id === job.status ? { ...c, jobs: [...c.jobs, job] } : c
      )
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

  const handleMoveJob = (id, status) => {
    const col = columns.find((c) => c.jobs.some((j) => j.id === id));
    const job = col.jobs.find((j) => j.id === id);
    const updated = { ...job, status };

    setColumns((prev) =>
      prev.map((c) =>
        c.id === status
          ? { ...c, jobs: [...c.jobs, updated] }
          : { ...c, jobs: c.jobs.filter((j) => j.id !== id) }
      )
    );

    setIsMoveDialogOpen(false);
    setJobToMove(null);
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
              className="flex-1 outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              <Filter className="inline w-4 h-4 mr-1" />
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleAddJob("shortlist")}
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              <Plus className="inline w-4 h-4 mr-1" />
              Add Job
            </button>

            {(searchQuery || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="px-2 py-2 rounded-md bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
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
                  className={
                    activeFilters.includes(f)
                      ? "px-3 py-1 rounded-md text-white bg-blue-600 text-sm"
                      : "px-3 py-1 rounded-md border text-gray-600 text-sm"
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanban */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredColumns.map((col) => (
            <Card key={col.id} className={`border shadow-sm ${columnBackgroundClass}`}>
              <div className={sectionContentClass}>
                <CardHeader className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-blue-900">
                      {col.title}
                    </CardTitle>
                    <Badge className="bg-white/80 border text-xs">
                      {col.jobs.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4">
                  {col.jobs.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm">No jobs</p>
                  ) : (
                    col.jobs.map((job) => (
                    <div key={job.id} className="relative z-[50]">
                        <JobCard
                          job={job}
                          isMobile={true}
                          onUpdate={handleUpdateJob}
                          onDelete={handleDeleteJob}
                          onMove={() => openMoveDialog(job)}
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {filteredColumns.map((col) => (
              <div key={col.id} className="w-72 flex-shrink-0">
                <Card className={`border shadow-sm hover:shadow-md transition-shadow ${columnBackgroundClass}`}>
                  <div className={sectionContentClass}>
                    <CardHeader className="px-4 pt-4 pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-blue-900 font-semibold">
                          {col.title}
                        </CardTitle>
                        <Badge className="bg-white/80 border text-xs">
                          {col.jobs.length}
                        </Badge>
                      </div>
                    </CardHeader>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <CardContent
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 space-y-3 min-h-[400px] transition-colors ${
                            snapshot.isDraggingOver ? "bg-blue-50/40" : ""
                          }`}
                        >
                          {col.jobs.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm">No jobs</p>
                          ) : (
                            col.jobs.map((job, index) => (
                              <Draggable key={job.id} draggableId={job.id} index={index}>
                                {(providedDrag, snapshotDrag) => (
<div
  ref={providedDrag.innerRef}
  {...providedDrag.draggableProps}
  {...providedDrag.dragHandleProps}
  className={`relative z-[50] ${
    snapshotDrag.isDragging ? "scale-[1.02] z-[60]" : ""
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
                  </div>
                </Card>
              </div>
            ))}
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
