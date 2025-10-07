import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Utility function to strip markdown
const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#+\s/g, "")
    .trim();
};

/**
 * ATS-COMPLIANT TEMPLATE - FIXED SPACING
 *
 * Key fixes:
 * - Consistent section spacing
 * - Proper header margins
 * - Better bullet point alignment
 * - Removed unnecessary dividers
 * - Balanced whitespace
 */

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Header Section
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 12,
    color: "#000000",
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.6,
  },
  contactLine: {
    marginBottom: 3,
  },
  // Section Styles
  section: {
    marginTop: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 3,
  },
  // Summary Section
  summaryText: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.6,
    textAlign: "left",
    marginTop: 2,
  },
  // Experience Section
  experienceItem: {
    marginBottom: 14,
  },
  jobPosition: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  companyName: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  jobDate: {
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 4,
    marginLeft: 15,
    lineHeight: 1.5,
  },
  // Education Section
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  institution: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
  },
  // Skills Section
  skillsContainer: {
    flexDirection: "column",
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
  },
  // Projects Section
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  projectTech: {
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
  },
  // Certifications Section
  certItem: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 10,
    color: "#000000",
  },
});

const ATSTemplateWithoutPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = "",
    certifications = [],
  } = resumeData || {};

  // Group skills by category if they have category property
  const groupedSkills = skills.reduce((acc, skill) => {
    if (typeof skill === "object" && skill.category) {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name || skill);
    } else {
      if (!acc["General"]) acc["General"] = [];
      acc["General"].push(
        typeof skill === "object" ? skill.name || skill : skill
      );
    }
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER - Contact Information */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName?.toUpperCase()}{" "}
            {personalInfo.lastName?.toUpperCase()}
          </Text>
          {personalInfo.title && (
            <Text style={styles.jobTitle}>{personalInfo.title}</Text>
          )}
          <View style={styles.contactLine}>
            <Text style={styles.contactInfo}>
              {personalInfo.email}
              {personalInfo.phone && ` | ${personalInfo.phone}`}
            </Text>
          </View>
          <View style={styles.contactLine}>
            <Text style={styles.contactInfo}>
              {personalInfo.location}
              {personalInfo.linkedin && ` | LinkedIn: ${personalInfo.linkedin}`}
            </Text>
          </View>
        </View>

        {/* PROFESSIONAL SUMMARY */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{stripMarkdown(summary)}</Text>
          </View>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobPosition}>{exp.position}</Text>
                <Text style={styles.companyName}>
                  {exp.company}
                  {exp.location && ` | ${exp.location}`}
                </Text>
                <Text style={styles.jobDate}>
                  {exp.startDate} - {exp.endDate || "Present"}
                </Text>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <View>
                    {exp.responsibilities.map((resp, idx) => (
                      <Text key={idx} style={styles.bulletPoint}>
                        • {stripMarkdown(resp)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>
                  {edu.degree}
                  {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                </Text>
                <Text style={styles.institution}>{edu.institution}</Text>
                <Text style={styles.eduDate}>
                  {edu.startDate} - {edu.endDate || "Expected"}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {Object.entries(groupedSkills).map(
                ([category, skillList], index) => (
                  <View key={index} style={styles.skillCategory}>
                    {category !== "General" && (
                      <Text style={styles.skillCategoryName}>{category}:</Text>
                    )}
                    <Text style={styles.skillsList}>
                      {skillList.join(" • ")}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certIssuer}>
                  {cert.issuer}
                  {cert.date && ` | ${cert.date}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    Technologies:{" "}
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : project.technologies}
                  </Text>
                )}
                {project.description && (
                  <Text style={styles.projectDesc}>
                    {stripMarkdown(project.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ATSTemplateWithoutPhoto;
