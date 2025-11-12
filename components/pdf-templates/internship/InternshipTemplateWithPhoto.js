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
 * INTERNSHIP TEMPLATE WITH PHOTO - GREEN THEME
 * Template ID: internship-template-with-photo
 * Color: Green theme for freshness and growth
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
    border: "1px solid #059669",
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
    borderBottomColor: "#10B981",
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
    color: "#059669",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#10B981",
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
  // Languages Section
  languagesList: {
    fontSize: 11,
    fontWeight: 100,
    color: "#222222",
    lineHeight: 1.2,
  },
});

const InternshipTemplateWithPhoto = ({ resumeData, templateId, sectionOrder = ["education", "experience", "projects", "skills", "certifications", "languages"] }) => {
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

  const firstName = personalInfo?.firstName || "";
  const lastName = personalInfo?.lastName || "";
  const title = stripMarkdown(personalInfo?.title || "");
  const email = stripMarkdown(personalInfo?.email || "");
  const phone = stripMarkdown(personalInfo?.phone || "");
  const location = stripMarkdown(personalInfo?.location || "");
  const linkedin = stripMarkdown(personalInfo?.linkedin || "");
  const github = stripMarkdown(personalInfo?.github || "");
  const portfolio = stripMarkdown(personalInfo?.portfolio || "");
  const photo = personalInfo?.photo || "";
  const summaryText = stripMarkdown(summary || personalInfo?.summary || "");

  // Section renderers
  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {education.map((edu, index) => {
          const degree = stripMarkdown(edu?.degree || "");
          const school = stripMarkdown(edu?.school || "");
          const year = stripMarkdown(edu?.year || "");

          if (!degree && !school && !year) return null;

          return (
            <View key={index} style={styles.educationItem}>
              <View style={styles.educationHeader}>
                {degree && <Text style={styles.degree}>{degree}</Text>}
                {year && <Text style={styles.eduDate}>{year}</Text>}
              </View>
              {school && <Text style={styles.institution}>{school}</Text>}
            </View>
          );
        })}
      </View>
    );
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
        {experience.map((exp, index) => {
          const position = stripMarkdown(exp?.position || "");
          const company = stripMarkdown(exp?.company || "");
          const startDate = exp?.startDate ? formatDate(exp.startDate) : "";
          const endDate = exp?.endDate ? (exp.endDate === "Present" ? "Present" : formatDate(exp.endDate)) : "";
          const duration = startDate && endDate ? `${startDate} - ${endDate}` : stripMarkdown(exp?.duration || "");
          const achievements = exp?.achievements || [];

          if (!position && !company) return null;

          return (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                {position && <Text style={styles.jobPosition}>{position}</Text>}
                {duration && <Text style={styles.jobDate}>{duration}</Text>}
              </View>
              {company && <Text style={styles.companyName}>{company}</Text>}
              {achievements.length > 0 &&
                achievements.map((achievement, achIndex) => {
                  const cleanAchievement = stripMarkdown(achievement || "");
                  if (!cleanAchievement) return null;
                  return (
                    <Text key={achIndex} style={styles.bulletPoint}>
                      • {cleanAchievement}
                    </Text>
                  );
                })}
            </View>
          );
        })}
      </View>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROJECTS</Text>
        {projects.map((project, index) => {
          const name = stripMarkdown(project?.name || "");
          const description = stripMarkdown(project?.description || "");
          const technologies = project?.technologies || [];

          if (!name && !description) return null;

          return (
            <View key={index} style={styles.projectItem}>
              <View style={styles.projectHeader}>
                {name && <Text style={styles.projectName}>{name}</Text>}
              </View>
              {technologies.length > 0 && (
                <Text style={styles.projectTech}>
                  Technologies: {technologies.map(tech => stripMarkdown(tech)).join(", ")}
                </Text>
              )}
              {description && <Text style={styles.projectDesc}>{description}</Text>}
            </View>
          );
        })}
      </View>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    const cleanSkills = skills.map(skill => stripMarkdown(skill || "")).filter(Boolean);
    if (cleanSkills.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsList}>{cleanSkills.join(" • ")}</Text>
        </View>
      </View>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
        {certifications.map((cert, index) => {
          const name = stripMarkdown(cert?.name || "");
          const issuer = stripMarkdown(cert?.issuer || "");
          const year = stripMarkdown(cert?.year || "");

          if (!name) return null;

          return (
            <View key={index} style={styles.certItem}>
              <Text style={styles.certName}>{name}</Text>
              <Text style={styles.certIssuer}>
                {issuer}{year ? ` | ${year}` : ""}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    const languagesList = languages.map(lang => {
      const name = stripMarkdown(lang?.name || "");
      const level = stripMarkdown(lang?.level || "");
      return name ? `${name}${level ? ` (${level})` : ""}` : null;
    }).filter(Boolean);

    if (languagesList.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LANGUAGES</Text>
        <Text style={styles.languagesList}>{languagesList.join(" • ")}</Text>
      </View>
    );
  };

  // Map section IDs to their render functions
  const sectionRenderers = {
    education: renderEducation,
    experience: renderExperience,
    projects: renderProjects,
    skills: renderSkills,
    certifications: renderCertifications,
    languages: renderLanguages,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER with Photo */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>
              {firstName?.toUpperCase()} {lastName?.toUpperCase()}
            </Text>
            {/* Single line contact info */}
            <Text style={styles.contactInfo}>
              {email}
              {phone && ` | ${phone}`}
              {location && ` | ${location}`}
              {linkedin && ` | LinkedIn`}
              {github && ` | GitHub`}
              {portfolio && ` | Portfolio`}
            </Text>
          </View>
          {photo && (
            <View style={styles.photoContainer}>
              <Image src={photo} style={styles.photo} />
            </View>
          )}
        </View>

        {/* SUMMARY */}
        {summaryText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.summaryText}>{summaryText}</Text>
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

export default InternshipTemplateWithPhoto;
