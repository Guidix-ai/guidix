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

export function JobCard({ job, onUpdate, onDelete, onMove, isMobile, accentColor }) {
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
    shortlist: "bg-[#D4F4DD] text-[#2D7738] border-transparent",
    // "auto-apply": "bg-purple-100 text-purple-800 border-purple-200",
    applied: "bg-[#FEF3C7] text-[#92400E] border-transparent",
    interview: "bg-[#DBEAFE] text-[#1E40AF] border-transparent",
    rejected: "bg-[#FEE2E2] text-[#991B1B] border-transparent",
  };

  const statusLabels = {
    shortlist: "Shortlist",
    // "auto-apply": "Auto Apply",
    applied: "Applied",
    interview: "Interview",
    rejected: "Rejected",
  };

  if (isEditing) {
    return (
      <Card className="w-full border border-gray-200">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xl font-bold p-2" style={{ color: '#1E3A8A' }}>Edit Job</Label>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 hover:bg-gray-100">
                <Save className="h-4 w-4" style={{ color: '#5B6B9D' }} />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0 hover:bg-gray-100">
                <X className="h-4 w-4" style={{ color: '#5B6B9D' }} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Job Title</Label>
              <Input
                id="title"
                value={editedJob.title}
                onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Location</Label>
              <Input
                id="location"
                value={editedJob.location}
                onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
                className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Status</Label>
              <Select
                value={editedJob.status}
                onValueChange={(value) => setEditedJob({ ...editedJob, status: value })}
              >
                <SelectTrigger className="text-sm border-none focus:ring-0 focus:ring-offset-0" style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  height: '44px'
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlist">Shortlist</SelectItem>
                  {/* <SelectItem value="auto-apply">Auto Apply</SelectItem> */}
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Job URL</Label>
              <Input
                id="url"
                value={editedJob.url}
                onChange={(e) => setEditedJob({ ...editedJob, url: e.target.value })}
                placeholder="https://..."
                className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
            </div>

            <div>
              <Label htmlFor="salary" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Salary</Label>
              <Input
                id="salary"
                value={editedJob.salary}
                onChange={(e) => setEditedJob({ ...editedJob, salary: e.target.value })}
                placeholder="e.g., $80,000 - $100,000"
                className="text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-semibold mb-2 block" style={{ color: '#1E3A8A' }}>Notes</Label>
              <Textarea
                id="notes"
                value={editedJob.notes}
                onChange={(e) => setEditedJob({ ...editedJob, notes: e.target.value })}
                className="text-sm min-h-[60px] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: '#E6E8F5',
                  color: '#5B6B9D',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base truncate" style={{ color: '#3B5998' }}>
                  {job.title || "Untitled"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-5 w-5 p-0 hover:bg-transparent flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" style={{ color: '#8B9DC3' }} />
                  ) : (
                    <ChevronDown className="h-4 w-4" style={{ color: '#8B9DC3' }} />
                  )}
                </Button>
              </div>
              <p className="text-sm truncate mt-1" style={{ color: '#8B9DC3' }}>
                {job.location || "No location"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0 ml-2">
                  <MoreHorizontal className="h-4 w-4" style={{ color: '#8B9DC3' }} />
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
                  className="[#FE566B]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between mt-3">
            <Badge
              className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[job.status]}`}
            >
              {statusLabels[job.status].toLowerCase()}
            </Badge>

            {job.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(job.url, '_blank')}
                className="h-7 px-2 text-sm font-medium"
                style={{ color: '#8B9DC3' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3B5998'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8B9DC3'}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View
              </Button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {job.salary && (
                <div>
                  <Label className="text-xs font-medium" style={{ color: '#002A79' }}>Salary</Label>
                  <p className="text-sm mt-1" style={{ color: '#6477B4' }}>{job.salary}</p>
                </div>
              )}

              {job.notes && (
                <div>
                  <Label className="text-xs font-medium" style={{ color: '#002A79' }}>Notes</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap" style={{ color: '#6477B4' }}>{job.notes}</p>
                </div>
              )}

              {job.jobDescription && (
                <div>
                  <Label className="text-xs font-medium" style={{ color: '#002A79' }}>Description</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap line-clamp-3" style={{ color: '#6477B4' }}>
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