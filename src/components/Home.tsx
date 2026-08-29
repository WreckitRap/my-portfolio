import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { profile } from '../data/portfolioData';
import './Home.css';

const codeLines = [
  { indent: 0, text: 'const developer = {' },
  { indent: 1, text: `name: '${profile.name}',` },
  { indent: 1, text: `role: '${profile.role}',` },
  { indent: 1, text: `location: '${profile.location}',` },
  { indent: 1, text: "stack: ['Laravel', 'Vue', 'React', 'MySQL']," },
  { indent: 1, text: "focus: 'building things that actually ship'," },
  { indent: 0, text: '} as const;' },
];

function useTypedCode(lines: typeof codeLines, startDelayMs = 0) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(startDelayMs === 0);

  useEffect(() => {
    if (started) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const delay = prefersReduced ? 0 : startDelayMs;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [started, startDelayMs]);

  useEffect(() => {
    if (!started) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      setVisibleLines(lines.length);
      setDone(true);
      return;
    }

    if (visibleLines >= lines.length) {
      setDone(true);
      return;
    }

    const currentLine = lines[visibleLines].text;

    if (visibleChars < currentLine.length) {
      const timeout = setTimeout(() => setVisibleChars((c) => c + 1), 18);
      return () => clearTimeout(timeout);
    }

    const lineBreak = setTimeout(() => {
      setVisibleLines((l) => l + 1);
      setVisibleChars(0);
    }, 120);
    return () => clearTimeout(lineBreak);
  }, [visibleChars, visibleLines, lines, started]);

  return { visibleLines, visibleChars, done };
}

function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { visibleLines, visibleChars, done } = useTypedCode(codeLines, 500);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const copyTargets = sectionRef.current?.querySelectorAll('.hero-copy .reveal');
      const editor = sectionRef.current?.querySelector('.hero-editor');
      if (!copyTargets || !editor) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.set(copyTargets, { opacity: 0, y: 20 })
        .set(editor, { opacity: 0, y: 20, scale: 0.98 })
        .to(copyTargets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 })
        .to(editor, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-following glow, hero section only
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const moveX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' });
    const moveY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' });

    function handleMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      moveX(e.clientX - rect.left);
      moveY(e.clientY - rect.top);
    }

    function handleEnter() {
      gsap.to(glow, { opacity: 1, duration: 0.3 });
    }

    function handleLeave() {
      gsap.to(glow, { opacity: 0, duration: 0.4 });
    }

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseenter', handleEnter);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseenter', handleEnter);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section id="home" className="section hero" ref={sectionRef}>
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />

      <div className="section-inner hero-grid">
        <div className="hero-copy">
          <div className="eyebrow reveal">whoami</div>
          <h1 className="hero-title reveal">
            Hi, I'm {profile.name.split(' ')[0]} —<br />
            <span className="hero-title-accent">{profile.role}.</span>
          </h1>
          <p className="hero-tagline reveal">{profile.tagline}</p>
          <div className="hero-actions reveal">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="hero-editor" aria-hidden="true">
          <div className="hero-editor-titlebar">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
            <span className="hero-editor-filename mono">profile.ts</span>
          </div>
          <div className="hero-editor-body mono">
            {codeLines.map((line, i) => {
              if (i > visibleLines) return null;
              const isCurrent = i === visibleLines;
              const text = isCurrent ? line.text.slice(0, visibleChars) : line.text;
              if (isCurrent && visibleChars === 0) return null;

              return (
                <div
                  key={i}
                  className="hero-editor-line"
                  style={{ paddingLeft: `${line.indent * 20}px` }}
                >
                  <span className="hero-editor-lineno">{i + 1}</span>
                  <span>{text}</span>
                </div>
              );
            })}
            <span className={`hero-cursor ${done ? 'is-blinking' : ''}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;