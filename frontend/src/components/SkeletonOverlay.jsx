import React, { useRef, useEffect } from 'react';
import { drawSkeleton } from '../utils/skeletonRenderer';

export default function SkeletonOverlay({ joints }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawSkeleton(ctx, joints);
  }, [joints]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
