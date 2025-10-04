// Internship Templates Exports - ONLY SINGLE COLUMN (ATS-Friendly)
export { default as InternshipTemplate1WithPhoto } from './InternshipTemplate1WithPhoto';
export { default as InternshipTemplate1WithoutPhoto } from './InternshipTemplate1WithoutPhoto';
export { default as InternshipTemplate3WithPhoto } from './InternshipTemplate3WithPhoto';
export { default as InternshipTemplate3WithoutPhoto } from './InternshipTemplate3WithoutPhoto';

// Template configurations for internship - ONLY single-column ATS-friendly templates
export const internshipTemplates = [
  {
    id: 'internship-1-with-photo',
    name: 'Professional Classic (With Photo)',
    component: 'InternshipTemplate1WithPhoto',
    hasPhoto: true,
    category: 'internship',
    description: 'Clean ATS-friendly single-column design with photo',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'internship-1-without-photo',
    name: 'Professional Classic',
    component: 'InternshipTemplate1WithoutPhoto',
    hasPhoto: false,
    category: 'internship',
    description: 'ATS-optimized single-column format for internships',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'internship-3-with-photo',
    name: 'Modern Professional (With Photo)',
    component: 'InternshipTemplate3WithPhoto',
    hasPhoto: true,
    category: 'internship',
    description: 'Modern ATS-friendly single-column design with photo',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'internship-3-without-photo',
    name: 'Modern Professional',
    component: 'InternshipTemplate3WithoutPhoto',
    hasPhoto: false,
    category: 'internship',
    description: 'Clean single-column layout optimized for ATS',
    preview: '/api/placeholder/300/400',
  },
];