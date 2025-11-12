import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
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

// Utility function to format date from YYYY-MM to Month Year
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year || !month) return dateStr;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

/**
 * ATS-COMPLIANT TEMPLATE WITHOUT PHOTO - TEST VERSION
 * Template ID: ats-template-without-photo-test
 *
 * This is a temporary test version for debugging
 */

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.2, // decreased by 0.3 from 1.5
  },
  // Header Section
  header: {
    marginBottom: 8,
    textAlign: "center",
  },
  name: {
    fontSize: 20, // main-header (name part): 20px
    fontWeight: 700, // bold
    color: "#111111", // Headings color
    letterSpacing: 1,
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    color: "#1A1A1A", // Subheadings color
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 10, // main-header (info/social-handles): 10px
    fontWeight: 300, // light
    color: "#444444", // Secondary info color
    lineHeight: 1.3, // decreased by 0.3 from 1.6
    marginBottom: 8,
  },
  contactLine: {
    marginBottom: 3,
  },
  // Section Styles
  section: {
    marginTop: 2,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14, // section-headings: 14px
    fontWeight: 600, // bold
    color: "#111111", // Headings color
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA", // Dividers color
    paddingBottom: 5,
  },
  // Summary Section
  summaryText: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#222222", // Body text color
    lineHeight: 1.3, // decreased by 0.3 from 1.6
    textAlign: "left",
    marginTop: 2,
  },
  // Experience Section
  experienceItem: {
    marginBottom: 5,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  jobPosition: {
    fontSize: 12, // section-subheading: 12px
    fontWeight: 600, // bold
    color: "#1A1A1A", // Subheadings color
    flex: 1,
  },
  companyName: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#1A1A1A", // Subheadings color
    marginBottom: 8,
  },
  jobDate: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#444444", // Secondary info color
    fontStyle: "italic",
  },
  bulletPoint: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#222222", // Body text color
    marginBottom: 4,
    // marginLeft: 15,
    lineHeight: 1.2, // decreased by 0.3 from 1.5
  },
  // Education Section
  educationItem: {
    marginBottom: 5,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  degree: {
    fontSize: 12, // section-subheading: 12px
    fontWeight: 600, // bold
    color: "#1A1A1A", // Subheadings color
    flex: 1,
  },
  institution: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#1A1A1A", // Subheadings color
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#444444", // Secondary info color
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
    fontSize: 12, // section-subheading: 12px
    fontWeight: 600, // bold
    color: "#1A1A1A", // Subheadings color
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#222222", // Body text color
    lineHeight: 1.2, // decreased by 0.3 from 1.5
  },
  // Projects Section
  projectItem: {
    marginBottom: 5,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  projectName: {
    fontSize: 12, // section-subheading: 12px
    fontWeight: 600, // bold
    color: "#1A1A1A", // Subheadings color
    flex: 1,
  },
  projectDemo: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#1A73E8", // Hyperlinks color (Google blue)
    // textDecoration: "underline",
    // lineHeight: 1.5,
    fontStyle: "italic",
  },
  projectTech: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#444444", // Secondary info color
    fontStyle: "italic",
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#222222", // Body text color
    lineHeight: 1.2, // decreased by 0.3 from 1.5
  },
  projectDate: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#444444", // Secondary info color
    fontStyle: "italic",
  },
  // Certifications Section
  certItem: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 12, // section-subheading: 12px
    fontWeight: 600, // bold
    color: "#1A1A1A", // Subheadings color
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 11, // section-content: 11px
    fontWeight: 100, // lighter
    color: "#444444", // Secondary info color
  },
});

const ATSTemplateWithoutPhoto_TEST = ({ resumeData, templateId }) => {
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
      title={`${personalInfo.firstName || "Resume"} ${
        personalInfo.lastName || ""
      } - ATS Template TEST`}
      author={`${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`}
      subject="Professional Resume - Test Version"
      creator="Resume Builder Test"
    >
      <Page size="A4" style={styles.page}>
        {/* HEADER - Contact Information */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName?.toUpperCase()}{" "}
            {personalInfo.lastName?.toUpperCase()}
          </Text>

          {/* {personalInfo.title && (
            <Text style={styles.jobTitle}>{personalInfo.title}</Text>
          )} */}

          {/* Single line contact info */}
          <Text style={styles.contactInfo}>
            {personalInfo.email}
            {personalInfo.phone && ` | ${personalInfo.phone}`}
            {personalInfo.location && ` | ${personalInfo.location}`}
            {personalInfo.linkedin && ` | LinkedIn`}
            {personalInfo.github && ` | GitHub`}
            {personalInfo.portfolio && ` | Portfolio`}
            {personalInfo.website && ` | Website`}
          </Text>
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
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobPosition}>{exp.position}</Text>
                  <Text style={styles.jobDate}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </Text>
                </View>
                <Text style={styles.companyName}>
                  {exp.company}
                  {exp.location && ` | ${exp.location}`}
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
                <View style={styles.educationHeader}>
                  <Text style={styles.degree}>
                    {edu.degree}
                    {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                  </Text>
                  <Text style={styles.eduDate}>
                    {formatDate(edu.startDate)} -{" "}
                    {edu.endDate ? formatDate(edu.endDate) : "Expected"}
                  </Text>
                </View>
                <Text style={styles.institution}>
                  {edu.institution}
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
              console.log(
                `Project ${index} liveLink:`,
                project.liveLink,
                typeof project.liveLink
              );
              return (
                <View key={index} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    {project.liveLink && (
                      <Link
                        src={
                          project.liveLink.startsWith("http")
                            ? project.liveLink
                            : `https://${project.liveLink}`
                        }
                        style={styles.projectDemo}
                      >
                        Live Link
                      </Link>
                    )}
                  </View>
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
              );
            })}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Template metadata for identification
ATSTemplateWithoutPhoto_TEST.templateId = "ats-template-without-photo-test";
ATSTemplateWithoutPhoto_TEST.backendId = "TMPL_001_TEST";
ATSTemplateWithoutPhoto_TEST.displayName = "ATS Professional Template - TEST";
ATSTemplateWithoutPhoto_TEST.hasPhoto = false;

export default ATSTemplateWithoutPhoto_TEST;
