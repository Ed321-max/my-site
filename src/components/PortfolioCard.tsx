'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PortfolioCardProps {
  title: string;
  description: string;
  tags: string[];
  coverImage?: string;
  slug: string;
}

export default function PortfolioCard({ title, description, tags, coverImage, slug }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imgError, setImgError] = useState(false);

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
    <a href={`/portfolio/${slug}`} className="block">
      <motion.div
        ref={cardRef}
        className="relative p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={isMobile ? {} : { scale: 1.02 }}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
      >
        {coverImage && !imgError ? (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-48 sm:h-52 md:h-56 object-cover max-w-full"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="mb-4 rounded-lg overflow-hidden w-full h-48 sm:h-52 md:h-56 bg-white/5 flex items-center justify-center">
            <span className="text-gray-500 text-sm">{title}</span>
          </div>
        )}

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

        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </motion.div>
    </a>
  );
}
