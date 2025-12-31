'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Resource } from '@/data/resources';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';

interface GravityZoneProps {
  resources: Resource[];
}

// Soft color palette for backgrounds
const colorPalette = [
  '#8B7355', // Warm brown
  '#6B8E8E', // Teal
  '#8B6B8E', // Purple
  '#6B8E6B', // Green
  '#8E6B6B', // Rose
  '#8E8B6B', // Olive
  '#6B7B8E', // Steel blue
  '#8E6B7B', // Mauve
  '#6B8E7B', // Sage
  '#7B6B8E', // Violet
  '#8E7B6B', // Tan
  '#6B6B8E', // Indigo
];

export default function GravityZone({ resources }: GravityZoneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 960);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for mobile - track which card is in view
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            // Update CSS variable for scale/opacity based on intersection ratio
            const card = entry.target as HTMLElement;
            card.style.setProperty('--intersectionRatio', entry.intersectionRatio.toString());

            // Update current index when card is mostly visible
            if (entry.intersectionRatio > 0.5) {
              setCurrentIndex(index);
            }
          }
        });
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20), // 0, 0.05, 0.1, ... 1
        root: containerRef.current,
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isMobile, resources.length]);

  // Desktop: wheel navigation
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    let lastScrollTime = 0;
    const scrollCooldown = 600;

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
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, resources.length, isMobile]);

  const currentColor = colorPalette[currentIndex % colorPalette.length];

  // Mobile layout with native scroll-snap
  if (isMobile) {
    return (
      <div className="relative w-full h-[100dvh] overflow-hidden">
        {/* Background colors - one for each card */}
        {resources.map((_, i) => (
          <div
            key={`bg-${i}`}
            className="fixed inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundColor: colorPalette[i % colorPalette.length],
              opacity: i === currentIndex ? 1 : 0,
              zIndex: -1,
            }}
          />
        ))}

        {/* Fixed header */}
        <header className="fixed top-0 left-0 right-0 z-30 px-[3.17vw] pt-12">
          <h1 className="text-[20px] font-semibold text-white leading-tight line-clamp-2">
            {resources[currentIndex]?.title}
          </h1>
          <p className="text-[15px] text-white/70 mt-1.5 font-medium">
            {resources[currentIndex]?.author}
            {resources[currentIndex]?.year && (
              <span className="before:content-['_•_']">{resources[currentIndex].year}</span>
            )}
          </p>
        </header>

        {/* Scroll container with snap */}
        <div
          ref={containerRef}
          className="h-[100dvh] w-full overflow-y-scroll overscroll-none"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {resources.map((resource, i) => (
            <div
              key={resource.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="flex items-center justify-center"
              style={{
                height: '75dvh',
                paddingTop: '21.67dvh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                maxWidth: '79.74vw',
                margin: '0 auto',
              }}
            >
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white rounded-xl overflow-hidden"
                style={{
                  transform: `scale(calc(0.9 + 0.1 * var(--intersectionRatio, 1)))`,
                  opacity: `calc(0.8 + 0.2 * var(--intersectionRatio, 1))`,
                  transition: 'transform 0.3s ease, opacity 0.2s ease',
                  boxShadow: '0 7px 21px rgba(0,0,0,0.07)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <div className="p-6">
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-4">
                    {resource.type === 'book' ? (
                      <BookOpen className="w-4 h-4 text-[#B8860B]" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#4A90A4]" />
                    )}
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      resource.type === 'book' ? 'text-[#B8860B]' : 'text-[#4A90A4]'
                    }`}>
                      {resource.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[22px] font-semibold text-[#1a1a1a] leading-tight mb-3">
                    {resource.title}
                  </h2>

                  {/* Author */}
                  <p className="text-[15px] text-[#666] mb-4">
                    {resource.author}
                  </p>

                  {/* Description */}
                  {resource.description && (
                    <p className="text-[14px] text-[#888] leading-relaxed mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                    <span className="text-[12px] text-[#aaa] font-medium">
                      {resource.source}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[#0066CC] font-medium">
                      Read
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="fixed bottom-6 left-[3.17vw] z-30">
          <p className="text-[14px] text-white/80 font-medium">
            {currentIndex + 1} / {resources.length}
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged from before)
  const currentResource = resources[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{
        touchAction: 'none',
        backgroundColor: currentColor,
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-12 py-8">
        <h1 className="text-[17px] font-medium text-white/90 tracking-[-0.01em]">
          Read Something Wonderful
        </h1>
      </header>

      {/* Progress indicator */}
      <div className="absolute top-8 right-12 z-30">
        <span className="text-[13px] text-white/70 font-medium tabular-nums">
          {currentIndex + 1} / {resources.length}
        </span>
      </div>

      {/* Main card area */}
      <div className="absolute inset-0 flex items-center justify-center px-12">
        <div className="relative w-full max-w-2xl">
          {/* Card stack effect */}
          {resources.slice(currentIndex + 1, currentIndex + 3).map((_, i) => (
            <div
              key={`stack-${i}`}
              className="absolute inset-0 bg-white rounded-2xl"
              style={{
                transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.02})`,
                opacity: 1 - (i + 1) * 0.3,
                zIndex: -i - 1,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            />
          ))}

          {/* Current card */}
          <a
            href={currentResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl overflow-hidden group transition-transform duration-300 hover:scale-[1.02]"
            style={{
              boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
            }}
          >
            <div className="p-12">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-6">
                {currentResource.type === 'book' ? (
                  <BookOpen className="w-4 h-4 text-[#B8860B]" />
                ) : (
                  <FileText className="w-4 h-4 text-[#4A90A4]" />
                )}
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                  currentResource.type === 'book' ? 'text-[#B8860B]' : 'text-[#4A90A4]'
                }`}>
                  {currentResource.type}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-[36px] font-semibold text-[#1a1a1a] leading-[1.2] tracking-[-0.02em] mb-4">
                {currentResource.title}
              </h2>

              {/* Author */}
              <p className="text-[19px] text-[#666] mb-6">
                {currentResource.author}
              </p>

              {/* Description */}
              {currentResource.description && (
                <p className="text-[16px] text-[#888] leading-relaxed mb-8">
                  {currentResource.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-[#f0f0f0]">
                <span className="text-[13px] text-[#aaa] font-medium">
                  {currentResource.source}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#0066CC] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read {currentResource.type === 'book' ? 'more' : 'article'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-8 right-12 z-30 flex items-center gap-3 text-[11px] text-white/50">
        <span className="px-1.5 py-0.5 bg-white/20 rounded font-mono">↑</span>
        <span className="px-1.5 py-0.5 bg-white/20 rounded font-mono">↓</span>
        <span>to navigate</span>
      </div>

      {/* Subtitle */}
      <div className="absolute bottom-8 left-12 z-30">
        <p className="text-[12px] text-white/50">
          About Rare Diseases
        </p>
      </div>
    </div>
  );
}
