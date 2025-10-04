import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import styles from "@/app/styles/components/JobCard.module.css";
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
  Move,
} from "lucide-react";

export function JobCard({ job, onUpdate, onDelete, onMove, isMobile }) {
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
    shortlist: "bg-blue-100 text-blue-800 border-blue-200",
    "auto-apply": "bg-purple-100 text-purple-800 border-purple-200",
    applied: "bg-yellow-100 text-yellow-800 border-yellow-200",
    interview: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
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
      <Card className="w-full border border-gray-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-900">Edit Job</Label>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="title" className="text-xs text-gray-600">Job Title</Label>
              <Input
                id="title"
                value={editedJob.title}
                onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                className="text-sm mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-xs text-gray-600">Location</Label>
              <Input
                id="location"
                value={editedJob.location}
                onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
                className="text-sm mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-xs text-gray-600">Status</Label>
              <Select
                value={editedJob.status}
                onValueChange={(value) => setEditedJob({ ...editedJob, status: value })}
              >
                <SelectTrigger className="text-sm mt-1">
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
              <Label htmlFor="url" className="text-xs text-gray-600">Job URL</Label>
              <Input
                id="url"
                value={editedJob.url}
                onChange={(e) => setEditedJob({ ...editedJob, url: e.target.value })}
                placeholder="https://..."
                className="text-sm mt-1"
              />
            </div>

            <div>
              <Label htmlFor="salary" className="text-xs text-gray-600">Salary</Label>
              <Input
                id="salary"
                value={editedJob.salary}
                onChange={(e) => setEditedJob({ ...editedJob, salary: e.target.value })}
                placeholder="e.g., $80,000 - $100,000"
                className="text-sm mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs text-gray-600">Notes</Label>
              <Textarea
                id="notes"
                value={editedJob.notes}
                onChange={(e) => setEditedJob({ ...editedJob, notes: e.target.value })}
                className="text-sm min-h-[60px] mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {job.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 truncate mt-0.5">
                {job.location || "No location"}
              </p>
            </div>

            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {isMobile && onMove && (
                    <DropdownMenuItem onClick={() => onMove()}>
                      <Move className="h-4 w-4 mr-2" />
                      Move
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(job.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`text-xs border ${statusColors[job.status]}`}
            >
              {statusLabels[job.status]}
            </Badge>

            {job.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(job.url, '_blank')}
                className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {job.salary && (
                <div>
                  <Label className="text-xs text-gray-600 font-medium">Salary</Label>
                  <p className="text-sm text-gray-900 mt-1">{job.salary}</p>
                </div>
              )}

              {job.notes && (
                <div>
                  <Label className="text-xs text-gray-600 font-medium">Notes</Label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{job.notes}</p>
                </div>
              )}

              {job.jobDescription && (
                <div>
                  <Label className="text-xs text-gray-600 font-medium">Description</Label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap line-clamp-3">
                    {job.jobDescription}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}