'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// TODO: Replace with your actual typewriter words
const typewriterWords = [
  'Build products that matter.',
  'Ship fast without breaking things.',
  'Design with data and taste.',
];

// TODO: Replace with your actual tagline
const tagline = 'I build products that bridge the gap between AI capability and human need.';

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

  const scrollTo = (href: string) => {
    if ((window as any).__lenisScrollTo) {
      (window as any).__lenisScrollTo(href, { offset: -80 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block">{displayText}</span>
          <motion.span
            className="inline-block w-1 h-full bg-[var(--color-accent)] ml-2 align-middle"
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
          {tagline}
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => scrollTo('#portfolio')}
            className="px-6 py-3 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            View Work
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="px-6 py-3 border border-[var(--color-border)] rounded-full font-medium hover:border-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            Get in Touch
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
