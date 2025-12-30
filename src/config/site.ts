// Site Configuration
// Edit this file to customize your "Learn Something Wonderful" site

export const siteConfig = {
  // The main title displayed in the top-left corner
  // Each array item appears on a new line
  title: [
    'Learn',
    'Something',
    'Wonderful',
    'About',
    'Rare',
    'Diseases',
  ],

  // Metadata for SEO and social sharing
  meta: {
    title: 'Learn Something Wonderful | Rare Diseases',
    description: 'A curated collection of wonderful reading resources about rare genetic diseases. Stories of hope, science, and the families who changed medicine.',
    keywords: ['rare diseases', 'genetic diseases', 'patient stories', 'medical research', 'NGLY1', 'cystic fibrosis', 'prion disease'],
    author: 'InventCures',
    ogType: 'website',
    locale: 'en_US',
  },

  // Color palettes for article backgrounds (gradient from top to bottom)
  // Each article cycles through these colors
  colorPalettes: [
    { top: '#e8e4d9', bottom: '#6b6b5c' }, // Olive/khaki
    { top: '#dce4e8', bottom: '#4a6670' }, // Steel blue
    { top: '#e8dce0', bottom: '#6b5a5c' }, // Dusty rose
    { top: '#e0e8dc', bottom: '#5a6b5c' }, // Sage green
    { top: '#e8e0d8', bottom: '#6b5f52' }, // Warm brown
    { top: '#dce0e8', bottom: '#5a5c6b' }, // Slate purple
    { top: '#e4e8dc', bottom: '#5c6b5a' }, // Forest
    { top: '#e8dcd8', bottom: '#6b5a52' }, // Terracotta
    { top: '#d8e4e8', bottom: '#526b6b' }, // Teal
    { top: '#e8e4dc', bottom: '#6b6552' }, // Golden olive
    { top: '#e0dce8', bottom: '#5c5a6b' }, // Lavender
    { top: '#dce8e4', bottom: '#5a6b65' }, // Sea green
  ],
};

// Type exports for TypeScript support
export type SiteConfig = typeof siteConfig;
export type ColorPalette = typeof siteConfig.colorPalettes[number];
