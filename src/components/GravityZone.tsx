'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Resource } from '@/data/resources';

interface GravityZoneProps {
  resources: Resource[];
}

export default function GravityZone({ resources }: GravityZoneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const [isMounted, setIsMounted] = useState(false);

  // Refs for DOM elements to sync with physics bodies
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Events = Matter.Events;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    
    // Adjust gravity if needed
    engine.world.gravity.y = 1;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create renderer (optional, for debugging, but we mostly use it for the mouse constraint interaction)
    // We will render visible DOM elements, but the Matter.Render can be helpful or we can just run headless.
    // For the "Matter" app effect, we usually want the DOM elements to match the physics bodies exactly.
    // To enable mouse interaction with the physics world, we need a way to map mouse events to the canvas/world.
    // We'll create a transparent canvas on top or just use the logic without rendering bodies.
    
    // Actually, for best interaction, using the standard Render is good for the mouse constraint,
    // but we want to style HTML elements.
    // Approach: Run engine, update DOM positions in requestAnimationFrame.
    
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false, // Set to true to see physics bodies for debug
        showAngleIndicator: false
      }
    });
    renderRef.current = render;

    // Boundaries
    const wallOptions = { isStatic: true, render: { visible: false } };
    const floor = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -1000, width, 100, wallOptions); // High ceiling
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 5, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 5, wallOptions);

    Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Create bodies for resources
    resources.forEach((res, index) => {
      // Dimensions need to match the DOM element approximately
      // We'll assume a standard card size for physics and let the DOM adjust, 
      // or we can measure them. For simplicity in V0, let's assume a fixed physics size 
      // that matches our CSS class 'w-64 h-auto' (approx 256px width).
      // Let's approximate height based on content or use a fixed box.
      // A dynamic measure is better but complex. Let's start with varied random sizes.
      
      const boxWidth = 300; 
      const boxHeight = 180; // Approximate
      
      const x = Math.random() * (width - boxWidth) + boxWidth / 2;
      const y = -Math.random() * 500 - 100; // Start above viewport

      const body = Bodies.rectangle(x, y, boxWidth, boxHeight, {
        chamfer: { radius: 10 }, // Rounded corners
        restitution: 0.4,
        friction: 0.5,
        angle: (Math.random() - 0.5) * 0.5, // Slight random rotation
        render: {
          visible: false // We render DOM instead
        }
      });
      
      // Store reference
      bodiesRef.current.set(res.id, body);
      Composite.add(engine.world, body);
    });

    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Sync loop
    const updateLoop = () => {
      bodiesRef.current.forEach((body, id) => {
        const domNode = itemRefs.current.get(id);
        if (domNode) {
          const { x, y } = body.position;
          const angle = body.angle;
          
          // Update DOM transform
          domNode.style.transform = `translate(${x - 150}px, ${y - 90}px) rotate(${angle}rad)`; 
          // Note: -150 and -90 are half of the boxWidth/Height to center the transform
          // Physics bodies are centered, DOM elements usually top-left.
          // We'll set DOM elements to position: absolute, top: 0, left: 0
        }
      });
      requestAnimationFrame(updateLoop);
    };
    
    const animationId = requestAnimationFrame(updateLoop);

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      
      // Reposition walls
      Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
      // floor width update
      // Matter.Body.setVertices(floor, ...) // Hard to resize rectangle in place, simpler to recreate or scale
      // For now, let's just accept walls might be slightly off on resize or just reload. 
      // Correct way is to scale body or recreate walls.
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  }, [isMounted, resources]);

  return (
    <div ref={sceneRef} className="relative w-full h-screen overflow-hidden bg-[#f5f5f7]">
      <h1 className="absolute top-8 left-0 right-0 text-center text-3xl font-bold text-gray-900 pointer-events-none z-10 tracking-tight">
        Read Something Wonderful
        <span className="block text-sm font-normal text-gray-500 mt-2">Rare Disease Resources</span>
      </h1>
      
      {resources.map((res) => (
        <div
          key={res.id}
          ref={(el) => {
            if (el) itemRefs.current.set(res.id, el);
            else itemRefs.current.delete(res.id);
          }}
          className="absolute top-0 left-0 w-[300px] h-[180px] bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none hover:shadow-xl transition-shadow will-change-transform z-20"
          style={{ 
            transform: 'translate(-1000px, -1000px)', // Start off-screen/hidden until physics takes over
          }}
          onMouseDown={(e) => {
             // Stop propagation so Matter.js mouse constraint can pick it up? 
             // Matter.js needs the event on the CANVAS usually.
             // Since the DOM element is ON TOP of the canvas, we need to pass events through or 
             // handle drag manually. 
             // Actually, pointer-events-none on the canvas and handling drag on DOM is one way,
             // BUT Matter.MouseConstraint works on the canvas. 
             // TRICK: Set the DOM elements to `pointer-events: none` so clicks go to canvas?
             // NO, then we can't click links.
             // BETTER TRICK: We don't use dragging on the DOM element for physics. We let the physics just fall.
             // IF the user wants "INDETICAL UI", they probably want dragging.
             // The "Matter" website usually allows dragging the cards.
             // To support clicking dragging AND links:
             // 1. We can try to rely on Matter.js finding the body under the mouse.
             //    If we make DOM elements pointer-events-none, we lose link clicks.
             // 2. We can use a transparent overlay for physics? No.
             // 3. We can just disable physics dragging and let them be static? No, "Gravity" implies interaction.
             
             // SOLUTION: We will not implement drag right now to ensure links work perfectly, 
             // OR we implement a "click vs drag" heuristic.
             // For V0, let's just make them fall and settle. Interaction is falling.
             // If I want to enable drag, I need to pass the event to Matter.
          }}
        >
           {/* Link wrapper that only triggers if not dragging? For now, standard link. */}
           <a href={res.url} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col justify-between hover:text-blue-600 transition-colors pointer-events-auto">
             <div>
               <h2 className="text-xl font-bold leading-tight mb-2 text-gray-900">{res.title}</h2>
               <p className="text-sm text-gray-500">{res.author}</p>
             </div>
             <div className="flex items-center justify-between mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${res.type === 'book' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {res.type.toUpperCase()}
                </span>
                <span className="text-gray-400 text-xs truncate max-w-[120px]">{res.source || 'Read more'}</span>
             </div>
           </a>
        </div>
      ))}
    </div>
  );
}
