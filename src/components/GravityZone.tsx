'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Resource } from '@/data/resources';
import { ChevronDown, ExternalLink, BookOpen, FileText } from 'lucide-react';

interface GravityZoneProps {
  resources: Resource[];
}

// Soft color palette for backgrounds - each card gets a different color
const colorPalette = [
  { bg: '#FDF8F3', accent: '#D4A574' }, // Warm cream / terracotta
  { bg: '#F3F8FD', accent: '#7BA3C9' }, // Soft blue
  { bg: '#F8F3FD', accent: '#A374D4' }, // Lavender
  { bg: '#F3FDF6', accent: '#74D4A5' }, // Mint
  { bg: '#FDF3F3', accent: '#D47474' }, // Rose
  { bg: '#FDFAF3', accent: '#D4C474' }, // Warm yellow
  { bg: '#F3FDFD', accent: '#74C9D4' }, // Cyan
  { bg: '#FDF3FA', accent: '#D474B8' }, // Pink
  { bg: '#F5F3FD', accent: '#8474D4' }, // Purple
  { bg: '#F3FDF3', accent: '#74D474' }, // Green
  { bg: '#FDF6F3', accent: '#D49A74' }, // Peach
  { bg: '#F3F5FD', accent: '#7484D4' }, // Indigo
];

