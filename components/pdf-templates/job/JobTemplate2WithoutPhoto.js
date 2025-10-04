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
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: 25,
    marginBottom: 25,
    borderRadius: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#d1d5db',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 11,
    marginVertical: 2,
    color: '#e5e7eb',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryContainer: {
    backgroundColor: '#f9fafb',
    padding: 18,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1f2937',
  },
  summaryText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.7,
    textAlign: 'justify',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    width: '60%',
    marginRight: '5%',
  },
  rightColumn: {
    width: '35%',
  },
  experienceItem: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  experienceHeader: {
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  experienceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  experienceLocation: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  experienceDate: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: '3 6',
    borderRadius: 3,
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
    color: '#1f2937',
    marginBottom: 4,
    marginLeft: 12,
    lineHeight: 1.5,
    fontWeight: 'bold',
  },
  educationItem: {
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#1f2937',
  },
  educationDegree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  educationDetails: {
    fontSize: 10,
    color: '#6b7280',
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillCategory: {
    marginBottom: 15,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
    padding: '6 8',
    borderRadius: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 10,
  },
  skillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  certificationItem: {
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  certificationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  certificationIssuer: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 9,
    color: '#6b7280',
  },
  projectItem: {
    marginBottom: 15,
    backgroundColor: '#fefefe',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  projectTech: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
  },
  languageName: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  languageProficiency: {
    fontSize: 9,
    color: '#6b7280',
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  achievementBullet: {
    fontSize: 12,
    color: '#1f2937',
    marginRight: 10,
    marginTop: 2,
  },
  achievementText: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
    lineHeight: 1.6,
  },
  metricsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
});

const JobTemplate2WithoutPhoto = ({ resumeData }) => {
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

  // Organize skills by category
  const organizeSkills = (skillsArray) => {
    const categories = {
      'Technical': [],
      'Programming': [],
      'Tools': [],
      'Leadership': [],
      'Other': []
    };

    skillsArray.forEach(skill => {
      if (typeof skill === 'object' && skill.category) {
        if (categories[skill.category]) {
          categories[skill.category].push(skill.name || skill);
        } else {
          categories['Other'].push(skill.name || skill);
        }
      } else {
        categories['Other'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = organizeSkills(skills);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
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

        <View style={styles.content}>
          {/* Professional Summary */}
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            </View>
          )}

          {/* Main Content - Two Column Layout */}
          <View style={styles.twoColumnLayout}>
            {/* Left Column - Experience */}
            <View style={styles.leftColumn}>
              {/* Professional Experience */}
              {experience.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Professional Experience</Text>
                  {experience.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <View style={styles.experienceHeader}>
                        <Text style={styles.experienceTitle}>{exp.position}</Text>
                        <Text style={styles.experienceCompany}>{exp.company}</Text>
                        <View style={styles.experienceDetails}>
                          <Text style={styles.experienceLocation}>{exp.location}</Text>
                          <Text style={styles.experienceDate}>
                            {exp.startDate} - {exp.endDate}
                          </Text>
                        </View>
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

                      {/* Key Metrics Section */}
                      {exp.metrics && exp.metrics.length > 0 && (
                        <View style={styles.metricsContainer}>
                          <View style={styles.metricsGrid}>
                            {exp.metrics.map((metric, idx) => (
                              <View key={idx} style={styles.metricItem}>
                                <Text style={styles.metricValue}>{metric.value}</Text>
                                <Text style={styles.metricLabel}>{metric.label}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

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
                          Technologies: {project.technologies.join(', ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Right Column - Supporting Information */}
            <View style={styles.rightColumn}>
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
                      {edu.gpa && (
                        <Text style={styles.educationDetails}>
                          GPA: {edu.gpa}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Core Skills */}
              {skills.length > 0 && (
                <View style={styles.skillsSection}>
                  <Text style={styles.sectionTitle}>Core Skills</Text>
                  {Object.entries(skillCategories).map(([category, categorySkills]) => (
                    categorySkills.length > 0 && (
                      <View key={category} style={styles.skillCategory}>
                        <Text style={styles.skillCategoryTitle}>{category}</Text>
                        <View style={styles.skillsGrid}>
                          {categorySkills.map((skill, index) => (
                            <View key={index} style={styles.skillItem}>
                              <Text style={styles.skillText}>{skill}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )
                  ))}
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
          </View>

          {/* Key Achievements */}
          {achievements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Achievements</Text>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Text style={styles.achievementBullet}>🏆</Text>
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default JobTemplate2WithoutPhoto;