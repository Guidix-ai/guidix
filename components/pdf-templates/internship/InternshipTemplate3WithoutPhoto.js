import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { stripMarkdown } from '../utils';

// STYLE 3: MODERN TECH - Like Google/Startup resumes
// - Name CENTERED and BIG
// - No borders, just spacing
// - Compact but readable
// - Skills as inline text
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 45,
    paddingBottom: 45,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 3,
  },
  contact: {
    fontSize: 9,
    color: '#000000',
    marginTop: 3,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 1,
  },
  entry: {
    marginBottom: 10,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  leftContent: {
    flex: 1,
  },
  position: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  company: {
    fontSize: 9,
    color: '#333333',
    marginTop: 1,
  },
  date: {
    fontSize: 8,
    color: '#666666',
    marginLeft: 10,
  },
  description: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.4,
    marginTop: 3,
    marginLeft: 0,
  },
  bullet: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.4,
    marginTop: 2,
    marginLeft: 10,
  },
  skillsText: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.5,
  },
});

const InternshipTemplate3WithoutPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = '',
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Centered Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          <Text style={styles.contact}>
            {personalInfo.email} · {personalInfo.phone} · {personalInfo.location}
          </Text>
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
                {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
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
                    {project.technologies.join(' · ')}
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
            <Text style={styles.skillsText}>
              {skills.join(' · ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InternshipTemplate3WithoutPhoto;