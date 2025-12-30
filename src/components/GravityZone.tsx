'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Resource } from '@/data/resources';

interface GravityZoneProps {
  resources: Resource[];
}

const CARD_WIDTH = 320;
const CARD_HEIGHT = 140;

export default function GravityZone({ resources }: GravityZoneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number; angle: number }>>(new Map());
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePositions = useCallback(() => {
    const newPositions = new Map<string, { x: number; y: number; angle: number }>();
    bodiesRef.current.forEach((body, id) => {
      newPositions.set(id, {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle
      });
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    if (!isMounted || !sceneRef.current) return;

    const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

    // Create engine with adjusted gravity
    const engine = Engine.create({
      gravity: { x: 0, y: 0.8 }
    });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create invisible canvas for mouse interaction
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'auto';
    canvasRef.current = canvas;
    sceneRef.current.appendChild(canvas);

    // Boundaries - invisible walls
    const wallThickness = 100;
    const wallOptions = {
      isStatic: true,
      friction: 0.8,
      restitution: 0.2,
      render: { visible: false }
    };

    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, wallOptions);
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);

    Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Create bodies for each resource with staggered drops
    resources.forEach((res, index) => {
      const x = Math.random() * (width - CARD_WIDTH - 100) + CARD_WIDTH / 2 + 50;
      const y = -CARD_HEIGHT - (index * 120) - Math.random() * 100;

      const body = Bodies.rectangle(x, y, CARD_WIDTH, CARD_HEIGHT, {
        chamfer: { radius: 12 },
        restitution: 0.3,
        friction: 0.6,
        frictionAir: 0.02,
        angle: (Math.random() - 0.5) * 0.3,
        label: res.id,
        render: { visible: false }
      });

      bodiesRef.current.set(res.id, body);
      Composite.add(engine.world, body);
    });

    // Mouse control for dragging
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(engine.world, mouseConstraint);

    // Track drag state
    Events.on(mouseConstraint, 'startdrag', () => {
      setIsDragging(true);
      if (mouseConstraint.body) {
        dragStartPos.current = {
          x: mouseConstraint.mouse.position.x,
          y: mouseConstraint.mouse.position.y
        };
      }
    });

    Events.on(mouseConstraint, 'enddrag', () => {
      setTimeout(() => {
        setIsDragging(false);
        dragStartPos.current = null;
      }, 50);
    });

    // Run engine
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Animation loop to update React state
    let animationId: number;
    const animate = () => {
      updatePositions();
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;

      Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + wallThickness / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + wallThickness / 2, y: newHeight / 2 });

      // Scale floor to match new width
      Matter.Body.scale(floor, newWidth / width, 1);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [isMounted, resources, updatePositions]);

  const handleCardClick = (e: React.MouseEvent, url: string) => {
    // Only navigate if it wasn't a drag
    if (!isDragging && dragStartPos.current === null) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div ref={sceneRef} className="relative w-full h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-[32px] md:text-[42px] font-semibold text-[#1a1a1a] tracking-[-0.02em] leading-tight">
            Read Something Wonderful
          </h1>
          <p className="text-[15px] md:text-[17px] text-[#666666] mt-2 font-normal">
            About Rare Diseases
          </p>
        </div>
      </header>

      {/* Physics-driven cards */}
      {resources.map((res) => {
        const pos = positions.get(res.id);
        if (!pos) return null;

        return (
          <div
            key={res.id}
            onClick={(e) => handleCardClick(e, res.url)}
            className="absolute cursor-pointer select-none z-10"
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              left: 0,
              top: 0,
              transform: `translate(${pos.x - CARD_WIDTH / 2}px, ${pos.y - CARD_HEIGHT / 2}px) rotate(${pos.angle}rad)`,
              willChange: 'transform',
              pointerEvents: 'none'
            }}
          >
            <div className="w-full h-full bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.08)] border border-[#e8e8e8] p-5 flex flex-col justify-between transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="flex-1 min-h-0">
                <h2 className="text-[17px] font-semibold text-[#1a1a1a] leading-snug line-clamp-2 tracking-[-0.01em]">
                  {res.title}
                </h2>
                <p className="text-[14px] text-[#888888] mt-1.5 font-normal">
                  {res.author}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0] mt-3">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${
                  res.type === 'book'
                    ? 'bg-[#FFF4E5] text-[#B86E00]'
                    : 'bg-[#E8F4FE] text-[#0066CC]'
                }`}>
                  {res.type}
                </span>
                {res.source && (
                  <span className="text-[12px] text-[#999999] truncate max-w-[140px]">
                    {res.source}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-[13px] text-[#999999]">
            Curated resources for rare disease families & researchers
          </p>
        </div>
      </footer>
    </div>
  );
}
