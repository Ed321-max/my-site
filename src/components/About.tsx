'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showWechatPopover, setShowWechatPopover] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children ?? [], {
        opacity: 0,
        y: 40,
        stagger: 0.15,
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

        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
          <div className="shrink-0 self-center md:self-auto">
            <img
              src="/images/avatar.webp"
              alt="Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover max-w-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              长期主义者，更相信长期稳定的价值
            </h2>
            <p className="text-[var(--color-text-muted)] text-base leading-relaxed">
              懂点科技，也懂生活。比起追逐每一次热潮，更在意那些在科技与人文交汇处不喧哗、却会慢慢塑造每个人的因素——它们决定了工具最终会把人带去哪里。
            </p>
          </div>
        </div>

        <div className="space-y-6 text-[var(--color-text-muted)] text-base leading-relaxed mb-6">
          <p>
            在做任何选择时，都更相信一套朴素但普适的价值判断：这件事能带来什么真实的改善（对自己、对他人）？它能否在更长的时间尺度上站得住，而不是只在当下看起来热闹？在现实约束与未来趋势之间，哪一种取舍更诚实、更可持续？所以比起追逐"该有的都有"，更愿意把注意力放在那些慢慢积累、但会长期改变能力与生活方式的东西上。
          </p>

          <p>
            最近在更主动地学习 AI 技术，也相信 AGI 会到来，但兴趣不在于"用 AI 做一个作品"本身，而在于用它去改写自己的生活方式，让日常更自由、更有掌控感。同时也在慢慢整理与沉淀自己的思考：不追更、不赶热度，公众号/博客更像记录。也在学习摄影，把生活留存下来。越是工具变强、选择变多，越觉得重要的不是做得多快，而是为什么要做、以及如何更好地服务于人。
          </p>
        </div>

        <p className="text-[var(--color-text-muted)] text-sm">
          公众号{' '}
          <button
            onClick={() => setShowWechatPopover(true)}
            className="text-[var(--color-text)] underline underline-offset-4 cursor-pointer hover:text-[var(--color-accent)] transition-colors"
          >
            Slow Factor
          </button>
        </p>

        {showWechatPopover && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWechatPopover(false)}
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
        )}
      </div>
    </section>
  );
}
