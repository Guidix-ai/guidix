import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
  if (!dateStr || typeof dateStr !== 'string') return "";
  const [year, month] = dateStr.split('-');
  if (!year || !month) return "";
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthIndex = parseInt(month, 10) - 1;
  // Validate month index is in valid range
  if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return "";
  return `${monthNames[monthIndex]} ${year}`;
};

/**
 * ATS-COMPLIANT TEMPLATE WITH PHOTO
 * Template ID: ats-template-with-photo
 * Backend ID: TMPL_002
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
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.2,
  },
  // Header Section with Photo
  headerContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
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
    border: "1px solid #AAAAAA",
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 12,
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 12,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 10,
    fontWeight: 300,
    color: "#444444",
    lineHeight: 1.3,
  },
  contactLine: {
    marginBottom: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
    marginVertical: 8,
  },
  // Section Styles
  section: {
    marginTop: 2,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111111",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
    paddingBottom: 5,
  },
  // Summary Section
  summaryText: {
    fontSize: 11,
    fontWeight: 100,
    color: "#222222",
    lineHeight: 1.3,
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
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1A1A",
    flex: 1,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 100,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  jobDate: {
    fontSize: 11,
    fontWeight: 100,
    color: "#444444",
    fontStyle: "italic",
  },
  bulletPoint: {
    fontSize: 11,
    fontWeight: 100,
    color: "#222222",
    marginBottom: 4,
    lineHeight: 1.2,
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
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1A1A",
    flex: 1,
  },
  institution: {
    fontSize: 11,
    fontWeight: 100,
    color: "#1A1A1A",
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 11,
    fontWeight: 100,
    color: "#444444",
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
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1A1A",
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 11,
    fontWeight: 100,
    color: "#222222",
    lineHeight: 1.2,
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
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1A1A",
    flex: 1,
  },
  projectDemo: {
    fontSize: 11,
    fontWeight: 100,
    color: "#1A73E8",
    textDecoration: "underline",
  },
  projectTech: {
    fontSize: 11,
    fontWeight: 100,
    color: "#444444",
    fontStyle: "italic",
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 11,
    fontWeight: 100,
    color: "#222222",
    lineHeight: 1.2,
  },
  projectDate: {
    fontSize: 11,
    fontWeight: 100,
    color: "#444444",
    fontStyle: "italic",
  },
  // Certifications Section
  certItem: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1A1A",
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 11,
    fontWeight: 100,
    color: "#444444",
  },
});

const ATSTemplateWithPhoto = ({ resumeData, templateId, sectionOrder = ["experience", "education", "projects", "skills", "certifications", "languages"] }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = "",
    certifications = [],
    languages = [],
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

  // Section renderers - each returns JSX for their section
  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
        {experience.map((exp, index) => {
          // Helper to check if date is valid (not placeholder text)
          const isValidDate = (dateStr) => {
            if (!dateStr) return false;
            // Check if it's a valid YYYY-MM format
            return /^\d{4}-\d{2}$/.test(dateStr);
          };

          // Helper to check if duration is valid (not placeholder text)
          const isValidDuration = (duration) => {
            if (!duration) return false;
            // Check if it contains placeholder brackets
            return !duration.includes('[') && !duration.includes(']');
          };

          const validStartDate = isValidDate(exp.startDate) ? exp.startDate : null;
          const validEndDate = isValidDate(exp.endDate) ? exp.endDate : null;
          const validDuration = isValidDuration(exp.duration) ? exp.duration : null;

          const displayDate = validDuration || (validStartDate || validEndDate) ?
            (validDuration || `${validStartDate ? formatDate(validStartDate) : "Start Date"} - ${validEndDate ? formatDate(validEndDate) : "Present"}`) :
            "";

          return (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.jobPosition}>{exp.position}</Text>
                <Text style={styles.jobDate}>{displayDate}</Text>
              </View>
              <Text style={styles.companyName}>
                {exp.company}
                {exp.location && ` | ${exp.location}`}
              </Text>

              {(exp.achievements || exp.responsibilities) && (exp.achievements || exp.responsibilities).length > 0 && (
                <View>
                  {(exp.achievements || exp.responsibilities).map((item, idx) => (
                    <Text key={idx} style={styles.bulletPoint}>
                      • {stripMarkdown(item)}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <Text style={styles.degree}>
                {edu.degree}
                {/* {edu.fieldOfStudy} */}
              </Text>
              <Text style={styles.eduDate}>
                {edu.year || (edu.startDate && edu.endDate) ?
                  (edu.year || `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : "Expected"}`) :
                  ""}
              </Text>
            </View>
            <Text style={styles.institution}>
              {edu.school || edu.institution}
              {edu.gpa && ` | GPA: ${edu.gpa}`}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;

    return (
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
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROJECTS</Text>
        {projects.map((project, index) => (
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
                {project.startDate ? formatDate(project.startDate) : "Start Date"} - {project.endDate ? formatDate(project.endDate) : "Present"}
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
        ))}
      </View>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return null;

    return (
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
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LANGUAGES</Text>
        {languages.map((lang, index) => (
          <View key={index} style={styles.certItem}>
            <Text style={styles.certName}>{lang.language || lang.name}</Text>
            <Text style={styles.certIssuer}>
              {lang.proficiency || lang.level}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Map section IDs to their render functions
  const sectionRenderers = {
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    certifications: renderCertifications,
    languages: renderLanguages,
  };

  return (
    <Document
      title={`${personalInfo.firstName || 'Resume'} ${personalInfo.lastName || ''} - ATS Template with Photo`}
      author={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
      subject="Professional Resume"
      creator="Resume Builder"
    >
      <Page size="A4" style={styles.page}>
        {/* HEADER - Contact Information with Photo */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
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
          <View style={styles.photoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              style={styles.photo}
              src={personalInfo.photo || "/api/placeholder/70/70"}
            />
          </View>
        </View>

        {/* PROFESSIONAL SUMMARY */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{stripMarkdown(summary)}</Text>
          </View>
        )}

        {/* DYNAMIC SECTIONS - Rendered based on sectionOrder */}
        {sectionOrder.map((sectionId) => {
          const renderer = sectionRenderers[sectionId];
          return renderer ? <React.Fragment key={sectionId}>{renderer()}</React.Fragment> : null;
        })}
      </Page>
    </Document>
  );
};

// Template metadata for identification
ATSTemplateWithPhoto.templateId = "ats-template-with-photo";
ATSTemplateWithPhoto.backendId = "TMPL_002";
ATSTemplateWithPhoto.displayName = "ATS Professional Template with Photo";
ATSTemplateWithPhoto.hasPhoto = true;

export default ATSTemplateWithPhoto;
