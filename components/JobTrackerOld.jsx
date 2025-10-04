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
    salary: "$120,000 - $150,000"
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
    salary: "$100,000 - $130,000"
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
    salary: "$90,000 - $120,000"
  }
];

export function JobTracker() {
  const [columns, setColumns] = useState(() => {
    const columnsWithJobs = initialColumns.map(column => ({
      ...column,
      jobs: sampleJobs.filter(job => job.status === column.id)
    }));
    return columnsWithJobs;
  });

  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("shortlist");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const availableFilters = ["Remote", "On-site", "Hybrid", "High Salary", "Recent"];

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredColumns = useMemo(() => {
    if (!searchQuery && activeFilters.length === 0) {
      return columns;
    }

    return columns.map(column => ({
      ...column,
      jobs: column.jobs.filter(job => {
        const matchesSearch = !searchQuery ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.notes && job.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilters = activeFilters.length === 0 ||
          activeFilters.every(filter => {
            switch (filter) {
              case "Remote":
                return job.location.toLowerCase().includes("remote");
              case "On-site":
                return !job.location.toLowerCase().includes("remote") && !job.location.toLowerCase().includes("hybrid");
              case "Hybrid":
                return job.location.toLowerCase().includes("hybrid");
              case "High Salary":
                return job.salary && (job.salary.includes("120") || job.salary.includes("130") || job.salary.includes("150"));
              case "Recent":
                return job.notes && job.notes.toLowerCase().includes("recent");
              default:
                return true;
            }
          });

        return matchesSearch && matchesFilters;
      })
    }));
  }, [columns, searchQuery, activeFilters]);

  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    const draggedJob = sourceColumn.jobs.find(job => job.id === draggableId);
    if (!draggedJob) return;

    const updatedJob = { ...draggedJob, status: destination.droppableId };

    setColumns(prevColumns =>
      prevColumns.map(column => {
        if (column.id === source.droppableId) {
          return {
            ...column,
            jobs: column.jobs.filter(job => job.id !== draggableId)
          };
        } else if (column.id === destination.droppableId) {
          const newJobs = [...column.jobs];
          newJobs.splice(destination.index, 0, updatedJob);
          return { ...column, jobs: newJobs };
        }
        return column;
      })
    );
  }, [columns]);

  const handleAddJob = useCallback((columnId) => {
    setSelectedColumn(columnId);
    setIsAddJobOpen(true);
  }, []);

  const handleSaveJob = useCallback((newJob) => {
    const job = { ...newJob, id: Date.now().toString() };
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === job.status
          ? { ...column, jobs: [...column.jobs, job] }
          : column
      )
    );
    setIsAddJobOpen(false);
  }, []);

  const handleUpdateJob = useCallback((updatedJob) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === updatedJob.status
          ? {
              ...column,
              jobs: column.jobs.map(job =>
                job.id === updatedJob.id ? updatedJob : job
              )
            }
          : { ...column, jobs: column.jobs.filter(job => job.id !== updatedJob.id) }
      )
    );
  }, []);

  const handleDeleteJob = useCallback((jobId) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        jobs: column.jobs.filter(job => job.id !== jobId)
      }))
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Job Tracker</h2>
          <p className="text-muted-foreground">Track your job applications through every stage</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search jobs by title, location, or notes..."
              className="pl-10 pr-4 py-2.5 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
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
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {availableFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilters.includes(filter) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter)}
                  className="text-sm"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {activeFilters.map(filter => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="ml-1 hover:text-gray-900"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredColumns.reduce((total, col) => total + col.jobs.length, 0)} jobs
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilters.length > 0 && ` with filters: ${activeFilters.join(", ")}`}
          </p>
        </div>
      )}

      {/* Responsive Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Mobile View - Stacked Cards */}
        <div className="block md:hidden space-y-4">
          {filteredColumns.map((column) => (
            <div key={column.id} className="w-full">
              <Card className="w-full">
                <CardHeader className="pb-3 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {column.jobs.length}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddJob(column.id)}
                    className="w-full mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job
                  </Button>
                </CardHeader>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <CardContent
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-3 min-h-[80px] p-4 ${
                        snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      {column.jobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`w-full ${snapshot.isDragging ? "opacity-50 rotate-3 scale-105" : ""}`}
                            >
                              <JobCard
                                job={job}
                                onUpdate={handleUpdateJob}
                                onDelete={handleDeleteJob}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>

        {/* Tablet View - 2 Columns */}
        <div className="hidden md:block xl:hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {filteredColumns.slice(0, 3).map((column) => (
                <div key={column.id} className="w-full">
                  <Card className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {column.jobs.length}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddJob(column.id)}
                        className="w-full mt-2 text-sm"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Job
                      </Button>
                    </CardHeader>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <CardContent
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-3 min-h-[200px] ${
                            snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : ""
                          }`}
                        >
                          {column.jobs.map((job, index) => (
                            <Draggable key={job.id} draggableId={job.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={snapshot.isDragging ? "opacity-50" : ""}
                                >
                                  <JobCard
                                    job={job}
                                    onUpdate={handleUpdateJob}
                                    onDelete={handleDeleteJob}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardContent>
                      )}
                    </Droppable>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {filteredColumns.slice(3).map((column) => (
                <div key={column.id} className="w-full">
                  <Card className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {column.jobs.length}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddJob(column.id)}
                        className="w-full mt-2 text-sm"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Job
                      </Button>
                    </CardHeader>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <CardContent
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-3 min-h-[200px] ${
                            snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : ""
                          }`}
                        >
                          {column.jobs.map((job, index) => (
                            <Draggable key={job.id} draggableId={job.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={snapshot.isDragging ? "opacity-50" : ""}
                                >
                                  <JobCard
                                    job={job}
                                    onUpdate={handleUpdateJob}
                                    onDelete={handleDeleteJob}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardContent>
                      )}
                    </Droppable>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Full Horizontal Kanban */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-5 gap-4">
            {filteredColumns.map((column) => (
              <div key={column.id} className="w-full">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        {column.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {column.jobs.length}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddJob(column.id)}
                      className="w-full mt-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Job
                    </Button>
                  </CardHeader>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <CardContent
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-3 min-h-[500px] ${
                          snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        {column.jobs.map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? "opacity-50 rotate-2 scale-105 shadow-lg" : ""}
                              >
                                <JobCard
                                  job={job}
                                  onUpdate={handleUpdateJob}
                                  onDelete={handleDeleteJob}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
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

      <AddJobDialog
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onSave={handleSaveJob}
        defaultStatus={selectedColumn}
      />
    </div>
  );
}