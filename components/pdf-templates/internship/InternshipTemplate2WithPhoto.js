import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#1e293b',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
    color: '#ffffff',
  },
  rightColumn: {
    width: '65%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: 'cover',
    border: '3px solid #ffffff',
  },
  nameSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  leftSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  leftSectionContent: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 10,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  skillItem: {
    fontSize: 10,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  rightSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  experienceDate: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
  },
  experienceCompany: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'bold',
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
    color: '#1e293b',
    marginBottom: 3,
  },
  educationSchool: {
    fontSize: 10,
    color: '#3b82f6',
    marginBottom: 3,
  },
  educationDetails: {
    fontSize: 9,
    color: '#64748b',
  },
});

const InternshipTemplate2WithPhoto = ({ resumeData }) => {
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
        <View style={styles.container}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Photo */}
            <View style={styles.photoContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                style={styles.photo}
                src={personalInfo.photo || '/api/placeholder/100/100'}
              />
            </View>

            {/* Name & Title */}
            <View style={styles.nameSection}>
              <Text style={styles.name}>
                {personalInfo.firstName} {personalInfo.lastName}
              </Text>
              <Text style={styles.title}>
                {personalInfo.title || 'Internship Candidate'}
              </Text>
            </View>

            {/* Contact */}
            <Text style={styles.leftSectionTitle}>Contact</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>📧 {personalInfo.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>📍 {personalInfo.location}</Text>
            </View>
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>🔗 {personalInfo.linkedin}</Text>
              </View>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <>
                <Text style={styles.leftSectionTitle}>Skills</Text>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.skillItem}>
                    • {skill}
                  </Text>
                ))}
              </>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <>
                <Text style={styles.leftSectionTitle}>Certifications</Text>
                {certifications.map((cert, index) => (
                  <Text key={index} style={styles.leftSectionContent}>
                    • {cert.name}
                    {cert.issuer && (
                      <Text style={{ fontSize: 9 }}>
                        {'\n'}  {cert.issuer}
                      </Text>
                    )}
                  </Text>
                ))}
              </>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Professional Summary */}
            {summary && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Professional Summary</Text>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Education</Text>
                {education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>
                      {edu.degree} in {edu.fieldOfStudy}
                    </Text>
                    <Text style={styles.educationSchool}>
                      {edu.institution}
                    </Text>
                    <Text style={styles.educationDetails}>
                      {edu.startDate} - {edu.endDate} • GPA: {edu.gpa || 'N/A'}
                    </Text>
                    {edu.achievements && (
                      <Text style={styles.summaryText}>
                        {edu.achievements}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Experience</Text>
                {experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{exp.position}</Text>
                      <Text style={styles.experienceDate}>
                        {exp.startDate} - {exp.endDate}
                      </Text>
                    </View>
                    <Text style={styles.experienceCompany}>
                      {exp.company} • {exp.location}
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
                <Text style={styles.rightSectionTitle}>Projects</Text>
                {projects.map((project, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{project.name}</Text>
                      <Text style={styles.experienceDate}>
                        {project.startDate} - {project.endDate}
                      </Text>
                    </View>
                    <Text style={styles.summaryText}>
                      {project.description}
                    </Text>
                    {project.technologies && (
                      <Text style={styles.summaryText}>
                        Technologies: {project.technologies.join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InternshipTemplate2WithPhoto;