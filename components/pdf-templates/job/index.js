// Job Templates Exports - ONLY SINGLE COLUMN (ATS-Friendly)
export { default as JobTemplate1WithPhoto } from './JobTemplate1WithPhoto';
export { default as JobTemplate1WithoutPhoto } from './JobTemplate1WithoutPhoto';
export { default as JobTemplate3WithoutPhoto } from './JobTemplate3WithoutPhoto';
export { default as ATSTemplateWithPhoto } from './ATSTemplateWithPhoto';
export { default as ATSTemplateWithoutPhoto } from './ATSTemplateWithoutPhoto';

// Template configurations for job applications - ONLY single-column ATS-friendly templates
export const jobTemplates = [
  {
    id: 'aa97e710-4457-46fb-ac6f-1765ad3a6d43',
    name: 'ATS Professional (No Photo)',
    component: 'ATSTemplateWithoutPhoto',
    hasPhoto: false,
    category: 'job',
    description: 'Industry-standard ATS-compliant format with optimal keyword parsing. Single column, standard fonts, proper spacing.',
    preview: '/api/placeholder/300/400',
  },
  {
    id: '41aab622-839d-454e-bf99-9d5a2ce027ec',
    name: 'ATS Professional (With Photo)',
    component: 'ATSTemplateWithPhoto',
    hasPhoto: true,
    category: 'job',
    description: 'ATS-compliant format with professional photo. Maintains single-column layout for optimal ATS readability.',
    preview: '/api/placeholder/300/400',
  },
];