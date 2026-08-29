import { useEffect, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useWindowManager } from './useWindowManager';
import type { WindowId } from './useWindowManager';
import Window from './Window';
import Taskbar from './Taskbar';
import {
  AboutApp,
  ComputerApp,
  ContactApp,
  ProjectsApp,
  RecycleApp,
  ResumeApp,
  SkillsApp,
  DisplayApp,
} from './app';
import './os95.css';
import { WALLPAPERS, DEFAULT_WALLPAPER } from './wallpaper';
import type { WallpaperId } from './wallpaper';
import { sounds } from './sounds';
import Screensaver from './Screensaver';
import Clippy from './Clippy';
import PizzaRatGame from './PizzaRatGame';

type Phase = 'off' | 'bios' | 'booting' | 'on' | 'shutdown' | 'bsod';

const ICONS: { id: WindowId; icon: string; label: string }[] = [
  { id: 'computer', icon: '🖥️', label: 'My Computer' },
  { id: 'about', icon: '📝', label: 'about_me.txt' },
  { id: 'projects', icon: '📁', label: 'Projects' },
  { id: 'skills', icon: '🛠️', label: 'Skills.exe' },
  { id: 'resume', icon: '📄', label: 'resume.doc' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin' },
  { id: 'pizza', icon: '🐀', label: 'pizza_rat.exe' },
];

const BIOS_LINES = [
  'Portfolio BIOS v4.2 - (C) 1995 Tungcul Systems',
  'CPU : VILT/MERN Dual-Stack Processor @ 3.5GHz',
  'Memory Test : 640K OK (ought to be enough for anybody)',
  'Detecting PRIMARY SKILLS .. Vue.js Laravel React Node.js',
  'Detecting SECONDARY .. MySQL MongoDB Tailwind CSS',
  'C:\\> boot PORTFOLIO.SYS',
];

const LOADER_BLOCKS = 14;

const coarse =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

function BiosScreen({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= BIOS_LINES.length) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => setCount((currentCount) => currentCount + 1),
      count === 0 ? 400 : 500,
    );

    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div
      className="os-screen os-bios"
      onClick={onDone}
      aria-label="Boot screen"
      title="Click to skip"
    >
      {BIOS_LINES.slice(0, count).map((line) => (
        <p key={line} className="os-bios-line">
          {line}
        </p>
      ))}

      <p className="os-bios-line os-bios-cursor" aria-hidden="true" />
    </div>
  );
}

function PowerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
    </svg>
  );
}

