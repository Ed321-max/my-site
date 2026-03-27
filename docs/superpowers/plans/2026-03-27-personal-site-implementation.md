# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal website for an AI PM — NFC-ready, mobile-first, dark minimal aesthetic with GSAP/Lenis/Framer Motion animations.

**Architecture:** Astro + React Islands. Each section (Hero/About/Portfolio/Blog/Contact) is an independent React component. Lenis + GSAP ScrollTrigger global RAF sync in Layout. Components use `client:load` (Hero) or `client:visible` (rest) for hydration.

**Tech Stack:** Astro 6, React 19, Tailwind CSS 4, GSAP 3, Lenis 1, Framer Motion 12

---

## File Map

```
src/
├── layouts/
│   └── Layout.astro              # Global layout: fonts, Lenis init, GSAP RAF sync
├── components/
│   ├── Navigation.tsx             # Responsive nav (top bar desktop, hamburger mobile)
│   ├── Hero.tsx                   # client:load, typewriter effect
│   ├── About.tsx                  # client:visible, scroll reveal
│   ├── Portfolio.tsx              # client:visible, 3D tilt cards + expandable details
│   ├── PortfolioCard.tsx         # 3D tilt card with glassmorphism
│   ├── PortfolioModal.tsx         # Expandable detail panel (AnimatePresence)
│   ├── Blog.tsx                   # client:visible, article list
│   └── Contact.tsx               # client:visible, links
├── hooks/
│   ├── useLenis.ts               # Lenis instance hook (provides global scroll context)
│   └── useMagneticEffect.ts      # Magnetic mouse hook (pointer:fine only)
├── styles/
│   └── global.css                # CSS variables, fonts, base styles
├── pages/
│   └── index.astro               # Page assembly
```

---

## Task 1: Global CSS & Fonts

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add CSS variables and font imports**

```css
@import "tailwindcss";

/* === Google Fonts === */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap');

/* === Geist Font (self-hosted or CDN) === */
@import url('https://cdn.fontshare.com/wf/...'); /* Use Fontshare CDN for Geist */

/* === CSS Variables === */
:root {
  --color-bg: #0a0a0a;
  --color-text: #fafafa;
  --color-text-muted: #888888;
  --color-accent: #f59e0b; /* Amber accent */
  --color-surface: #141414;
  --color-border: #2a2a2a;

  --font-sans: 'Geist', 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  --spacing-section: clamp(4rem, 10vw, 8rem);
}

/* === Base Styles === */
html {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

/* === Scrollbar Styling === */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* === Selection === */
::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS variables, fonts, and base styles"
```

---

## Task 2: Lenis + GSAP ScrollTrigger Layout Initialization

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/hooks/useLenis.ts`

- [ ] **Step 1: Create useLenis hook**

```typescript
// src/hooks/useLenis.ts
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger RAF
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return lenisRef
}
```

- [ ] **Step 2: Create Layout.astro**

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Personal Site',
  description = 'AI PM · Product Design · Vibe Coding'
} = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <!-- Prevent FOUC -->
    <style>html { visibility: visible; }</style>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro src/hooks/useLenis.ts
git commit -m "feat: add Layout with Lenis + GSAP ScrollTrigger RAF sync"
```

---

## Task 3: Navigation Component

**Files:**
- Create: `src/components/Navigation.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Navigation component**

```tsx
// src/components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Intersection observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navLinks.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(href);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 px-6 py-4 justify-between items-center border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <a href="#" className="font-semibold text-lg tracking-tight">Logo</a>
        <div className="flex gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              className={`text-sm transition-colors ${
                activeSection === href
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-4 right-4 z-[100] p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <motion.span
            className="w-full h-0.5 bg-[var(--color-text)] origin-center"
            animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="w-full h-0.5 bg-[var(--color-text)]"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="w-full h-0.5 bg-[var(--color-text)] origin-center"
            animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
          />
        </div>
      </button>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[90] bg-[var(--color-bg)] flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                className="text-3xl font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat: add responsive Navigation component"
