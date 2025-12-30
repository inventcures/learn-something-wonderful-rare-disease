'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Resource } from '@/data/resources';
import { Link2, Loader2 } from 'lucide-react';

interface ReadingListProps {
  resources: Resource[];
}

// Color palettes for different articles (gradient from top to bottom)
const colorPalettes = [
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
];

// Use our caching API route for screenshots
function getScreenshotUrl(url: string): string {
  const encoded = encodeURIComponent(url);
  return `/api/screenshot?url=${encoded}`;
}

export default function ReadingList({ resources }: ReadingListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const selectedResource = resources[selectedIndex];
  const palette = colorPalettes[selectedIndex % colorPalettes.length];

  const handleResourceChange = useCallback((index: number) => {
    if (index >= 0 && index < resources.length) {
      setSelectedIndex(index);
      setImageLoading(true);
      setImageError(false);
    }
  }, [resources.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        handleResourceChange(selectedIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        handleResourceChange(selectedIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleResourceChange]);

  return (
    <div
      className="min-h-screen flex transition-all duration-700 ease-in-out"
      style={{
        background: `linear-gradient(to bottom, ${palette.top} 0%, ${palette.bottom} 100%)`,
      }}
    >
      {/* Left Sidebar - Navigation */}
      <aside className="w-72 flex-shrink-0 p-10 overflow-y-auto h-screen">
        {/* Title */}
        <h1 className="font-serif font-bold text-[#fffef8] text-3xl leading-tight mb-12 tracking-tight">
          Read
          <br />
          Something
          <br />
          Wonderful
        </h1>

        {/* Article List */}
        <nav className="space-y-4">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              onClick={() => handleResourceChange(index)}
              className={`block w-full text-left text-[15px] leading-snug transition-all duration-200 ${
                index === selectedIndex
                  ? 'text-white font-semibold'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {resource.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Center - Article Preview */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="relative max-w-2xl w-full">
          {/* Article Preview Card */}
          <div
            className="bg-[#f8f8f4] rounded-2xl shadow-2xl overflow-hidden relative"
            style={{
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35)',
              minHeight: '550px',
            }}
          >
            {/* Loading State */}
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f8f8f4] z-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-[#888] animate-spin" />
                  <p className="text-[#999] text-sm">Loading preview...</p>
                </div>
              </div>
            )}

            {/* Screenshot Image */}
            {!imageError ? (
              <img
                src={getScreenshotUrl(selectedResource.url)}
                alt={`Preview of ${selectedResource.title}`}
                className={`w-full h-auto transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            ) : (
              /* Fallback Content */
              <div className="p-12 min-h-[500px] flex flex-col justify-center">
                <h2 className="text-4xl font-serif text-center text-[#1a1a1a] mb-4 leading-tight">
                  {selectedResource.title}
                </h2>
                <p className="text-center text-[#666] text-base mb-6">
                  by {selectedResource.author}
                </p>
                <p className="text-center text-[#888] text-sm leading-relaxed max-w-md mx-auto">
                  {selectedResource.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Metadata */}
      <aside className="w-80 flex-shrink-0 p-10 flex flex-col justify-end pb-24">
        {/* Year */}
        <p className="text-white/50 text-base font-mono mb-3">
          {selectedResource.year || '2020'}
        </p>

        {/* Title */}
        <h2 className="text-white font-serif font-bold text-4xl leading-tight mb-4 tracking-tight">
          {selectedResource.title}
        </h2>

        {/* Author */}
        <p className="text-white/90 text-xl font-medium mb-4">
          {selectedResource.author}
        </p>

        {/* Source as Hat tip */}
        {selectedResource.source && (
          <p className="text-white/50 text-base italic mb-10">
            {selectedResource.source}
          </p>
        )}

        {/* Link Button Only */}
        <div className="flex items-center">
          <a
            href={selectedResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            title="Open article"
          >
            <Link2 className="w-6 h-6 text-white" />
          </a>
        </div>
      </aside>
    </div>
  );
}
