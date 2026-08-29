import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './RoamingBot.css';

function RoamingBot() {
  const botRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bot = botRef.current;
    const sprite = spriteRef.current;
    if (!bot || !sprite) return;

    const ctx = gsap.context(() => {
      const walk = () => {
        const maxX = window.innerWidth - 90;
        const currentX = (gsap.getProperty(bot, 'x') as number) || 0;
        const target = currentX < maxX / 2 ? maxX : 0;

        gsap.to(sprite, { scaleX: target > currentX ? 1 : -1, duration: 0.2 });

        gsap.to(bot, {
          x: target,
          duration: gsap.utils.random(6, 10),
          ease: 'sine.inOut',
          onComplete: walk,
        });
      };

      gsap.to(sprite, {
        y: -6,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      walk();
    });

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <div ref={botRef} className="roaming-bot" aria-hidden="true">
      <div ref={spriteRef} className="roaming-bot-sprite">
        <svg viewBox="0 0 64 64" width="56" height="56">
          <ellipse cx="32" cy="58" rx="10" ry="3" fill="var(--accent)" opacity="0.5" />
          <rect x="22" y="42" width="8" height="14" rx="2" fill="var(--bg-elevated-2)" stroke="var(--border)" />
          <rect x="34" y="42" width="8" height="14" rx="2" fill="var(--bg-elevated-2)" stroke="var(--border)" />
          <rect x="18" y="24" width="28" height="20" rx="4" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="24" y="30" width="16" height="8" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" />
          <rect x="10" y="26" width="7" height="14" rx="3" fill="var(--bg-elevated-2)" stroke="var(--border)" />
          <rect x="47" y="26" width="7" height="14" rx="3" fill="var(--bg-elevated-2)" stroke="var(--border)" />
          <rect x="22" y="10" width="20" height="16" rx="5" fill="var(--bg-elevated-2)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="25" y="16" width="14" height="5" rx="2.5" fill="var(--teal)" opacity="0.9" />
          <line x1="32" y1="10" x2="32" y2="4" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx="32" cy="3" r="2" fill="var(--accent)" />
        </svg>
      </div>
    </div>
  );
}

export default RoamingBot;