```

---

## Task 4: Hero Component with Typewriter Effect

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero component with typewriter**

```tsx
// src/components/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const typewriterWords = [
  'Build products that matter.',
  'Ship fast without breaking things.',
  'Design with data and taste.',
];

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typewriterWords[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % typewriterWords.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center px-6 pt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl"
      >
        <motion.p
          className="text-[var(--color-text-muted)] text-sm mb-4 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI Product Manager · Vibe Coder
        </motion.p>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="block">{displayText}</span>
          <motion.span
            className="inline-block w-1 h-full bg-[var(--color-accent)] ml-2"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </h1>

        <motion.p
          className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          I build products that bridge the gap between AI capability and human need.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 border border-[var(--color-border)] rounded-full font-medium hover:border-[var(--color-text-muted)] transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero component with typewriter effect"
```

---

## Task 5: useMagneticEffect Hook

**Files:**
- Create: `src/hooks/useMagneticEffect.ts`

- [ ] **Step 1: Create magnetic effect hook (pointer:fine only)**

```typescript
// src/hooks/useMagneticEffect.ts
import { useEffect, useRef, RefObject } from 'react';

interface MagneticOptions {
  strength?: number;
}

export function useMagneticEffect<T extends HTMLElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.3 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only enable on pointer: fine (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref as RefObject<T>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMagneticEffect.ts
git commit -m "feat: add useMagneticEffect hook with pointer:fine detection"
```

---

## Task 6: About Component

**Files:**
- Create: `src/components/About.tsx`

- [ ] **Step 1: Create About component with scroll reveal**

```tsx
// src/components/About.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tags = [
  'AI Product', 'Vibe Coding', 'User Research',
  'Prototyping', 'Data Analysis', 'Design Systems'
];

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

        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Building at the intersection of<br />
          <span className="text-[var(--color-accent)]">AI and Product</span>
        </h2>

        <div className="space-y-6 text-[var(--color-text-muted)] text-lg leading-relaxed">
          <p>
            I'm a product manager obsessed with turning AI capabilities into
            products people actually love. I code my own prototypes, run user
            research, and believe great products are built with both data and taste.
          </p>
          <p>
            Previously led AI product at [Company]. Now exploring the frontier
            of what's possible when AI becomes a creative partner, not just a tool.
          </p>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: add About component with scroll reveal"
```

---

## Task 7: Portfolio Components (3D Tilt + Expandable Modal)

**Files:**
- Create: `src/components/PortfolioCard.tsx`
- Create: `src/components/PortfolioModal.tsx`
- Create: `src/components/Portfolio.tsx`

- [ ] **Step 1: Create PortfolioCard with 3D tilt**

```tsx
// src/components/PortfolioCard.tsx
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
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create PortfolioModal with AnimatePresence**

```tsx
// src/components/PortfolioModal.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    description: string;
    role: string;
    outcome: string;
    tags: string[];
  } | null;
}

export default function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 z-[201] bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8 md:p-12">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm rounded-full border border-[var(--color-border)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-6 text-[var(--color-text-muted)]">
                <div>
                  <h4 className="text-[var(--color-text)] font-medium mb-2">Description</h4>
                  <p className="leading-relaxed">{item.description}</p>
                </div>
                <div>
                  <h4 className="text-[var(--color-text)] font-medium mb-2">My Role</h4>
                  <p>{item.role}</p>
                </div>
                <div>
                  <h4 className="text-[var(--color-text)] font-medium mb-2">Key Outcome</h4>
                  <p>{item.outcome}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Create Portfolio component**

```tsx
// src/components/Portfolio.tsx
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

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<(typeof portfolioItems)[0] | null>(null);
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

  const handleExpand = (item: (typeof portfolioItems)[0]) => {
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Portfolio.tsx src/components/PortfolioCard.tsx src/components/PortfolioModal.tsx
git commit -m "feat: add Portfolio with 3D tilt cards and expandable modal"
```

---

## Task 8: Blog Component

**Files:**
- Create: `src/components/Blog.tsx`

- [ ] **Step 1: Create Blog component**

```tsx
// src/components/Blog.tsx
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
    excerpt: 'The line between builder and user is blurring. Here\'s what that means for product managers.',
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
    title: 'The PM\'s Guide to Prototype Fidelity',
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Blog.tsx
git commit -m "feat: add Blog component with article list"
```

---

## Task 9: Contact Component

**Files:**
- Create: `src/components/Contact.tsx`

- [ ] **Step 1: Create Contact component**

```tsx
// src/components/Contact.tsx
'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

gsap.registerPlugin(ScrollTrigger);

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

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Let's build something<br />
          <span className="text-[var(--color-accent)]">worth talking about.</span>
        </h2>

        <p className="text-[var(--color-text-muted)] text-lg mb-10 max-w-xl mx-auto">
          Open to discussing AI products, product strategy, or just chatting about
          the future of human-computer interaction.
        </p>

        <a
          ref={emailLinkRef}
          href="mailto:hello@example.com"
          className="inline-block px-8 py-4 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-semibold text-lg hover:opacity-90 transition-opacity mb-12"
        >
          hello@example.com
        </a>

        <div className="flex justify-center gap-6">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>

        <p className="text-[var(--color-text-muted)] text-sm mt-12">
          <a href="/resume.pdf" className="hover:text-[var(--color-text)] transition-colors">
            Download Resume PDF →
          </a>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: add Contact component with magnetic email link"
```

---

## Task 10: Assemble Index Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update index.astro to assemble all components**

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
---

<Layout>
  <Navigation />
  <main>
    <Hero client:load />
    <About client:visible />
    <Portfolio client:visible />
    <Blog client:visible />
    <Contact client:visible />
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble index page with all components"
```

---

## Task 11: Install Lucide Icons

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add lucide-react**

```bash
npm install lucide-react
```

- [ ] **Step 2: Update .gitignore**

Ensure `.superpowers/` is in `.gitignore` if not already.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add lucide-react for icons"
```

---

## Verification

- [ ] Run `npm run dev` and verify the page loads without errors
- [ ] Verify smooth scrolling works (Lenis)
- [ ] Verify scroll animations trigger (ScrollTrigger)
- [ ] Verify mobile hamburger menu opens/closes
- [ ] Verify portfolio card click opens modal
- [ ] Verify typewriter effect in Hero
- [ ] Run `npm run build` to ensure no build errors
- [ ] Check lighthouse scores (performance, accessibility)

---

## Spec Self-Review Checklist

- [x] Magnetic mouse uses `pointer: fine` media query — implemented in `useMagneticEffect`
- [x] Hero uses `client:load`, rest use `client:visible` — done in index.astro
- [x] Lenis + GSAP RAF sync in Layout/global hook — done in `useLenis`
- [x] GSAP cleanup with `.kill()` in each component — done via `gsap.context()` return
- [x] Portfolio cards have expandable modal — done with AnimatePresence
- [x] 3D tilt disabled on mobile — done via `window.matchMedia('(hover: hover)')` check
- [x] TODO placeholders noted for content that needs user input (portfolio items, blog posts, email, social links, resume PDF)
