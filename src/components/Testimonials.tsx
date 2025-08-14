import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { testimonials } from '../utils/testimonials';

const Testimonials = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState({ startX: 0, scrollLeft: 0 });
  const [currentTranslate, setCurrentTranslate] = useState(0);

  // Memoized testimonial card component
  const TestimonialCard = useMemo(() => React.memo(({ testimonial, keyPrefix }: { testimonial: any, keyPrefix: string }) => (
    <div
      key={`${keyPrefix}-${testimonial.name}`}
      className="testimonial-card"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
            draggable={false}
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
            <p className="text-sm text-slate-600">{testimonial.title}</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">"{testimonial.quote}"</p>
      </div>
    </div>
  )), []);

  // Calculate single set width with caching
  const calculateSetWidth = useCallback(() => {
    if (!sliderRef.current || singleSetWidthRef.current > 0) return singleSetWidthRef.current;
    
    const firstCard = sliderRef.current.children[0] as HTMLElement;
    if (!firstCard) return 0;
    
    const cardWidth = firstCard.offsetWidth;
    const style = window.getComputedStyle(firstCard);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    const totalCardWidth = cardWidth + marginLeft + marginRight;
    
    singleSetWidthRef.current = totalCardWidth * testimonials.length;
    return singleSetWidthRef.current;
  }, []);

  // Optimized auto-scroll animation
  const animate = useCallback(() => {
    if (isUserInteracting) return;
    
    const singleSetWidth = singleSetWidthRef.current || calculateSetWidth();
    if (singleSetWidth === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    setCurrentTranslate(prev => {
      const newTranslate = prev - 0.8; // Slightly slower for smoother feel
      return Math.abs(newTranslate) >= singleSetWidth ? 0 : newTranslate;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [isUserInteracting, calculateSetWidth]);

  // Debounced interaction handler
  const handleInteractionEnd = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      animationRef.current = requestAnimationFrame(animate);
    }, 1500); // Reduced timeout
  }, [animate]);

  // Optimized scroll position management
  const resetScrollPosition = useCallback((container: HTMLElement, isManual = false) => {
    const singleSetWidth = singleSetWidthRef.current || calculateSetWidth();
    if (singleSetWidth === 0) return;

    const { scrollLeft } = container;
    const doubleSetWidth = singleSetWidth * 2;
    
    if (scrollLeft >= doubleSetWidth) {
      container.scrollLeft = singleSetWidth;
    } else if (scrollLeft <= 0 && isManual) {
      container.scrollLeft = singleSetWidth;
    }
  }, [calculateSetWidth]);

  // Consolidated drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setIsUserInteracting(true);
    setDragState({
      startX: clientX - containerRef.current.offsetLeft,
      scrollLeft: containerRef.current.scrollLeft
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = clientX - containerRef.current.offsetLeft;
    const walk = (x - dragState.startX) * 1.2;
    containerRef.current.scrollLeft = dragState.scrollLeft - walk;
    resetScrollPosition(containerRef.current, true);
  }, [isDragging, dragState, resetScrollPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  // Event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.pageX);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.pageX);
    }
  }, [isDragging, handleDragMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].pageX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].pageX);
  }, [handleDragMove]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return;
    
    e.preventDefault();
    setIsUserInteracting(true);
    
    const now = Date.now();
    if (now - lastScrollRef.current > 16) { // Throttle to ~60fps
      containerRef.current.scrollLeft += e.deltaY * 0.8;
      resetScrollPosition(containerRef.current, true);
      lastScrollRef.current = now;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    handleInteractionEnd();
  }, [resetScrollPosition, handleInteractionEnd]);

  // Initialize and cleanup
  useEffect(() => {
    const initTimer = setTimeout(() => {
      calculateSetWidth();
      if (containerRef.current && singleSetWidthRef.current > 0) {
        containerRef.current.scrollLeft = singleSetWidthRef.current;
      }
    }, 100);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(initTimer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [animate, calculateSetWidth]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      singleSetWidthRef.current = 0; // Reset cached width
      calculateSetWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSetWidth]);

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
          What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Community</span> Says
        </h2>
        
        
        
        <div 
          ref={containerRef}
          className="testimonials-contPMner"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onWheel={handleWheel}
        >
          <div
            ref={sliderRef}
            className="testimonials-slider"
            style={{ 
              transform: `translateX(${currentTranslate}px)`,
              transition: isUserInteracting ? 'none' : 'transform 0.05s linear'
            }}
          >
            {/* Render three sets efficiently */}
            {[...Array(3)].map((_, setIndex) =>
              testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`set-${setIndex}-${index}`}
                  testimonial={testimonial}
                  keyPrefix={`set-${setIndex}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .testimonials-container {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          -ms-overflow-style: none;
          scrollbar-width: none;
          cursor: grab;
        }
        
        .testimonials-container::-webkit-scrollbar {
          display: none;
        }
        
        .testimonials-container:active {
          cursor: grabbing;
        }
        
        .testimonials-slider {
          display: flex;
          width: fit-content;
          will-change: transform;
        }
        
        .testimonial-card {
          flex-shrink: 0;
          width: 300px;
          margin: 0 1rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          transform: translateZ(0); /* Force hardware acceleration */
          user-select: none;
        }
        
        .testimonial-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px) translateZ(0);
        }
        
        @media (min-width: 640px) {
          .testimonial-card {
            width: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;