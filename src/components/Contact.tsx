'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

gsap.registerPlugin(ScrollTrigger);

// TODO: Replace with your actual contact info
const socialLinks = [
  { label: 'Email', href: 'mailto:hello@example.com', icon: 'M' },
  { label: 'GitHub', href: 'https://github.com', icon: 'G' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'L' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'T' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const emailLinkRef = useMagneticEffect<HTMLAnchorElement>({ strength: 0.4 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children ?? [], {
        opacity: 0,
        y: 30,
        stagger: 0.1,
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-[var(--spacing-section)] px-6 bg-[var(--color-surface)]"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto text-center">
        <p className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase">
          Contact
        </p>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Let&apos;s build something{' '}
          <span className="text-[var(--color-accent)]">worth talking about.</span>
        </h2>

        <p className="text-[var(--color-text-muted)] text-lg mb-10 max-w-xl mx-auto">
          Open to discussing AI products, product strategy, or just chatting about
          the future of human-computer interaction.
        </p>

        <a
          ref={emailLinkRef}
          href="mailto:hello@example.com"
          className="inline-block px-8 py-4 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          hello@example.com
        </a>

        <div className="flex justify-center gap-6 mt-10">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors text-sm font-medium"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* TODO: Add your resume PDF path */}
        <p className="text-[var(--color-text-muted)] text-sm mt-12">
          <a href="/resume.pdf" className="hover:text-[var(--color-text)] transition-colors">
            Download Resume PDF →
          </a>
        </p>
      </div>
    </section>
  );
}
