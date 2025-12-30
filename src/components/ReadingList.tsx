'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Resource } from '@/data/resources';
import { siteConfig } from '@/config/site';
import { Link2, Loader2 } from 'lucide-react';

interface ReadingListProps {
  resources: Resource[];
}

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
  const palette = siteConfig.colorPalettes[selectedIndex % siteConfig.colorPalettes.length];

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
      <aside className="w-80 flex-shrink-0 p-10 overflow-y-auto h-screen flex flex-col">
        {/* Title - Glowing white */}
        <h1
          className="font-serif font-bold text-white text-3xl leading-tight mb-16 tracking-tight"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)' }}
        >
          {siteConfig.title.map((line, i) => (
            <span key={i}>
              {line}
              {i < siteConfig.title.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Article List */}
        <nav className="space-y-12">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              onClick={() => handleResourceChange(index)}
              className={`block w-full text-left text-lg leading-snug transition-all duration-200 ${
                index === selectedIndex
                  ? 'text-white font-semibold'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={index === selectedIndex ? {
                textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)'
              } : undefined}
            >
              {resource.title}
            </button>
          ))}
        </nav>

        {/* Matter Logo - Glowing white */}
        <div className="mt-16">
          <a
            href="https://hq.getmatter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white hover:text-white transition-colors"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
          >
            {/* Matter Icon */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.3" />
              <circle cx="12" cy="20" r="3" fill="currentColor" />
              <circle cx="20" cy="12" r="3" fill="currentColor" />
              <circle cx="28" cy="20" r="3" fill="currentColor" />
              <circle cx="20" cy="28" r="3" fill="currentColor" />
              <path
                d="M12 20L20 12M20 12L28 20M28 20L20 28M20 28L12 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-xl font-medium"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)' }}
            >
              Matter
            </span>
          </a>
        </div>
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
      <aside className="w-80 flex-shrink-0 p-10 flex flex-col justify-center">
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
