'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// TODO: Replace with your actual blog posts or connect RSS
const blogPosts = [
  {
    id: 1,
    title: 'Why Vibe Coding is the Future of Product Development',
    date: '2026-03-01',
    excerpt: "The line between builder and user is blurring. Here's what that means for product managers.",
    url: '#',
  },
  {
    id: 2,
    title: 'Building AI Products Without an Engineering Team',
    date: '2026-02-15',
    excerpt: 'A practical guide to shipping AI features fast with small teams and big ambition.',
    url: '#',
  },
  {
    id: 3,
    title: "The PM's Guide to Prototype Fidelity",
    date: '2026-01-20',
    excerpt: 'When to use paper, when to use Figma, and when to actually code it.',
    url: '#',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(listRef.current?.children ?? [], {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-[var(--spacing-section)] px-6"
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          Blog
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Thoughts & <span className="text-[var(--color-accent)]">Writing</span>
        </h2>

        <div ref={listRef} className="space-y-8">
          {blogPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              className="block group"
            >
              <article className="border-b border-[var(--color-border)] pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-sm text-[var(--color-text-muted)]">
                    {post.date}
                  </time>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {post.excerpt}
                </p>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
