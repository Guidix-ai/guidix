// Job Templates Exports - ONLY SINGLE COLUMN (ATS-Friendly)
export { default as JobTemplate1WithPhoto } from './JobTemplate1WithPhoto';
export { default as JobTemplate1WithoutPhoto } from './JobTemplate1WithoutPhoto';
export { default as JobTemplate3WithoutPhoto } from './JobTemplate3WithoutPhoto';

// Template configurations for job applications - ONLY single-column ATS-friendly templates
export const jobTemplates = [
  {
    id: 'job-1-with-photo',
    name: 'Professional Executive (With Photo)',
    component: 'JobTemplate1WithPhoto',
    hasPhoto: true,
    category: 'job',
    description: 'ATS-optimized single-column design for professionals',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'job-1-without-photo',
    name: 'Professional Executive',
    component: 'JobTemplate1WithoutPhoto',
    hasPhoto: false,
    category: 'job',
    description: 'Clean ATS-friendly format for experienced professionals',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'job-3-without-photo',
    name: 'Modern Professional',
    component: 'JobTemplate3WithoutPhoto',
    hasPhoto: false,
    category: 'job',
    description: 'Single-column ATS-optimized template for all roles',
    preview: '/api/placeholder/300/400',
  },
];