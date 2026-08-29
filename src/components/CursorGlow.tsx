import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import './CursorGlow.css';

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const moveX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' });
    const moveY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' });

    function handleMove(e: MouseEvent) {
      moveX(e.clientX);
      moveY(e.clientY);
    }

    function handleEnter() {
      gsap.to(glow, { opacity: 1, duration: 0.3 });
    }

    function handleLeave() {
      gsap.to(glow, { opacity: 0, duration: 0.4 });
    }

    window.addEventListener('mousemove', handleMove);
    document.body.addEventListener('mouseenter', handleEnter);
    document.body.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseenter', handleEnter);
      document.body.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}

export default CursorGlow;