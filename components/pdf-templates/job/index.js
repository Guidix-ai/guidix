// Job Templates Exports - ONLY SINGLE COLUMN (ATS-Friendly)
export { default as JobTemplate1WithPhoto } from './JobTemplate1WithPhoto';
export { default as JobTemplate1WithoutPhoto } from './JobTemplate1WithoutPhoto';
export { default as JobTemplate3WithoutPhoto } from './JobTemplate3WithoutPhoto';
export { default as ATSTemplateWithPhoto } from './ATSTemplateWithPhoto';
export { default as ATSTemplateWithoutPhoto } from './ATSTemplateWithoutPhoto';

// Template configurations for job applications - ONLY single-column ATS-friendly templates
export const jobTemplates = [
  {
    id: 'ats-template-without-photo',
    name: 'ATS Professional (No Photo)',
    component: 'ATSTemplateWithoutPhoto',
    hasPhoto: false,
    category: 'job',
    description: 'Industry-standard ATS-compliant format with optimal keyword parsing. Single column, standard fonts, proper spacing.',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'ats-template-with-photo',
    name: 'ATS Professional (With Photo)',
    component: 'ATSTemplateWithPhoto',
    hasPhoto: true,
    category: 'job',
    description: 'ATS-compliant format with professional photo. Maintains single-column layout for optimal ATS readability.',
    preview: '/api/placeholder/300/400',
  },
];