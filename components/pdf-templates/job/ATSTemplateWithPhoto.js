import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
 * ATS-COMPLIANT TEMPLATE WITH PHOTO
 *
 * ATS Compliance Features:
 * - Single column layout (photo in header, doesn't break flow)
 * - Standard fonts (Helvetica)
 * - Proper heading hierarchy
 * - Standard section names
 * - Consistent spacing (1.4-1.5 line height)
 * - Black text on white background
 * - Standard margins (50pt = ~0.7 inch)
 * - Simple bullet points
 * - No headers/footers/text boxes
 * - Minimal graphics (only photo in header)
 *
 * Photo placement: Top-right of contact section (doesn't interfere with text flow)
 */

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  // Header Section with Photo
  headerContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  photoContainer: {
    width: 70,
    height: 70,
    marginLeft: 12,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    objectFit: "cover",
    border: "1px solid #000000",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 12,
    color: "#000000",
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
  },
  contactLine: {
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginVertical: 12,
  },
  // Section Styles
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  // Summary Section
  summaryText: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
    textAlign: "justify",
  },
  // Experience Section
  experienceItem: {
    marginBottom: 12,
  },
  jobPosition: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  companyName: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  jobDate: {
    fontSize: 10,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 3,
    marginLeft: 16,
    lineHeight: 1.5,
  },
  // Education Section
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  institution: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 10,
    color: "#000000",
    fontStyle: "italic",
  },
  // Skills Section
  skillsContainer: {
    flexDirection: "column",
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  skillsList: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.4,
  },
  // Projects Section
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  projectTech: {
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 3,
  },
  projectDesc: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
  },
  // Certifications Section
  certItem: {
    marginBottom: 8,
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

const ATSTemplateWithPhoto = ({ resumeData }) => {
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
        {/* HEADER - Contact Information with Photo */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
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
                {personalInfo.linkedin &&
                  ` | LinkedIn: ${personalInfo.linkedin}`}
              </Text>
            </View>
          </View>
          <View style={styles.photoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              style={styles.photo}
              src={personalInfo.photo || "/api/placeholder/70/70"}
            />
          </View>
        </View>

        <View style={styles.divider} />

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

export default ATSTemplateWithPhoto;