export default function PortfolioOS() {
  const [phase, setPhase] = useState<Phase>('off');

  const [deskMenu, setDeskMenu] = useState<{ x: number; y: number } | null>(null);

  const [saver, setSaver] = useState(false);

  const [wallpaper, setWallpaper] = useState<WallpaperId>(() => {
    try {
      const saved = localStorage.getItem('portfolioos-wallpaper');
      if (saved && saved in WALLPAPERS) return saved as WallpaperId;
    } catch {
      /* ignore */
    }
    return DEFAULT_WALLPAPER;
  });

  const pickWallpaper = (id: WallpaperId) => {
    setWallpaper(id);
    try {
      localStorage.setItem('portfolioos-wallpaper', id);
    } catch {
      /* ignore */
    }
  };

  const { windows, open, close, minimize, toggleMaximize, focus, move } =
    useWindowManager();

  const powerOn = () => {
    sounds.startup();
    setPhase('bios');
  };

  const onDesktopContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest('input, textarea, select, a')) return;

    event.preventDefault();

    setDeskMenu({
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - 170)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - 110)),
    });
  };

  useEffect(() => {
    if (phase !== 'booting') return;

    const t = setTimeout(() => {
      setPhase('on');
      open('about');
    }, 2800);

    return () => clearTimeout(t);
  }, [phase, open]);

  useEffect(() => {
    if (phase !== 'on') {
      setSaver(false);
      return;
    }

    let timer = window.setTimeout(() => setSaver(true), 120000);

    const reset = () => {
      setSaver(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSaver(true), 120000);
    };

    const evs = ['mousemove', 'mousedown', 'keydown', 'touchstart'] as const;
    evs.forEach((e) => window.addEventListener(e, reset));

    return () => {
      evs.forEach((e) => window.removeEventListener(e, reset));
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    let buf = '';
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea')) return;

      if (e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-4);
        if (buf === 'bsod') {
          buf = '';
          sounds.error();
          setPhase('bsod');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (phase !== 'bsod') return;

    const wake = () => setPhase('off');
    window.addEventListener('keydown', wake);
    window.addEventListener('mousedown', wake);

    return () => {
      window.removeEventListener('keydown', wake);
      window.removeEventListener('mousedown', wake);
    };
  }, [phase]);

  if (phase === 'bsod') {
    return (
      <div className="os-screen os-bsod">
        <p className="bsod-title">PortfolioOS</p>
        <p>
          A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
          00010E36. The current portfolio will be terminated.
        </p>
        <p>* Relax — this is just an easter egg. Your projects are safe in the Upside Down.</p>
        <p>* Press any key (or click) to reboot PortfolioOS 95.</p>
      </div>
    );
  }

  if (phase === 'off') {
    return (
      <div className="os-screen os-off os-power-screen">
        <div className="os-off-logo">
          <span className="os-flag" aria-hidden="true">
            <span className="os-flag-red" />
            <span className="os-flag-green" />
            <span className="os-flag-blue" />
            <span className="os-flag-yellow" />
          </span>

          <span className="os-off-title">
            PortfolioOS <span className="os-off-95">95</span>
          </span>
        </div>

        <p className="os-off-copy">Copyright (C) 1995 Tungcul Systems</p>

        <button className="os-power" onClick={powerOn}>
          <PowerIcon />
          POWER
        </button>

        <p className="os-off-hint">press power to start</p>
      </div>
    );
  }

  if (phase === 'shutdown') {
    return (
      <div className="os-screen os-off os-shutdown-screen">
        <p className="os-safe-line">It's now safe to turn off your computer.</p>

        <button className="os-power" onClick={powerOn}>
          <PowerIcon />
          POWER
        </button>
      </div>
    );
  }

  if (phase === 'bios') {
    return <BiosScreen onDone={() => setPhase('booting')} />;
  }

  if (phase === 'booting') {
    return (
      <div className="os-screen os-boot">
        <div className="os-boot-logo">
          <span className="os-flag" aria-hidden="true">
            <span className="os-flag-red" />
            <span className="os-flag-green" />
            <span className="os-flag-blue" />
            <span className="os-flag-yellow" />
          </span>

          <span className="os-boot-title">
            PortfolioOS <span className="os-boot-95">95</span>
          </span>
        </div>

        <div className="os-loader" aria-hidden="true">
          {Array.from({ length: LOADER_BLOCKS }).map((_, index) => (
            <span
              key={index}
              className="os-loader-block"
              style={{ animationDelay: `${0.15 + index * 0.14}s` }}
            />
          ))}
        </div>

        <p className="os-boot-text">Starting PortfolioOS…</p>
      </div>
    );
  }

  const win = (
    id: WindowId,
    title: string,
    icon: string,
    width: number,
    body: ReactNode,
  ) => (
    <Window
      state={windows[id]}
      title={title}
      icon={icon}
      width={width}
      onClose={() => close(id)}
      onMinimize={() => minimize(id)}
      onMaximize={() => toggleMaximize(id)}
      onFocus={() => focus(id)}
      onMove={(x, y) => move(id, x, y)}
    >
      {body}
    </Window>
  );

  return (
    <div
      className="os-desktop"
      style={WALLPAPERS[wallpaper].style}
      onContextMenu={onDesktopContextMenu}
      onClick={() => setDeskMenu(null)}
    >
      <div className="os-icons">
        {ICONS.map((ic) => (
          <button
            key={ic.id}
            className="os-icon"
            onPointerUp={(event) => {
              // ✅ fingers (real phones + DevTools emulation) open on tap
              if (event.pointerType === 'touch') open(ic.id);
            }}
            onClick={(event) => {
              // keyboard (Enter/Space) + touch fallback
              if (coarse || event.detail === 0) open(ic.id);
            }}
            onDoubleClick={() => open(ic.id)}
          >
            <span className="os-icon-img" aria-hidden="true">
              {ic.icon}
            </span>
            <span className="os-icon-label">{ic.label}</span>
          </button>
        ))}
      </div>

      {win('computer', 'System Properties', '🖥️', 420, <ComputerApp />)}
      {win('about', 'about_me.txt - Notepad', '📝', 470, <AboutApp />)}
      {win('projects', 'C:\\PROJECTS', '📁', 560, <ProjectsApp />)}
      {win('skills', 'Skills - Control Panel', '🛠️', 420, <SkillsApp />)}
      {win('resume', 'resume.doc - WordPad', '📄', 560, <ResumeApp />)}
      {win('contact', 'New Message', '📧', 430, <ContactApp />)}
      {win('recycle', 'Recycle Bin', '🗑️', 380, <RecycleApp />)}
      {win(
        'display',
        'Display Properties',
        '🎨',
        380,
        <DisplayApp current={wallpaper} onPick={pickWallpaper} />
      )}
      {win('pizza', 'Pizza Rat', '🐀', 380, <PizzaRatGame />)}

      <Taskbar
        windows={windows}
        onOpen={open}
        onFocus={focus}
        onMinimize={minimize}
        onShutdown={() => {
          sounds.shutdown();
          setPhase('shutdown');
        }}
      />

      {deskMenu && (
        <div
          className="os-ctx-menu os-desktop-menu"
          style={{ left: deskMenu.x, top: deskMenu.y }}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button className="os-ctx-item" onClick={() => setDeskMenu(null)}>
            <span aria-hidden="true">🔄</span> Refresh
          </button>

          <div className="os-ctx-sep" />

          <button
            className="os-ctx-item"
            onClick={() => {
              setDeskMenu(null);
              open('computer');
            }}
          >
            <span aria-hidden="true">⚙️</span> Properties
          </button>

          <button
            className="os-ctx-item"
            onClick={() => {
              setDeskMenu(null);
              open('display');
            }}
          >
            <span aria-hidden="true">🎨</span> Display Properties
          </button>
        </div>
      )}

      {saver && <Screensaver onWake={() => setSaver(false)} />}

      {!saver && <Clippy onOpenResume={() => open('resume')} />}
    </div>
  );
}