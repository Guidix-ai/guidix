// Internship Templates Exports - ONLY SINGLE COLUMN (ATS-Friendly)
export { default as InternshipTemplate1WithPhoto } from './InternshipTemplate1WithPhoto';
export { default as InternshipTemplate1WithoutPhoto } from './InternshipTemplate1WithoutPhoto';
export { default as InternshipTemplate3WithPhoto } from './InternshipTemplate3WithPhoto';
export { default as InternshipTemplate3WithoutPhoto } from './InternshipTemplate3WithoutPhoto';
export { default as InternshipTemplateWithPhoto } from './InternshipTemplateWithPhoto';
export { default as InternshipTemplateWithoutPhoto } from './InternshipTemplateWithoutPhoto';

// Template configurations for internship - ONLY single-column ATS-friendly templates
export const internshipTemplates = [
  {
    id: 'b3c8f1a2-5d7e-4f9b-a1c3-8e2f5d9b7a4c',
    name: 'Modern Internship (No Photo)',
    component: 'InternshipTemplateWithoutPhoto',
    hasPhoto: false,
    category: 'internship',
    description: 'Fresh, modern design perfect for students and internship applications. Education-first layout with purple accents.',
    preview: '/api/placeholder/300/400',
  },
  {
    id: 'd5e9a3f1-7b2c-4e8d-9f1a-6c3b8d2e5f7a',
    name: 'Modern Internship (With Photo)',
    component: 'InternshipTemplateWithPhoto',
    hasPhoto: true,
    category: 'internship',
    description: 'Modern internship template with professional photo. Education-first layout optimized for student applications with green accents.',
    preview: '/api/placeholder/300/400',
  },
];