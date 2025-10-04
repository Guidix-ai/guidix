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
  topSection: {
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: 25,
    marginBottom: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoSection: {
    marginRight: 25,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    objectFit: 'cover',
    border: '4px solid #ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 15,
    color: '#dbeafe',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 11,
    color: '#dbeafe',
    marginRight: 20,
    marginBottom: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryContainer: {
    backgroundColor: '#f0f9ff',
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 1.7,
    textAlign: 'justify',
    fontWeight: '500',
  },
  threeColumnLayout: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    width: '32%',
    marginRight: '2%',
  },
  middleColumn: {
    width: '32%',
    marginRight: '2%',
  },
  rightColumn: {
    width: '32%',
  },
  experienceSection: {
    marginBottom: 20,
  },
  experienceItem: {
    marginBottom: 18,
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 8,
    borderTopWidth: 3,
    borderTopColor: '#1e40af',
  },
  experienceHeader: {
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  experienceDate: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 4,
    marginLeft: 12,
    lineHeight: 1.5,
  },
  keyAchievement: {
    fontSize: 11,
    color: '#1e40af',
    marginBottom: 4,
    marginLeft: 12,
    lineHeight: 1.5,
    fontWeight: 'bold',
  },
  educationItem: {
    marginBottom: 15,
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#1e40af',
  },
  educationDegree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  educationDetails: {
    fontSize: 10,
    color: '#6b7280',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#1e40af',
    color: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  certificationItem: {
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  certificationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 3,
  },
  certificationIssuer: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 9,
    color: '#6b7280',
  },
  projectItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  projectTech: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 4,
  },
  languageName: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  languageProficiency: {
    fontSize: 9,
    color: '#6b7280',
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  achievementBullet: {
    fontSize: 12,
    color: '#1e40af',
    marginRight: 8,
    marginTop: 1,
  },
  achievementText: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
    lineHeight: 1.5,
  },
});

const JobTemplate3WithPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    summary = '',
    certifications = [],
    projects = [],
    languages = [],
    achievements = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.topSection}>
          <View style={styles.photoSection}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              style={styles.photo}
              src={personalInfo.photo || '/api/placeholder/110/110'}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {personalInfo.firstName} {personalInfo.lastName}
            </Text>
            <Text style={styles.title}>
              {personalInfo.title || 'Professional'}
            </Text>
            <View style={styles.contactContainer}>
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
              {personalInfo.website && (
                <Text style={styles.contactItem}>
                  🌐 {personalInfo.website}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Professional Summary */}
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Executive Summary</Text>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            </View>
          )}

          {/* Professional Experience */}
          {experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.experienceTitle}>{exp.position}</Text>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experienceDate}>
                      {exp.startDate} - {exp.endDate} • {exp.location}
                    </Text>
                  </View>
                  {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                    <Text key={idx} style={styles.bulletPoint}>
                      • {resp}
                    </Text>
                  ))}
                  {exp.achievements && exp.achievements.map((achievement, idx) => (
                    <Text key={idx} style={styles.keyAchievement}>
                      ▶ {achievement}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Three Column Layout */}
          <View style={styles.threeColumnLayout}>
            {/* Left Column - Education */}
            <View style={styles.leftColumn}>
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
                      {edu.gpa && (
                        <Text style={styles.educationDetails}>
                          GPA: {edu.gpa}
                        </Text>
                      )}
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

            {/* Middle Column - Skills & Certifications */}
            <View style={styles.middleColumn}>
              {/* Skills */}
              {skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Core Skills</Text>
                  <View style={styles.skillsGrid}>
                    {skills.map((skill, index) => (
                      <View key={index} style={styles.skillChip}>
                        <Text style={styles.skillText}>
                          {typeof skill === 'object' ? skill.name : skill}
                        </Text>
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
            </View>

            {/* Right Column - Projects & Achievements */}
            <View style={styles.rightColumn}>
              {/* Key Projects */}
              {projects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Projects</Text>
                  {projects.map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      <Text style={styles.projectTitle}>{project.name}</Text>
                      <Text style={styles.projectDescription}>
                        {project.description}
                      </Text>
                      {project.technologies && (
                        <Text style={styles.projectTech}>
                          Tech: {project.technologies.join(', ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Key Achievements */}
              {achievements.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  {achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementItem}>
                      <Text style={styles.achievementBullet}>🏆</Text>
                      <Text style={styles.achievementText}>{achievement}</Text>
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

export default JobTemplate3WithPhoto;