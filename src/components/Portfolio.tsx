'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioCard from './PortfolioCard';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  coverImage?: string;
  slug: string;
}

interface PortfolioProps {
  items: PortfolioItem[];
}

export default function Portfolio({ items }: PortfolioProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current?.children ?? [], {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="py-[var(--spacing-section)] bg-[var(--color-surface)]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          Portfolio
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Selected <span className="text-[var(--color-accent)]">Work</span>
        </h2>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              title={item.title}
              description={item.description}
              tags={item.tags || []}
              coverImage={item.coverImage}
              slug={item.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
