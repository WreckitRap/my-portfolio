import { useEffect, useState } from 'react';
import { WINDOW_ORDER } from './useWindowManager';
import type { WindowId, WindowState } from './useWindowManager';
import { sounds } from './sounds';

interface TaskbarProps {
  windows: Record<WindowId, WindowState>;
  onOpen: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onShutdown: () => void;
}

const MENU: { id: WindowId; icon: string; label: string }[] = [
  { id: 'about', icon: '📝', label: 'About Me' },
  { id: 'projects', icon: '📁', label: 'Projects' },
  { id: 'skills', icon: '🛠️', label: 'Skills' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'pizza', icon: '🐀', label: 'Pizza Rat' },
];

export default function Taskbar({ windows, onOpen, onFocus, onMinimize, onShutdown }: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [muted, setMuted] = useState(sounds.isMuted());
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sounds.setMuted(next);
    if (!next) sounds.click();
  };

  const openWins = WINDOW_ORDER.map((id) => windows[id]).filter(
    (w) => w.open && !w.minimized,
  );
  const topId = openWins.length
    ? openWins.reduce((a, b) => (a.z > b.z ? a : b)).id
    : null;

  const taskClick = (id: WindowId) => {
    const w = windows[id];
    if (!w.open || w.minimized) onFocus(id);
    else if (id === topId) onMinimize(id);
    else onFocus(id);
  };

  return (
    <>
      {startOpen && <div className="os-overlay" onClick={() => setStartOpen(false)} />}
      {startOpen && (
        <nav className="os-startmenu" aria-label="Start menu">
          <div className="os-startmenu-side">PortfolioOS 95</div>
          <div className="os-startmenu-items">
            {MENU.map((m) => (
              <button
                key={m.id}
                className="os-startmenu-item"
                onClick={() => {
                  onOpen(m.id);
                  setStartOpen(false);
                }}
              >
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </button>
            ))}
            <div className="os-startmenu-sep" />
            <button className="os-startmenu-item" onClick={onShutdown}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M12 2v10" />
                <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
              </svg>
              Shut Down…
            </button>
          </div>
        </nav>
      )}

      <footer className="os-taskbar">
        <button className="os-btn os-start" onClick={() => setStartOpen((v) => !v)}>
          <span className="os-start-flag" aria-hidden="true">
            <span className="os-flag-red" />
            <span className="os-flag-green" />
            <span className="os-flag-blue" />
            <span className="os-flag-yellow" />
          </span>
          Start
        </button>

        {WINDOW_ORDER.filter((id) => windows[id].open).map((id) => {
          const item = MENU.find((m) => m.id === id);
          if (!item) return null;
          return (
            <button
              key={id}
              className={`os-btn os-task ${id === topId ? 'active' : ''}`}
              onClick={() => taskClick(id)}
            >
              {item.icon} <span className="os-task-label">{item.label}</span>
            </button>
          );
        })}

        <span className="os-tray">
          <button
            className="os-tray-mute"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            title={muted ? 'Sound: off' : 'Sound: on'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </footer>
    </>
  );
}