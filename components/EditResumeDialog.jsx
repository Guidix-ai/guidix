import styles from "@/app/styles/components/EditResumeDialog.module.css";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export function EditResumeDialog({ isOpen, onClose, onSave, resume }) {
  const [formData, setFormData] = useState({
    title: "",
    completion: 0,
    previewText: "",
    status: "draft",
  });

  useEffect(() => {
    if (resume) {
      setFormData({
        title: resume.title || "",
        completion: resume.completion || 0,
        previewText: resume.previewText || "",
        status: resume.status || "draft",
      });
    }
  }, [resume]);

  const handleSave = () => {
    if (!resume) return;

    const updatedResume = {
      ...resume,
      ...formData,
      lastEdited: "just now",
    };

    onSave(updatedResume);
    onClose();
  };

  const handleClose = () => {
    if (resume) {
      setFormData({
        title: resume.title || "",
        completion: resume.completion || 0,
        previewText: resume.previewText || "",
        status: resume.status || "draft",
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
          <DialogDescription>
            Update your resume details and content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Software Engineer Resume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion">Completion %</Label>
              <Select
                value={formData.completion.toString()}
                onValueChange={(value) => setFormData({ ...formData, completion: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% - Just Started</SelectItem>
                  <SelectItem value="25">25% - Basic Info</SelectItem>
                  <SelectItem value="50">50% - Half Done</SelectItem>
                  <SelectItem value="71">71% - Nearly Complete</SelectItem>
                  <SelectItem value="85">85% - Almost Ready</SelectItem>
                  <SelectItem value="100">100% - Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview">Preview Text</Label>
            <Textarea
              id="preview"
              value={formData.previewText}
              onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
              placeholder="Enter a brief preview of your resume content..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">
              This text will be displayed as a preview on the resume card.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}