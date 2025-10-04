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