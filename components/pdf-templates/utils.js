// Helper function to strip markdown formatting from text
export const stripMarkdown = (text) => {
  if (!text) return '';
  // Remove **bold**, *italic*, and other markdown syntax
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/__(.*?)__/g, '$1')     // Remove underline
    .replace(/_(.*?)_/g, '$1');      // Remove underscore italic
};

// Format text to ensure it displays properly in PDF
export const formatText = (text) => {
  if (!text) return '';
  return stripMarkdown(String(text));
};

// Utility function to format date from YYYY-MM to Month Year
export const formatDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return "";
  const [year, month] = dateStr.split('-');
  if (!year || !month) return "";
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthIndex = parseInt(month, 10) - 1;
  // Validate month index is in valid range
  if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return "";
  return `${monthNames[monthIndex]} ${year}`;
};