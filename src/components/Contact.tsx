'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function WechatPopover({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#2c2c2e] rounded-xl p-6 max-w-xs text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/images/wechat-qr.jpeg"
          alt="WeChat QR"
          className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg"
        />
        <p className="text-[var(--color-text)] font-medium mb-1">Slow Factor</p>
        <p className="text-[var(--color-text-muted)] text-sm">微信扫码关注</p>
      </div>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showWechat, setShowWechat] = useState(false);

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

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/Ed321-max',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
    },
    {
      label: 'X',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:ruiyzfr321@gmail.com',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
    },
    {
      label: '公众号',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M4.5 4.5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2h-15zM8 8h8v1.5H8V8zm0 2.5h8V12H8v-1.5zm6 1.5c0 .28-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v1zm-3 3h-2v-1h2v1zm0-3.5h-2v-1h2v1zm0-2.5h-2v-1h2v1z"/>
        </svg>
      ),
      onClick: () => setShowWechat(true),
    },
  ];

  return (
    <>
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
            保持联系
          </h2>

          <p className="text-[var(--color-text-muted)] text-base mb-10 max-w-xl mx-auto">
            有想法或合作机会？直接写邮件给我。
          </p>

          <div className="flex justify-center gap-6 mt-10">
            {socialLinks.map(({ label, href, icon, onClick }) => (
              onClick ? (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)] group relative"
                  aria-label={label}
                >
                  {icon}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#2c2c2e] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                  </span>
                </button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)] group relative"
                  aria-label={label}
                >
                  {icon}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#2c2c2e] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                  </span>
                </a>
              )
            ))}
          </div>
        </div>
      </section>

      {showWechat && <WechatPopover onClose={() => setShowWechat(false)} />}
    </>
  );
}
