import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";

export function JobCard({ job, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);

  const handleSave = () => {
    onUpdate(editedJob);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedJob(job);
    setIsEditing(false);
  };

  const statusColors = {
    shortlist: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "auto-apply": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    applied: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    interview: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  const statusLabels = {
    shortlist: "Shortlist",
    "auto-apply": "Auto Apply",
    applied: "Applied",
    interview: "Interview",
    rejected: "Rejected",
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Edit Job</Label>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="title" className="text-xs">Job Title</Label>
              <Input
                id="title"
                value={editedJob.title}
                onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input
                id="location"
                value={editedJob.location}
                onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-xs">Status</Label>
              <Select
                value={editedJob.status}
                onValueChange={(value) => setEditedJob({ ...editedJob, status: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlist">Shortlist</SelectItem>
                  <SelectItem value="auto-apply">Auto Apply</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url" className="text-xs">Job URL</Label>
              <Input
                id="url"
                value={editedJob.url}
                onChange={(e) => setEditedJob({ ...editedJob, url: e.target.value })}
                placeholder="https://..."
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="salary" className="text-xs">Salary</Label>
              <Input
                id="salary"
                value={editedJob.salary}
                onChange={(e) => setEditedJob({ ...editedJob, salary: e.target.value })}
                placeholder="e.g., $80,000 - $100,000"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs">Notes</Label>
              <Textarea
                id="notes"
                value={editedJob.notes}
                onChange={(e) => setEditedJob({ ...editedJob, notes: e.target.value })}
                className="text-sm min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-xs">Job Description</Label>
              <Textarea
                id="description"
                value={editedJob.jobDescription}
                onChange={(e) => setEditedJob({ ...editedJob, jobDescription: e.target.value })}
                className="text-sm min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 rounded-xl bg-white hover:bg-gradient-to-r hover:from-white hover:to-blue-50/30">
      <CardContent className="p-5 lg:p-6">
        {/* Compact View Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base lg:text-lg truncate text-gray-900">
                {job.title || "Empty"}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 truncate mt-1">
                {job.location || "Empty"}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-9 w-9 p-0 hover:bg-blue-100 rounded-full transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(job.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
            <Badge
              variant="outline"
              className={`text-sm font-semibold px-3 py-1 self-start border-2 ${statusColors[job.status]}`}
            >
              {statusLabels[job.status]}
            </Badge>
            
            {job.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(job.url, '_blank')}
                className="h-9 px-4 text-sm font-medium self-start sm:self-auto border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Job</span>
                <span className="sm:hidden">View</span>
              </Button>
            )}
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="space-y-4 pt-4 mt-4 border-t-2 border-gray-100">
              {job.salary && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <Label className="text-sm font-semibold text-green-800 block mb-1">Salary Range</Label>
                  <p className="text-base font-bold text-green-900">{job.salary}</p>
                </div>
              )}
              
              {job.notes && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <Label className="text-sm font-semibold text-blue-800 block mb-2">Notes</Label>
                  <p className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">{job.notes}</p>
                </div>
              )}
              
              {job.jobDescription && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <Label className="text-sm font-semibold text-gray-800 block mb-2">Job Description</Label>
                  <p className="text-sm whitespace-pre-wrap line-clamp-4 text-gray-700 leading-relaxed">{job.jobDescription}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}