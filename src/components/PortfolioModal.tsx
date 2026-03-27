'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioItem {
  title: string;
  description: string;
  role: string;
  outcome: string;
  tags: string[];
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
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
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full border border-[var(--color-border)]"
                  >
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
