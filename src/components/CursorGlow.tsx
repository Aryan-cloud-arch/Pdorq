import React, { useState, useEffect } from 'react';

const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasFinPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 w-[300px] h-[300px] rounded-full opacity-20 blur-[80px] transition-transform duration-100"
      style={{
        background: 'radial-gradient(circle, rgba(197,165,114,0.4) 0%, transparent 70%)',
        left: position.x - 150,
        top: position.y - 150,
      }}
    />
  );
};

export default CursorGlow;
