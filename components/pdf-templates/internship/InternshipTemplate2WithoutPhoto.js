import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#6b7280',
  },
  contactItem: {
    marginHorizontal: 10,
    marginVertical: 2,
  },
  content: {
    flex: 1,
  },
  twoColumnLayout: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: '48%',
    marginRight: '4%',
  },
  rightColumn: {
    width: '48%',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#059669',
  },
  sectionContent: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  fullWidthSection: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  experienceCompany: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  experienceDate: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 3,
    marginLeft: 10,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  educationSchool: {
    fontSize: 10,
    color: '#059669',
    marginBottom: 3,
  },
  educationDetails: {
    fontSize: 9,
    color: '#6b7280',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #059669',
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 5,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 8,
    color: '#059669',
    fontWeight: 'bold',
  },
  projectItem: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  projectDate: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 5,
  },
  projectTech: {
    fontSize: 9,
    color: '#059669',
    fontStyle: 'italic',
  },
  certificationItem: {
    marginBottom: 8,
  },
  certificationName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  certificationIssuer: {
    fontSize: 9,
    color: '#059669',
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 8,
    color: '#6b7280',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  languageName: {
    fontSize: 10,
    color: '#374151',
  },
  languageProficiency: {
    fontSize: 9,
    color: '#059669',
    fontWeight: 'bold',
  },
});

const InternshipTemplate2WithoutPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    summary = '',
    certifications = [],
    languages = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          <Text style={styles.title}>
            {personalInfo.title || 'Internship Candidate'}
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>
              📧 {personalInfo.email}
            </Text>
            <Text style={styles.contactItem}>
              📱 {personalInfo.phone}
            </Text>
            <Text style={styles.contactItem}>
              📍 {personalInfo.location}
            </Text>
            {personalInfo.linkedin && (
              <Text style={styles.contactItem}>
                🔗 {personalInfo.linkedin}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Professional Summary */}
          {summary && (
            <View style={styles.fullWidthSection}>
              <Text style={styles.sectionTitle}>Career Objective</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {/* Two Column Layout */}
          <View style={styles.twoColumnLayout}>
            {/* Left Column */}
            <View style={styles.leftColumn}>
              {/* Education */}
              {education.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {education.map((edu, index) => (
                    <View key={index} style={styles.educationItem}>
                      <Text style={styles.educationDegree}>
                        {edu.degree}
                      </Text>
                      <Text style={styles.educationSchool}>
                        {edu.institution}
                      </Text>
                      <Text style={styles.educationDetails}>
                        {edu.fieldOfStudy}
                      </Text>
                      <Text style={styles.educationDetails}>
                        {edu.startDate} - {edu.endDate}
                      </Text>
                      <Text style={styles.educationDetails}>
                        GPA: {edu.gpa || 'N/A'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Technical Skills</Text>
                  <View style={styles.skillsGrid}>
                    {skills.map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {certifications.map((cert, index) => (
                    <View key={index} style={styles.certificationItem}>
                      <Text style={styles.certificationName}>{cert.name}</Text>
                      <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
                      <Text style={styles.certificationDate}>{cert.date}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  {languages.map((lang, index) => (
                    <View key={index} style={styles.languageItem}>
                      <Text style={styles.languageName}>{lang.language}</Text>
                      <Text style={styles.languageProficiency}>{lang.proficiency}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Right Column */}
            <View style={styles.rightColumn}>
              {/* Experience */}
              {experience.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {experience.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <Text style={styles.experienceTitle}>{exp.position}</Text>
                      <Text style={styles.experienceCompany}>{exp.company}</Text>
                      <Text style={styles.experienceDate}>
                        {exp.startDate} - {exp.endDate} • {exp.location}
                      </Text>
                      {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                        <Text key={idx} style={styles.bulletPoint}>
                          • {resp}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {projects.map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      <Text style={styles.projectTitle}>{project.name}</Text>
                      <Text style={styles.projectDate}>
                        {project.startDate} - {project.endDate}
                      </Text>
                      <Text style={styles.projectDescription}>
                        {project.description}
                      </Text>
                      {project.technologies && (
                        <Text style={styles.projectTech}>
                          Technologies: {project.technologies.join(', ')}
                        </Text>
                      )}
                      {project.githubUrl && (
                        <Text style={styles.projectTech}>
                          GitHub: {project.githubUrl}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InternshipTemplate2WithoutPhoto;