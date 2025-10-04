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
    backgroundColor: '#0f172a',
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 18,
    color: '#ffffff',
  },
  rightColumn: {
    width: '65%',
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 25,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    objectFit: 'cover',
    border: '4px solid #ffffff',
  },
  nameSection: {
    textAlign: 'center',
    marginBottom: 25,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    color: '#cbd5e1',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  leftSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    paddingBottom: 5,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 10,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillCategory: {
    marginBottom: 15,
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    backgroundColor: '#1e293b',
    padding: '4 6',
    borderRadius: 3,
  },
  skillItem: {
    fontSize: 10,
    color: '#cbd5e1',
    marginBottom: 5,
    marginLeft: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#334155',
    marginTop: 3,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  certificationItem: {
    marginBottom: 12,
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 4,
  },
  certificationName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  certificationIssuer: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 8,
    color: '#64748b',
  },
  rightSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#3b82f6',
  },
  section: {
    marginBottom: 25,
  },
  summaryText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.7,
    textAlign: 'justify',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  experienceDate: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'bold',
    backgroundColor: '#eff6ff',
    padding: '4 8',
    borderRadius: 4,
  },
  experienceCompany: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experienceLocation: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 5,
    marginLeft: 15,
    lineHeight: 1.6,
  },
  achievementBullet: {
    fontSize: 11,
    color: '#3b82f6',
    marginBottom: 5,
    marginLeft: 15,
    lineHeight: 1.6,
  },
  educationItem: {
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  educationDegree: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  educationDetails: {
    fontSize: 10,
    color: '#64748b',
  },
  projectItem: {
    marginBottom: 15,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  projectTech: {
    fontSize: 10,
    color: '#3b82f6',
    fontStyle: 'italic',
  },
});

const JobTemplate2WithPhoto = ({ resumeData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    summary = '',
    certifications = [],
    projects = [],
    languages = [],
  } = resumeData || {};

  // Organize skills with proficiency levels
  const organizeSkills = (skillsArray) => {
    const categories = {
      'Technical Skills': [],
      'Programming': [],
      'Tools & Platforms': [],
      'Soft Skills': []
    };

    skillsArray.forEach(skill => {
      if (typeof skill === 'object') {
        const category = skill.category || 'Technical Skills';
        if (categories[category]) {
          categories[category].push(skill);
        } else {
          categories['Technical Skills'].push(skill);
        }
      } else {
        categories['Technical Skills'].push({ name: skill, proficiency: 80 });
      }
    });

    return categories;
  };

  const skillCategories = organizeSkills(skills);

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
                src={personalInfo.photo || '/api/placeholder/120/120'}
              />
            </View>

            {/* Name & Title */}
            <View style={styles.nameSection}>
              <Text style={styles.name}>
                {personalInfo.firstName} {personalInfo.lastName}
              </Text>
              <Text style={styles.title}>
                {personalInfo.title || 'Professional'}
              </Text>
            </View>

            {/* Contact */}
            <View style={styles.contactSection}>
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
              {personalInfo.website && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>🌐 {personalInfo.website}</Text>
                </View>
              )}
            </View>

            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.leftSectionTitle}>Skills</Text>
                {Object.entries(skillCategories).map(([category, categorySkills]) => (
                  categorySkills.length > 0 && (
                    <View key={category} style={styles.skillCategory}>
                      <Text style={styles.skillCategoryTitle}>{category}</Text>
                      {categorySkills.map((skill, index) => (
                        <View key={index}>
                          <Text style={styles.skillItem}>
                            {skill.name || skill}
                          </Text>
                          {skill.proficiency && (
                            <View style={styles.progressBar}>
                              <View
                                style={[
                                  styles.progressFill,
                                  { width: `${skill.proficiency}%` }
                                ]}
                              />
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.leftSectionTitle}>Languages</Text>
                {languages.map((lang, index) => (
                  <Text key={index} style={styles.skillItem}>
                    {lang.language}: {lang.proficiency}
                  </Text>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.leftSectionTitle}>Certifications</Text>
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

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Professional Summary */}
            {summary && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Professional Summary</Text>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Professional Experience</Text>
                {experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{exp.position}</Text>
                      <Text style={styles.experienceDate}>
                        {exp.startDate} - {exp.endDate}
                      </Text>
                    </View>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experienceLocation}>{exp.location}</Text>
                    {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                      <Text key={idx} style={styles.bulletPoint}>
                        • {resp}
                      </Text>
                    ))}
                    {exp.achievements && exp.achievements.map((achievement, idx) => (
                      <Text key={idx} style={styles.achievementBullet}>
                        ★ {achievement}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Education</Text>
                {education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>
                      {edu.degree}
                    </Text>
                    <Text style={styles.educationSchool}>
                      {edu.institution}
                    </Text>
                    <Text style={styles.educationDetails}>
                      {edu.fieldOfStudy} • {edu.startDate} - {edu.endDate}
                    </Text>
                    {edu.gpa && (
                      <Text style={styles.educationDetails}>
                        GPA: {edu.gpa}
                      </Text>
                    )}
                    {edu.honors && (
                      <Text style={styles.educationDetails}>
                        Honors: {edu.honors}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Key Projects</Text>
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
        </View>
      </Page>
    </Document>
  );
};

export default JobTemplate2WithPhoto;