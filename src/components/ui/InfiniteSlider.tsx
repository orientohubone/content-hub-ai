import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'motion/react';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  speed?: number;
  speedOnHover?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 40,
  reverse = false,
  speed = 20,
  speedOnHover,
  className,
}: InfiniteSliderProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 2);
    }
  }, [children]);

  useAnimationFrame((t, delta) => {
    if (contentWidth === 0) return;
    
    let moveBy = (reverse ? speed : -speed) * (delta / 1000) * 10;
    let newX = x.get() + moveBy;

    if (reverse) {
      if (newX > 0) newX = -contentWidth;
    } else {
      if (newX < -contentWidth) newX = 0;
    }
    
    x.set(newX);
  });

  return (
    <div className={`overflow-hidden flex whitespace-nowrap ${className}`}>
      <motion.div 
        className="flex shrink-0 px-[gap/2]" 
        style={{ x, gap }} 
        ref={contentRef}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
