'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface JournalItem {
  id: string;
  image: string;
  date: string;
  caption: string;
}

interface JournalProps {
  items: JournalItem[];
}

export default function Journal({ items }: JournalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current?.children ?? [], {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      id="moments"
      className="py-[var(--spacing-section)] bg-[var(--color-surface)]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          Journal
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Moments <span className="text-[var(--color-accent)]">记录</span>
        </h2>

        <div
          ref={gridRef}
          className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
          style={{ columnFill: 'balance' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4"
            >
              <a
                href={`/journal/${item.id}`}
                className="block relative overflow-hidden rounded-xl group"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-48 object-cover transition-transform duration-300 ease group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <time className="text-xs text-white/70 block mb-1">{item.date}</time>
                  <p className="text-sm text-white">{item.caption}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
