'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Resource } from '@/data/resources';
import { ChevronDown, ExternalLink, BookOpen, FileText } from 'lucide-react';

interface GravityZoneProps {
  resources: Resource[];
}

export default function GravityZone({ resources }: GravityZoneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle scroll/swipe navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 800; // ms between scroll actions

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      if (e.deltaY > 30 && currentIndex < resources.length - 1) {
        lastScrollTime = now;
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < -30 && currentIndex > 0) {
        lastScrollTime = now;
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 50 && currentIndex < resources.length - 1) {
        lastScrollTime = now;
        setCurrentIndex(prev => prev + 1);
      } else if (deltaY < -50 && currentIndex > 0) {
        lastScrollTime = now;
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        if (currentIndex < resources.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, resources.length]);

  const currentResource = resources[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#FAFAF9] select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 md:px-12 md:py-8">
        <h1 className="text-[15px] md:text-[17px] font-medium text-[#1a1a1a] tracking-[-0.01em]">
          Read Something Wonderful
        </h1>
      </header>

      {/* Progress indicator */}
      <div className="absolute top-5 right-6 md:top-8 md:right-12 z-30 flex items-center gap-2">
        <span className="text-[13px] text-[#999] font-medium tabular-nums">
          {currentIndex + 1} / {resources.length}
        </span>
      </div>

      {/* Main card area */}
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
        <div className="relative w-full max-w-2xl">
          {/* Card stack effect - cards behind */}
          {resources.slice(currentIndex + 1, currentIndex + 3).map((_, i) => (
            <div
              key={`stack-${i}`}
              className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-[#e5e5e5]"
              style={{
                transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.02})`,
                opacity: 1 - (i + 1) * 0.3,
                zIndex: -i - 1,
              }}
            />
          ))}

          {/* Current card */}
          <a
            href={currentResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-[#ebebeb] overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] hover:border-[#ddd] group"
            style={{
              transform: isScrolling ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {/* Card content */}
            <div className="p-8 md:p-12">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-6">
                {currentResource.type === 'book' ? (
                  <BookOpen className="w-4 h-4 text-[#B8860B]" />
                ) : (
                  <FileText className="w-4 h-4 text-[#4A90A4]" />
                )}
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                  currentResource.type === 'book'
                    ? 'text-[#B8860B]'
                    : 'text-[#4A90A4]'
                }`}>
                  {currentResource.type}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-[28px] md:text-[36px] font-semibold text-[#1a1a1a] leading-[1.2] tracking-[-0.02em] mb-4 group-hover:text-[#0066CC] transition-colors">
                {currentResource.title}
              </h2>

              {/* Author */}
              <p className="text-[17px] md:text-[19px] text-[#666] mb-6">
                {currentResource.author}
              </p>

              {/* Description */}
              {currentResource.description && (
                <p className="text-[15px] md:text-[16px] text-[#888] leading-relaxed mb-8">
                  {currentResource.description}
                </p>
              )}

              {/* Source & Read link */}
              <div className="flex items-center justify-between pt-6 border-t border-[#f0f0f0]">
                <span className="text-[13px] text-[#aaa] font-medium">
                  {currentResource.source}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#0066CC] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-30 flex gap-1.5">
        {resources.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-[#1a1a1a] w-6'
                : 'bg-[#ddd] hover:bg-[#bbb]'
            }`}
            aria-label={`Go to article ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-[#bbb] animate-bounce">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-8 right-6 md:right-12 z-30 hidden md:flex items-center gap-3 text-[11px] text-[#ccc]">
        <span className="px-1.5 py-0.5 bg-[#f0f0f0] rounded text-[#999] font-mono">↑</span>
        <span className="px-1.5 py-0.5 bg-[#f0f0f0] rounded text-[#999] font-mono">↓</span>
        <span>to navigate</span>
      </div>

      {/* Subtitle in bottom left */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30">
        <p className="text-[12px] text-[#bbb]">
          About Rare Diseases
        </p>
      </div>
    </div>
  );
}
