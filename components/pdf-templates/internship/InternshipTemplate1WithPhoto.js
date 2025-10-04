import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { stripMarkdown } from '../utils';

// STYLE 1 WITH PHOTO: MINIMAL CLASSIC with photo on left
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  photoContainer: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 2,
    objectFit: 'cover',
    border: '1px solid #000000',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 10,
    color: '#000000',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  entryDate: {
    fontSize: 10,
    color: '#000000',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  bulletPoint: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 3,
    marginLeft: 15,
    lineHeight: 1.5,
  },
  summaryText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.6,
    marginBottom: 5,
    textAlign: 'justify',
  },
  skillsLine: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
});

const InternshipTemplate1WithPhoto = ({ resumeData }) => {
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
        {/* Header with Photo */}
        <View style={styles.header}>
          <View style={styles.photoContainer}>
            {personalInfo.photo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image
                style={styles.photo}
                src={personalInfo.photo}
              />
            )}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>
              {personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}
            </Text>
            <Text style={styles.contactLine}>
              {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
              {personalInfo.linkedin && ` • ${personalInfo.linkedin}`}
            </Text>
          </View>
        </View>

        {/* Education First */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.entryDate}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.degree} in {edu.fieldOfStudy}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.company}, {exp.location}
                  </Text>
                  <Text style={styles.entryDate}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.position}</Text>
                {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                  <Text key={idx} style={styles.bulletPoint}>
                    • {stripMarkdown(resp)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{project.name}</Text>
                </View>
                {project.technologies && (
                  <Text style={styles.entrySubtitle}>
                    {project.technologies.join(', ')}
                  </Text>
                )}
                <Text style={styles.summaryText}>
                  {stripMarkdown(project.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <Text style={styles.skillsLine}>
              {skills.join(' • ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InternshipTemplate1WithPhoto;