export default function GravityZone({ resources }: GravityZoneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [velocity, setVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ y: 0, time: 0 });
  const animationRef = useRef<number | null>(null);

  // Get colors for current card
  const currentColors = colorPalette[currentIndex % colorPalette.length];
  const prevColors = colorPalette[prevIndex % colorPalette.length];

  // Spring physics for momentum scrolling
  const applyMomentum = useCallback((initialVelocity: number) => {
    const friction = 0.92;
    const threshold = 0.5;
    let vel = initialVelocity;

    const animate = () => {
      vel *= friction;

      if (Math.abs(vel) < threshold) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Navigate to next/prev card with animation
  const navigateTo = useCallback((newIndex: number, dir: 'up' | 'down', vel: number = 0) => {
    if (newIndex < 0 || newIndex >= resources.length || isAnimating) return;

    setPrevIndex(currentIndex);
    setDirection(dir);
    setVelocity(vel);
    setIsAnimating(true);
    setCurrentIndex(newIndex);

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
      setVelocity(0);
    }, 600);
  }, [currentIndex, isAnimating, resources.length]);

  // Handle scroll/swipe navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTime = 0;
    const scrollCooldown = 600;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown || isAnimating) return;

      const vel = Math.min(Math.abs(e.deltaY) / 50, 2);

      if (e.deltaY > 30 && currentIndex < resources.length - 1) {
        lastScrollTime = now;
        navigateTo(currentIndex + 1, 'down', vel);
      } else if (e.deltaY < -30 && currentIndex > 0) {
        lastScrollTime = now;
        navigateTo(currentIndex - 1, 'up', vel);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartRef.current.y - touchEndY;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Calculate velocity based on swipe speed
      const swipeVelocity = Math.abs(deltaY) / deltaTime;
      const vel = Math.min(swipeVelocity * 2, 2);

      if (deltaY > 50 && currentIndex < resources.length - 1) {
        navigateTo(currentIndex + 1, 'down', vel);
        applyMomentum(vel);
      } else if (deltaY < -50 && currentIndex > 0) {
        navigateTo(currentIndex - 1, 'up', vel);
        applyMomentum(vel);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        if (currentIndex < resources.length - 1) {
          navigateTo(currentIndex + 1, 'down', 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        if (currentIndex > 0) {
          navigateTo(currentIndex - 1, 'up', 1);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, resources.length, isAnimating, navigateTo, applyMomentum]);

  const currentResource = resources[currentIndex];

  // Calculate animation transforms based on direction and velocity
  const getCardStyle = () => {
    const baseTransform = isAnimating
      ? `translateY(${direction === 'down' ? '-20px' : '20px'}) scale(${1 - velocity * 0.02})`
      : 'translateY(0) scale(1)';

    return {
      transform: baseTransform,
      transition: isAnimating
        ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out'
        : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{
        touchAction: 'none',
        backgroundColor: currentColors.bg,
        transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Floating particles effect for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              backgroundColor: currentColors.accent,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float${i % 3} ${3 + i * 0.5}s ease-in-out infinite`,
              transition: 'background-color 0.8s ease',
            }}
          />
        ))}
      </div>

      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 md:px-12 md:py-8">
        <h1
          className="text-[15px] md:text-[17px] font-medium tracking-[-0.01em]"
          style={{
            color: '#1a1a1a',
            transition: 'color 0.5s ease',
          }}
        >
          Read Something Wonderful
        </h1>
      </header>

      {/* Progress indicator */}
      <div className="absolute top-5 right-6 md:top-8 md:right-12 z-30 flex items-center gap-2">
        <span
          className="text-[13px] font-medium tabular-nums"
          style={{ color: currentColors.accent, transition: 'color 0.5s ease' }}
        >
          {currentIndex + 1} / {resources.length}
        </span>
      </div>

      {/* Main card area */}
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 pt-20 pb-36 md:pt-0 md:pb-0">
        <div className="relative w-full max-w-2xl">
          {/* Card stack effect - cards behind */}
          {resources.slice(currentIndex + 1, currentIndex + 3).map((_, i) => (
            <div
              key={`stack-${i}`}
              className="absolute inset-0 rounded-2xl shadow-sm"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.02})`,
                opacity: 1 - (i + 1) * 0.3,
                zIndex: -i - 1,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          ))}

          {/* Current card */}
          <a
            href={currentResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl overflow-hidden group"
            style={{
              ...getCardStyle(),
              boxShadow: `0 4px 30px ${currentColors.accent}20, 0 2px 10px rgba(0,0,0,0.06)`,
              border: `1px solid ${currentColors.accent}30`,
            }}
          >
            {/* Accent bar at top */}
            <div
              className="h-1 w-full"
              style={{
                backgroundColor: currentColors.accent,
                transition: 'background-color 0.5s ease',
              }}
            />

            {/* Card content */}
            <div className="p-8 md:p-12">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-6">
                {currentResource.type === 'book' ? (
                  <BookOpen className="w-4 h-4" style={{ color: currentColors.accent }} />
                ) : (
                  <FileText className="w-4 h-4" style={{ color: currentColors.accent }} />
                )}
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: currentColors.accent, transition: 'color 0.5s ease' }}
                >
                  {currentResource.type}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-[28px] md:text-[36px] font-semibold text-[#1a1a1a] leading-[1.2] tracking-[-0.02em] mb-4 group-hover:opacity-80 transition-opacity"
              >
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
                <span
                  className="flex items-center gap-1.5 text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: currentColors.accent }}
                >
                  Read {currentResource.type === 'book' ? 'more' : 'article'}
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
            onClick={() => {
              if (i !== currentIndex && !isAnimating) {
                navigateTo(i, i > currentIndex ? 'down' : 'up', 0.5);
              }
            }}
            className="transition-all duration-300"
            style={{
              width: i === currentIndex ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === currentIndex ? currentColors.accent : '#ddd',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            aria-label={`Go to article ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
        style={{ color: currentColors.accent, opacity: 0.6 }}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.1em]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-8 right-6 md:right-12 z-30 hidden md:flex items-center gap-3 text-[11px] text-[#ccc]">
        <span className="px-1.5 py-0.5 bg-[#f0f0f0] rounded text-[#999] font-mono">↑</span>
        <span className="px-1.5 py-0.5 bg-[#f0f0f0] rounded text-[#999] font-mono">↓</span>
        <span>to navigate</span>
      </div>

      {/* Subtitle in bottom left */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30">
        <p
          className="text-[12px]"
          style={{ color: currentColors.accent, opacity: 0.6 }}
        >
          About Rare Diseases
        </p>
      </div>
    </div>
  );
}
