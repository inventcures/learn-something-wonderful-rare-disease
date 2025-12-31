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
      className="min-h-screen flex flex-col lg:flex-row transition-all duration-700 ease-in-out overflow-x-hidden pl-20 lg:pl-24"
      style={{
        background: `linear-gradient(to bottom, ${palette.top} 0%, ${palette.bottom} 100%)`,
      }}
    >
      {/* Left Sidebar - Navigation (hidden on mobile) */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 pl-6 pr-6 py-10 h-screen flex-col">
        {/* Title - Glowing white */}
        <h1
          className="font-serif font-bold text-white text-2xl leading-tight tracking-tight"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)' }}
        >
          {siteConfig.title.map((line, i) => (
            <span key={i}>
              {line}
              {i < siteConfig.title.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Article List - Evenly distributed */}
        <nav className="flex-1 flex flex-col justify-evenly py-8">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              onClick={() => handleResourceChange(index)}
              className={`block w-full text-left text-[17px] leading-snug transition-all duration-200 ${
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

        {/* Footer - Matter Logo and Attribution */}
        <div className="pb-6 flex items-center gap-6">
          <a
            href="https://hq.getmatter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white hover:text-white transition-colors"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
          >
            {/* Matter Icon */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="12" fill="currentColor" fillOpacity="0.25" />
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

          {/* Attribution */}
          <span className="text-white/50 text-sm">
            Made with <span className="text-red-400">&lt;3</span> by{' '}
            <a
              href="https://inventcures.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-2"
            >
              @tp53/ashish
            </a>
            ,{' '}
            <a
              href="https://x.com/inventcures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-2"
            >
              @inventcures
            </a>
          </span>
        </div>
      </aside>

      {/* Center - Article Preview */}
      <main className="flex-1 flex flex-col lg:items-center lg:justify-center p-4 lg:p-8">
        {/* Mobile Header - Title and Author above card */}
        <div className="lg:hidden pt-16 pb-6 px-2">
          <h2 className="text-white font-bold text-2xl leading-tight mb-1 tracking-tight">
            {selectedResource.title}
          </h2>
          <p className="text-white/70 text-base">
            {selectedResource.author} • {selectedResource.year || '2020'}
          </p>
        </div>

        <div className="relative max-w-2xl w-full">
          {/* Article Preview Card */}
          <div
            className="bg-[#f8f8f4] rounded-2xl shadow-2xl overflow-hidden relative"
            style={{
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35)',
              minHeight: '400px',
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
              <div className="p-8 lg:p-12 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center">
                <h2 className="text-2xl lg:text-4xl font-serif text-center text-[#1a1a1a] mb-4 leading-tight">
                  {selectedResource.title}
                </h2>
                <p className="text-center text-[#666] text-sm lg:text-base mb-6">
                  by {selectedResource.author}
                </p>
                <p className="text-center text-[#888] text-xs lg:text-sm leading-relaxed max-w-md mx-auto">
                  {selectedResource.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="lg:hidden flex justify-center gap-2 mt-6 pb-8">
          {resources.map((_, index) => (
            <button
              key={index}
              onClick={() => handleResourceChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40'
              }`}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>
      </main>

      {/* Right Sidebar - Metadata (hidden on mobile) */}
      <aside className="hidden lg:flex w-96 flex-shrink-0 p-10 pt-0 flex-col">
        {/* Spacer to align with article preview top area */}
        <div className="h-[35vh]" />

        {/* Year */}
        <p className="text-white/60 text-lg mb-2">
          {selectedResource.year || '2020'}
        </p>

        {/* Title */}
        <h2 className="text-white font-bold text-4xl leading-tight mb-3 tracking-tight">
          {selectedResource.title}
        </h2>

        {/* Author */}
        <p className="text-white text-xl font-medium mb-2">
          {selectedResource.author}
        </p>

        {/* Source as Hat tip */}
        {selectedResource.source && (
          <p className="text-white/60 text-base italic mb-8">
            Hat tip: {selectedResource.source}
          </p>
        )}

        {/* Link Button */}
        <div className="flex items-center gap-3">
          <a
            href={selectedResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            title="Open article"
          >
            <Link2 className="w-5 h-5 text-white/80" />
          </a>
        </div>
      </aside>
    </div>
  );
}
