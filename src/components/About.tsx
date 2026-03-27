'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// TODO: Replace with your actual tags
const tags = [
  'AI Product',
  'Vibe Coding',
  'User Research',
  'Prototyping',
  'Data Analysis',
  'Design Systems',
];

// TODO: Replace with your actual bio
const bio = `I'm a product manager obsessed with turning AI capabilities into products people actually love. I code my own prototypes, run user research, and believe great products are built with both data and taste.

Previously led AI product at [Company]. Now exploring the frontier of what's possible when AI becomes a creative partner, not just a tool.`;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children ?? [], {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-[var(--spacing-section)] px-6"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          About
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Building at the intersection of{' '}
          <span className="text-[var(--color-accent)]">AI and Product</span>
        </h2>

        <div className="space-y-6 text-[var(--color-text-muted)] text-lg leading-relaxed">
          {bio.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full border border-[var(--color-border)] text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
