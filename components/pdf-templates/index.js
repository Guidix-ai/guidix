// Main PDF Templates Export
export * from './internship';
export * from './job';

import { internshipTemplates } from './internship';
import { jobTemplates } from './job';

// Combined template configurations
export const allTemplates = [...internshipTemplates, ...jobTemplates];

// Template utility functions
export const getTemplateById = (id) => {
  return allTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category) => {
  return allTemplates.filter(template => template.category === category);
};

export const getTemplatesWithPhoto = () => {
  return allTemplates.filter(template => template.hasPhoto);
};

export const getTemplatesWithoutPhoto = () => {
  return allTemplates.filter(template => !template.hasPhoto);
};

// Template metadata
export const templateCategories = {
  internship: {
    name: 'Internship',
    description: 'Perfect for students and entry-level positions',
    count: internshipTemplates.length,
  },
  job: {
    name: 'Professional',
    description: 'Ideal for experienced professionals and career changes',
    count: jobTemplates.length,
  },
};

export default allTemplates;