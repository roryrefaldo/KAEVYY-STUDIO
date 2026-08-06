import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(6, 182, 212, 0.15)', // Default Cyan Glow
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all ${
        onClick ? 'cursor-pointer hover:border-cyan-500/50' : ''
      } ${className}`}
    >
      {/* Pointer Spotlight Overlay */}
      {isFocused && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 70%)`
          }}
        />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};
