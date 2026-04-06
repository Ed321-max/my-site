'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  source?: string;
  slug: string;
}

interface BlogProps {
  items: BlogItem[];
}

export default function Blog({ items }: BlogProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!items.length) return;
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
  }, [items]);

  if (!items.length) {
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
          <p className="text-[var(--color-text-muted)]">
            还在酝酿中，先看看{' '}
            <a href="#portfolio" className="text-[var(--color-accent)] underline underline-offset-4">
              作品集
            </a>
            ？
          </p>
        </div>
      </section>
    );
  }

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
          {items.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border-b border-[var(--color-border)] pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-sm text-[var(--color-text-muted)]">
                    {post.date}
                  </time>
                  {post.source === '公众号同步' && (
                    <span className="text-xs text-blue-400">来自公众号</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {post.summary}
                </p>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
