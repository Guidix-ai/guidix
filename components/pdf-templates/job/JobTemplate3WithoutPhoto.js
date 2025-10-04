import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { stripMarkdown } from '../utils';

// Clean modern professional template without photo
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 10,
    color: '#000000',
  },
  section: {
    marginTop: 15,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  dateLocation: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  bulletPoint: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 3,
    marginLeft: 20,
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    fontSize: 10,
    color: '#000000',
    marginRight: 15,
    marginBottom: 4,
  },
});

const JobTemplate3WithoutPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = '',
    certifications = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          {personalInfo.title && (
            <Text style={styles.title}>{personalInfo.title}</Text>
          )}
          <Text style={styles.contactInfo}>
            {personalInfo.email} | {personalInfo.phone} | {personalInfo.location}
            {personalInfo.linkedin && ` | ${personalInfo.linkedin}`}
          </Text>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{stripMarkdown(summary)}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.subheading}>{exp.position}</Text>
                <Text style={styles.text}>
                  {exp.company} | {exp.location}
                </Text>
                <Text style={styles.dateLocation}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                  <Text key={idx} style={styles.bulletPoint}>
                    • {stripMarkdown(resp)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.subheading}>
                  {edu.degree} in {edu.fieldOfStudy}
                </Text>
                <Text style={styles.text}>{edu.institution}</Text>
                <Text style={styles.dateLocation}>
                  {edu.startDate} - {edu.endDate}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.subheading}>{cert.name}</Text>
                <Text style={styles.text}>{cert.issuer}</Text>
                <Text style={styles.dateLocation}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.subheading}>{project.name}</Text>
                {project.technologies && (
                  <Text style={styles.dateLocation}>
                    {project.technologies.join(', ')}
                  </Text>
                )}
                <Text style={styles.text}>
                  {stripMarkdown(project.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {typeof skill === 'object' ? skill.name || skill : skill}
                  {index < skills.length - 1 ? ' •' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default JobTemplate3WithoutPhoto;