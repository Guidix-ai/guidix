import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { stripMarkdown } from "../utils";

// STYLE 3 WITH PHOTO: MODERN TECH with centered photo above name - ENHANCED PROFESSIONAL
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 55,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    alignItems: "center",
    borderBottom: "1.5pt solid #1a1a1a",
    paddingBottom: 20,
  },
  photoContainer: {
    width: 100,
    height: 100,
    marginBottom: 15,
    alignSelf: "center",
    border: "2pt solid #1a1a1a",
    borderRadius: 50,
    padding: 2,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    objectFit: "cover",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  contact: {
    fontSize: 9,
    color: "#333333",
    marginHorizontal: 8,
  },
  separator: {
    fontSize: 9,
    color: "#999999",
  },
  section: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    borderBottom: "1pt solid #e0e0e0",
    paddingBottom: 4,
  },
  entry: {
    marginBottom: 14,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  position: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: "#444444",
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: "#666666",
    fontFamily: "Helvetica-Oblique",
    textAlign: "right",
    minWidth: 100,
  },
  description: {
    fontSize: 9.5,
    color: "#2a2a2a",
    lineHeight: 1.5,
    marginTop: 6,
    textAlign: "justify",
  },
  bullet: {
    fontSize: 9.5,
    color: "#2a2a2a",
    lineHeight: 1.6,
    marginTop: 4,
    marginLeft: 12,
    paddingLeft: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  skillItem: {
    fontSize: 9.5,
    color: "#2a2a2a",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 3,
    border: "0.5pt solid #e0e0e0",
  },
});

const InternshipTemplate3WithPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = "",
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Centered Header with Photo */}
        <View style={styles.header}>
          {personalInfo.photo && (
            <View style={styles.photoContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image style={styles.photo} src={personalInfo.photo} />
            </View>
          )}
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Text style={styles.contact}>{personalInfo.email}</Text>
            )}
            {personalInfo.email && personalInfo.phone && (
              <Text style={styles.separator}>|</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contact}>{personalInfo.phone}</Text>
            )}
            {personalInfo.phone && personalInfo.location && (
              <Text style={styles.separator}>|</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contact}>{personalInfo.location}</Text>
            )}
          </View>
          {personalInfo.linkedin && (
            <Text style={styles.contact}>{personalInfo.linkedin}</Text>
          )}
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT</Text>
            <Text style={styles.description}>{stripMarkdown(summary)}</Text>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View style={styles.leftContent}>
                    <Text style={styles.position}>
                      {edu.degree} in {edu.fieldOfStudy}
                    </Text>
                    <Text style={styles.company}>
                      {edu.institution}
                      {edu.gpa && ` · GPA: ${edu.gpa}`}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View style={styles.leftContent}>
                    <Text style={styles.position}>{exp.position}</Text>
                    <Text style={styles.company}>
                      {exp.company} · {exp.location}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
                {exp.responsibilities &&
                  exp.responsibilities.map((resp, idx) => (
                    <Text key={idx} style={styles.bullet}>
                      • {stripMarkdown(resp)}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.entry}>
                <Text style={styles.position}>{project.name}</Text>
                {project.technologies && (
                  <Text style={styles.company}>
                    {project.technologies.join(" · ")}
                  </Text>
                )}
                <Text style={styles.description}>
                  {stripMarkdown(project.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InternshipTemplate3WithPhoto;
