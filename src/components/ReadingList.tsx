'use client';

import React, { useState } from 'react';
import { Resource } from '@/data/resources';
import { Link2, ExternalLink, Loader2 } from 'lucide-react';

interface ReadingListProps {
  resources: Resource[];
}

// Generate Microlink screenshot URL
function getScreenshotUrl(url: string): string {
  const encoded = encodeURIComponent(url);
  return `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url`;
}

export default function ReadingList({ resources }: ReadingListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const selectedResource = resources[selectedIndex];

  const handleResourceChange = (index: number) => {
    setSelectedIndex(index);
    setImageLoading(true);
    setImageError(false);
  };

  return (
    <div className="min-h-screen bg-[#6b6b5c] flex">
      {/* Left Sidebar - Navigation */}
      <aside className="w-64 flex-shrink-0 p-8 overflow-y-auto h-screen">
        {/* Title */}
        <h1 className="font-serif italic text-[#e8e8dc] text-2xl leading-tight mb-8">
          Read
          <br />
          Something
          <br />
          Wonderful
        </h1>

        {/* Article List */}
        <nav className="space-y-3">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              onClick={() => handleResourceChange(index)}
              className={`block w-full text-left text-sm transition-colors duration-200 ${
                index === selectedIndex
                  ? 'text-white font-medium'
                  : 'text-[#b8b8a8] hover:text-[#d8d8c8]'
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
            className="bg-[#f5f5ed] rounded-lg shadow-2xl overflow-hidden transform rotate-1 relative"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              minHeight: '600px',
            }}
          >
            {/* Loading State */}
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5ed] z-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-[#6b6b5c] animate-spin" />
                  <p className="text-[#888] text-sm">Loading preview...</p>
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
              <div className="p-12 min-h-[500px]">
                <div className="text-center mb-8">
                  <p className="text-[#666] text-xs italic mb-4 leading-relaxed">
                    {selectedResource.description}
                  </p>
                </div>

                <h2 className="text-4xl font-serif text-center text-[#1a1a1a] mb-4 leading-tight">
                  {selectedResource.title}
                </h2>

                <p className="text-center text-[#666] text-sm mb-8">
                  by {selectedResource.author.toUpperCase()}
                </p>

                <div className="text-[#333] leading-relaxed">
                  <span className="float-left text-6xl font-serif mr-3 mt-1 leading-none">
                    {selectedResource.description?.[0] || 'T'}
                  </span>
                  <p className="text-sm text-[#555]">
                    {selectedResource.description?.slice(1) || 'his is a remarkable story about rare diseases and the families who fight to find cures.'}
                    {' '}The journey of understanding rare genetic conditions has been transformed by dedicated researchers and passionate advocates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Metadata */}
      <aside className="w-72 flex-shrink-0 p-8 flex flex-col justify-center">
        {/* Year */}
        <p className="text-[#a8a898] text-sm mb-2">
          {selectedResource.year || '2020'}
        </p>

        {/* Title */}
        <h2 className="text-white text-3xl font-semibold leading-tight mb-3">
          {selectedResource.title}
        </h2>

        {/* Author */}
        <p className="text-[#d8d8c8] text-lg mb-4">
          {selectedResource.author}
        </p>

        {/* Source */}
        {selectedResource.source && (
          <p className="text-[#a8a898] text-sm mb-8">
            {selectedResource.source}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Link Button */}
          <a
            href={selectedResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#7a7a6a] hover:bg-[#8a8a7a] flex items-center justify-center transition-colors"
            title="Open article"
          >
            <Link2 className="w-5 h-5 text-white" />
          </a>

          {/* Read Article Button */}
          <a
            href={selectedResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#7a7a6a] hover:bg-[#8a8a7a] text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
          >
            Read Article
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </aside>
    </div>
  );
}
