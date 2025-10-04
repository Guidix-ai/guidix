import styles from "@/app/styles/components/MoveJobDialog.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Move } from "lucide-react";

export function MoveJobDialog({ isOpen, onClose, onMove, job, columns }) {
  if (!job) return null;

  const currentColumnTitle = columns.find(col => col.id === job.status)?.title || "Unknown";

  const handleMove = (newStatus) => {
    onMove(job.id, newStatus);
  };

  const statusColors = {
    shortlist: "bg-blue-100 text-blue-800 border-blue-200",
    "auto-apply": "bg-purple-100 text-purple-800 border-purple-200",
    applied: "bg-yellow-100 text-yellow-800 border-yellow-200",
    interview: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Move Job
          </DialogTitle>
          <DialogDescription>
            Move "{job.title}" to a different stage
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Current Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Currently in:</p>
            <Badge
              variant="outline"
              className={`text-sm border ${statusColors[job.status]}`}
            >
              {currentColumnTitle}
            </Badge>
          </div>

          {/* Move Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 mb-3">Move to:</p>
            {columns
              .filter(column => column.id !== job.status)
              .map((column) => (
                <Button
                  key={column.id}
                  variant="outline"
                  onClick={() => handleMove(column.id)}
                  className={`w-full justify-start text-left h-auto p-3 border-2 hover:border-gray-400 ${statusColors[column.id]}`}
                >
                  <div>
                    <div className="font-medium">{column.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {column.id === 'shortlist' && 'Jobs you want to apply to'}
                      {column.id === 'auto-apply' && 'Jobs to be auto-applied'}
                      {column.id === 'applied' && 'Applications submitted'}
                      {column.id === 'interview' && 'Interview scheduled'}
                      {column.id === 'rejected' && 'Application declined'}
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}