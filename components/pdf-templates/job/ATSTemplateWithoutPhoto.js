import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

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

// Utility function to format date from YYYY-MM to Month Year
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

/**
 * ATS-COMPLIANT TEMPLATE WITHOUT PHOTO
 * Template ID: ats-template-without-photo
 * Backend ID: TMPL_001
 *
 * Key features:
 * - Single column layout
 * - Standard fonts (Helvetica)
 * - Proper heading hierarchy
 * - Standard section names
 * - Consistent spacing (1.5 line height)
 * - Black text on white background
 * - Standard margins (50pt = ~0.7 inch)
 * - Simple bullet points
 * - No headers/footers/text boxes
 * - No graphics or photos
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
    marginTop: 12,
    marginBottom: 10,
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
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  projectName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  projectDemo: {
    fontSize: 9,
    color: "#2370FF",
    textDecoration: "underline",
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
  projectDate: {
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 3,
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

const ATSTemplateWithoutPhoto = ({ resumeData, templateId }) => {
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
    <Document
      title={`${personalInfo.firstName || 'Resume'} ${personalInfo.lastName || ''} - ATS Template`}
      author={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
      subject="Professional Resume"
      creator="Resume Builder"
    >
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
          {(personalInfo.github || personalInfo.portfolio || personalInfo.website) && (
            <View style={styles.contactLine}>
              <Text style={styles.contactInfo}>
                {personalInfo.github && `GitHub: ${personalInfo.github}`}
                {personalInfo.portfolio && `${personalInfo.github ? ' | ' : ''}Portfolio: ${personalInfo.portfolio}`}
                {personalInfo.website && `${personalInfo.github || personalInfo.portfolio ? ' | ' : ''}Website: ${personalInfo.website}`}
              </Text>
            </View>
          )}
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
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
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
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Expected"}
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
            {projects.map((project, index) => {
              console.log(`Project ${index}:`, project);
              console.log(`Project ${index} liveLink:`, project.liveLink, typeof project.liveLink);
              return (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {project.liveLink && (
                    <Link
                      src={project.liveLink.startsWith('http') ? project.liveLink : `https://${project.liveLink}`}
                      style={styles.projectDemo}
                    >
                      Demo
                    </Link>
                  )}
                </View>
                {(project.startDate || project.endDate) && (
                  <Text style={styles.projectDate}>
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </Text>
                )}
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
            )})}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Template metadata for identification
ATSTemplateWithoutPhoto.templateId = "ats-template-without-photo";
ATSTemplateWithoutPhoto.backendId = "TMPL_001";
ATSTemplateWithoutPhoto.displayName = "ATS Professional Template";
ATSTemplateWithoutPhoto.hasPhoto = false;

export default ATSTemplateWithoutPhoto;
