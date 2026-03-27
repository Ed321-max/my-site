'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioCard from './PortfolioCard';
import PortfolioModal from './PortfolioModal';

gsap.registerPlugin(ScrollTrigger);

// TODO: Replace with your actual portfolio data
const portfolioItems = [
  {
    id: 1,
    title: 'AI Writing Assistant',
    description: 'An LLM-powered writing tool for product managers',
    role: 'Led product strategy, UX design, and cross-functional alignment',
    outcome: '40% reduction in writing time for early users',
    tags: ['AI/ML', 'GPT-4', 'Product Strategy'],
  },
  {
    id: 2,
    title: 'Data Dashboard Redesign',
    description: 'Redesigned analytics dashboard for enterprise users',
    role: 'Product lead from research to launch',
    outcome: 'NPS increased from 32 to 58 post-launch',
    tags: ['UX Research', 'Data Viz', 'B2B SaaS'],
  },
  {
    id: 3,
    title: 'Mobile App Launch',
    description: 'Scaled mobile app from 0 to 100k users in 6 months',
    role: 'End-to-end product ownership',
    outcome: 'Featured in App Store "Apps We Love"',
    tags: ['Mobile', 'Growth', 'Product-Market Fit'],
  },
];

type PortfolioItem = typeof portfolioItems[0];

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  const handleExpand = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="py-[var(--spacing-section)] px-6 bg-[var(--color-surface)]"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          Portfolio
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Selected <span className="text-[var(--color-accent)]">Work</span>
        </h2>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioCard
              key={item.id}
              title={item.title}
              description={item.description}
              tags={item.tags}
              onExpand={() => handleExpand(item)}
            />
          ))}
        </div>
      </div>

      <PortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </section>
  );
}
