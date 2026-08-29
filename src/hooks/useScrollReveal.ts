import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export function useScrollReveal<T extends HTMLElement>(
  targetSelector: string,
  options?: { stagger?: number; y?: number }
) {
  const sectionRef = useRef<T>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll(targetSelector);
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y: options?.y ?? 24 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: options?.stagger ?? 0.1,
            });
            observer.disconnect(); // only animate once
          }
        });
      },
      { threshold: 0.2 } // fires when 20% of the section is visible
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [targetSelector, options?.stagger, options?.y]);

  return sectionRef;
}