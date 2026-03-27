'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PortfolioCardProps {
  title: string;
  description: string;
  tags: string[];
  onExpand: () => void;
}

export default function PortfolioCard({ title, description, tags, onExpand }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(!window.matchMedia('(hover: hover)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onExpand}
      whileHover={isMobile ? {} : { scale: 1.02 }}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
    >
      {/* Glassmorphism overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
        style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}
      />

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded bg-[var(--color-bg)] border border-[var(--color-border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
