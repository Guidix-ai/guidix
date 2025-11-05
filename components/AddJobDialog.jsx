import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
};

const FormField = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  isTextarea = false,
  rows = 3,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label
      htmlFor={name}
      style={{
        color: colorTokens.title,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        lineHeight: "20px",
      }}
    >
      {label}
    </label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          minHeight: rows * 32,
          padding: 16,
          backgroundColor: colorTokens.bgLight,
          borderRadius: 16,
          border: 'none',
          boxShadow:
            "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
          outline: "1px solid #C7D6ED",
          fontSize: 14,
          color: "rgb(15, 38, 120)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          lineHeight: "125%",
          letterSpacing: "-0.32px",
          resize: "vertical",
        }}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 56,
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 6,
          paddingBottom: 6,
          backgroundColor: colorTokens.bgLight,
          borderRadius: 16,
          border: 'none',
          boxShadow:
            "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
          outline: "1px solid #C7D6ED",
          fontSize: 14,
          color: "rgb(15, 38, 120)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          lineHeight: "125%",
          letterSpacing: "-0.32px",
        }}
      />
    )}
  </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label
      htmlFor={name}
      style={{
        color: colorTokens.title,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        lineHeight: "20px",
      }}
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        height: 56,
        minHeight: 56,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: colorTokens.bgLight,
        borderRadius: 16,
        border: 'none',
        boxShadow:
          "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
        outline: "1px solid #C7D6ED",
        fontSize: 14,
        color: "rgb(15, 38, 120)",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        lineHeight: "125%",
        letterSpacing: "-0.32px",
        cursor: "pointer",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export function AddJobDialog({ isOpen, onClose, onSave, defaultStatus }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    status: defaultStatus,
    url: "",
    notes: "",
    documents: [],
    jobDescription: "",
    salary: "",
  });

  const handleSave = () => {
    // Set defaults for empty fields
    const jobData = {
      ...formData,
      title: formData.title || "Empty",
      location: formData.location || "Empty",
    };

    onSave(jobData);

    // Reset form
    setFormData({
      title: "",
      location: "",
      status: defaultStatus,
      url: "",
      notes: "",
      documents: [],
      jobDescription: "",
      salary: "",
    });
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: "",
      location: "",
      status: defaultStatus,
      url: "",
      notes: "",
      documents: [],
      jobDescription: "",
      salary: "",
    });
    onClose();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const statusOptions = [
    { value: "shortlist", label: "Shortlist" },
    { value: "auto-apply", label: "Auto Apply" },
    { value: "applied", label: "Applied" },
    { value: "interview", label: "Interview" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <style jsx>{`
        input::placeholder,
        textarea::placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .dialog-content {
            padding: 24px !important;
          }
          .dialog-title {
            font-size: 24px !important;
            line-height: 32px !important;
          }
          .button-container {
            flex-direction: column !important;
          }
          .button-container button {
            width: 100% !important;
          }
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dialog-content"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px",
            border: "none",
            boxShadow: "0px 12px 32px -4px rgba(35,112,255,0.3), 0px 2px 2px 0 rgba(0,19,88,0.1)",
          }}
        >
          <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h2
                className="dialog-title"
                style={{
                  color: colorTokens.title,
                  fontSize: 32,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: "40px",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Add New Job
              </h2>
              <p
                style={{
                  color: colorTokens.paragraph,
                  fontSize: 14,
                  fontWeight: 400,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: "20px",
                  margin: 0,
                }}
              >
                Add a new job opportunity to track through your application process
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Job Title and Location Row */}
              <div
                className="form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <FormField
                  name="title"
                  label="Job Title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <FormField
                  name="location"
                  label="Location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              {/* Status and Salary Row */}
              <div
                className="form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <SelectField
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
                <FormField
                  name="salary"
                  label="Salary"
                  placeholder="e.g., $80,000 - $100,000"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>

              {/* Job URL */}
              <FormField
                name="url"
                label="Job Posting URL"
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={formData.url}
                onChange={handleInputChange}
              />

              {/* Notes */}
              <FormField
                name="notes"
                label="Notes"
                placeholder="Add any notes about this job opportunity..."
                value={formData.notes}
                onChange={handleInputChange}
                isTextarea={true}
                rows={3}
              />

              {/* Job Description */}
              <FormField
                name="jobDescription"
                label="Job Description"
                placeholder="Paste the job description here..."
                value={formData.jobDescription}
                onChange={handleInputChange}
                isTextarea={true}
                rows={4}
              />

              {/* Buttons */}
              <div
                className="button-container"
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 8,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    display: "inline-flex",
                    padding: "12px 24px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    color: colorTokens.paragraph,
                    textAlign: "center",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "125%",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    padding: "12px 24px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    border: "1px solid rgba(35, 112, 255, 0.30)",
                    background: "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                    boxShadow:
                      "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                    color: "#FFFFFF",
                    textAlign: "center",
                    textShadow:
                      "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "125%",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
