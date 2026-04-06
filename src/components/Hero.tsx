'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const desktopWords = [
  'Where technology meets humanity.',
  'Quiet forces. Lasting change.',
  'Small causes. Big emergence.',
];

const mobileWords = [
  'Tech meets humanity.',
  'Quiet forces.',
  'Lasting change.',
];

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const typewriterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const words = isMobile ? mobileWords : desktopWords;

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const pauseDuration = 3000;

    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          timeout = setTimeout(tick, isMobile ? 80 : 100);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          timeout = setTimeout(tick, isMobile ? 40 : 50);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    timeout = setTimeout(tick, isDeleting ? 50 : isMobile ? 80 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex, words, isMobile]);

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
      className="py-32 lg:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center max-w-5xl mx-auto px-6"
      >
        <h1 className="flex justify-center items-center w-full text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight overflow-visible">
          <span
            ref={typewriterRef}
            className="flex justify-center items-center h-auto overflow-visible"
          >
            {displayText}
          </span>
        </h1>

        <motion.p
          className="text-[var(--color-text-muted)] text-base md:text-lg max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          关注那些在科技与人文交汇处不喧哗却塑造每个人的"慢变量"。
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
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
