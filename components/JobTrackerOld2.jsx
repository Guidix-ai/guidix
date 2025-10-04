import { useState, useCallback, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, X } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { AddJobDialog } from "@/components/AddJobDialog";

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
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === updatedJob.status
          ? {
              ...column,
              jobs: column.jobs.map((job) =>
                job.id === updatedJob.id ? updatedJob : job
              ),
            }
          : {
              ...column,
              jobs: column.jobs.filter((job) => job.id !== updatedJob.id),
            }
      )
    );
  }, []);

  const handleDeleteJob = useCallback((jobId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        jobs: column.jobs.filter((job) => job.id !== jobId),
      }))
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Job Tracker</h2>
          <p className="text-muted-foreground text-lg">
            Track your job applications through every stage
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search jobs by title, location, or notes..."
              className="pl-12 pr-4 py-3 w-full text-base border-2 focus:border-blue-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>

            {/* Clear All */}
            {(searchQuery || activeFilters.length > 0) && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 mb-4">
              {availableFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={
                    activeFilters.includes(filter) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleFilter(filter)}
                  className="text-sm font-medium"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Active filters:</span>
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="ml-2 hover:text-gray-900"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {(searchQuery || activeFilters.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            Showing{" "}
            {filteredColumns.reduce((total, col) => total + col.jobs.length, 0)}{" "}
            jobs
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilters.length > 0 &&
              ` with filters: ${activeFilters.join(", ")}`}
          </p>
        </div>
      )}

      {/* Responsive Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Mobile View - Stacked Cards */}
        <div className="block lg:hidden space-y-8">
          {filteredColumns.map((column) => {
            const columnColors = {
              shortlist:
                "border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent",
              "auto-apply":
                "border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-transparent",
              applied:
                "border-l-yellow-500 bg-gradient-to-r from-yellow-50/50 to-transparent",
              interview:
                "border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent",
              rejected:
                "border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent",
            };

            return (
              <div key={column.id} className="w-full">
                <Card
                  className={`w-full border-l-8 ${
                    columnColors[column.id]
                  } shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  <CardHeader className="pb-4 px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        {column.title}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="text-base px-4 py-2 font-bold"
                      >
                        {column.jobs.length}
                      </Badge>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleAddJob(column.id)}
                      className="w-full h-12 border-dashed border-2 hover:border-solid transition-all duration-200 font-semibold text-base"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Job
                    </Button>
                  </CardHeader>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <CardContent
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-6 min-h-[150px] px-8 pb-8 transition-colors duration-300 ${
                          snapshot.isDraggingOver
                            ? "bg-blue-50/80 border-t-4 border-blue-300"
                            : ""
                        }`}
                      >
                        {column.jobs.length === 0 &&
                        !snapshot.isDraggingOver ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="text-6xl mb-4 opacity-50">📋</div>
                            <p className="text-lg font-semibold mb-2">
                              No jobs yet
                            </p>
                            <p className="text-sm text-center">
                              Drag jobs here or click "Add New Job"
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
                                  className={`w-full transition-all duration-300 ${
                                    snapshot.isDragging
                                      ? "opacity-80 rotate-2 scale-105 shadow-2xl z-50"
                                      : "hover:scale-[1.02]"
                                  }`}
                                >
                                  <JobCard
                                    job={job}
                                    onUpdate={handleUpdateJob}
                                    onDelete={handleDeleteJob}
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

        {/* Desktop View - Full Horizontal Kanban */}
        <div className="hidden lg:block">
          <div className="flex gap-8 overflow-x-auto pb-8">
            {filteredColumns.map((column) => {
              const columnColors = {
                shortlist: {
                  border: "border-l-blue-500",
                  bg: "bg-gradient-to-b from-blue-50 to-blue-25",
                  header: "bg-gradient-to-r from-blue-500 to-blue-600",
                  badge: "bg-blue-100 text-blue-800",
                },
                "auto-apply": {
                  border: "border-l-purple-500",
                  bg: "bg-gradient-to-b from-purple-50 to-purple-25",
                  header: "bg-gradient-to-r from-purple-500 to-purple-600",
                  badge: "bg-purple-100 text-purple-800",
                },
                applied: {
                  border: "border-l-yellow-500",
                  bg: "bg-gradient-to-b from-yellow-50 to-yellow-25",
                  header: "bg-gradient-to-r from-yellow-500 to-yellow-600",
                  badge: "bg-yellow-100 text-yellow-800",
                },
                interview: {
                  border: "border-l-green-500",
                  bg: "bg-gradient-to-b from-green-50 to-green-25",
                  header: "bg-gradient-to-r from-green-500 to-green-600",
                  badge: "bg-green-100 text-green-800",
                },
                rejected: {
                  border: "border-l-red-500",
                  bg: "bg-gradient-to-b from-red-50 to-red-25",
                  header: "bg-gradient-to-r from-red-500 to-red-600",
                  badge: "bg-red-100 text-red-800",
                },
              };

              const colors = columnColors[column.id];

              return (
                <div key={column.id} className="flex-shrink-0 w-96">
                  <Card
                    className={`h-full ${colors.border} border-l-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${colors.bg}`}
                  >
                    {/* Column Header */}
                    <div
                      className={`${colors.header} text-white px-8 py-6 rounded-t-lg`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-xl font-bold text-white">
                          {column.title}
                        </CardTitle>
                        <Badge
                          className={`${colors.badge} font-bold px-3 py-1 text-sm`}
                        >
                          {column.jobs.length}
                        </Badge>
                      </div>
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => handleAddJob(column.id)}
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-200 font-semibold h-11"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Job
                      </Button>
                    </div>

                    {/* Column Content */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <CardContent
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`p-6 space-y-6 min-h-[700px] transition-all duration-300 ${
                            snapshot.isDraggingOver
                              ? "bg-blue-100/50 border-4 border-dashed border-blue-400"
                              : "border-4 border-transparent"
                          }`}
                        >
                          {column.jobs.length === 0 &&
                          !snapshot.isDraggingOver ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                              <div className="text-7xl mb-6 opacity-40">📋</div>
                              <p className="text-xl font-semibold mb-2">
                                No jobs yet
                              </p>
                              <p className="text-base text-center px-4 leading-relaxed">
                                Drag jobs here or click
                                <br />
                                "Add Job" above
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
                                    className={`transition-all duration-300 ${
                                      snapshot.isDragging
                                        ? "opacity-90 rotate-3 scale-110 shadow-2xl z-50"
                                        : "hover:scale-[1.03] hover:shadow-lg"
                                    }`}
                                  >
                                    <JobCard
                                      job={job}
                                      onUpdate={handleUpdateJob}
                                      onDelete={handleDeleteJob}
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

      <AddJobDialog
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onSave={handleSaveJob}
        defaultStatus={selectedColumn}
      />
    </div>
  );
}
