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
    { top: '#f0e6e8', bottom: '#8b5a5a' }, // Dusty rose
    { top: '#e0e8dc', bottom: '#4a6b4a' }, // Sage green
    { top: '#f0e8dc', bottom: '#8b6b4a' }, // Warm amber
    { top: '#e0dce8', bottom: '#5a4a6b' }, // Deep purple
    { top: '#d8e8e0', bottom: '#3a5a4a' }, // Forest green
    { top: '#f0dcd8', bottom: '#8b4a3a' }, // Terracotta
    { top: '#d8e4f0', bottom: '#3a4a6b' }, // Ocean blue
    { top: '#f0e4d8', bottom: '#6b5a3a' }, // Golden brown
    { top: '#e8d8f0', bottom: '#6b3a6b' }, // Plum
    { top: '#d8f0e8', bottom: '#3a6b5a' }, // Teal
    { top: '#f0f0d8', bottom: '#6b6b3a' }, // Chartreuse
    { top: '#f0d8e8', bottom: '#6b3a5a' }, // Magenta
    { top: '#d8e8f0', bottom: '#3a5a6b' }, // Slate blue
    { top: '#e8f0d8', bottom: '#5a6b3a' }, // Lime green
    { top: '#f0d8d8', bottom: '#6b3a3a' }, // Crimson
    { top: '#d8f0f0', bottom: '#3a6b6b' }, // Cyan
    { top: '#e8d8e0', bottom: '#5a3a4a' }, // Mauve
    { top: '#e0f0d8', bottom: '#4a6b3a' }, // Spring green
    { top: '#f0e0d8', bottom: '#6b4a3a' }, // Burnt sienna
    { top: '#d8e0f0', bottom: '#3a4a5a' }, // Navy mist
    { top: '#f0d8f0', bottom: '#6b3a6b' }, // Orchid
    { top: '#d8f0d8', bottom: '#3a6b3a' }, // Emerald
  ],
};

// Type exports for TypeScript support
export type SiteConfig = typeof siteConfig;
export type ColorPalette = typeof siteConfig.colorPalettes[number];
