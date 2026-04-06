'use client';

import { useRef, useEffect, useState } from 'react';
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

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="关闭"
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      {alt && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
          {alt}
        </p>
      )}
    </div>
  );
}

export default function Journal({ items }: JournalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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
    <>
      <section
        ref={sectionRef}
        id="journal"
        className="py-[var(--spacing-section)] px-6 bg-[var(--color-surface)]"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
            Journal
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
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
                <div
                  className="relative overflow-hidden rounded-xl group cursor-pointer"
                  onClick={() => setLightbox({ src: item.image, alt: item.caption })}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
