import { useRef } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { WindowState } from './useWindowManager';

interface WindowProps {
  state?: WindowState;
  title: string;
  icon?: string;
  width?: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}

export default function Window({
  state, title, icon, width = 520,
  onClose, onMinimize, onMaximize, onFocus, onMove, children,
}: WindowProps) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  if (!state || !state.open) return null;

  const startDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (state.maximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    drag.current = { dx: e.clientX - state.x, dy: e.clientY - state.y };

    const onMoveEv = (ev: PointerEvent) => {
      if (!drag.current) return;
      onMove(
        Math.min(Math.max(ev.clientX - drag.current.dx, -width + 80), window.innerWidth - 40),
        Math.min(Math.max(ev.clientY - drag.current.dy, 0), window.innerHeight - 80),
      );
    };

    const onUpEv = () => {
      drag.current = null;
      window.removeEventListener('pointermove', onMoveEv);
      window.removeEventListener('pointerup', onUpEv);
      window.removeEventListener('pointercancel', onUpEv);
    };

    window.addEventListener('pointermove', onMoveEv);
    window.addEventListener('pointerup', onUpEv);
    window.addEventListener('pointercancel', onUpEv);
  };

  const style: CSSProperties = state.maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 38px)', zIndex: state.z }
    : { left: state.x, top: state.y, width, zIndex: state.z };

  return (
    <section
      className={`os-window ${state.minimized ? 'is-minimized' : ''}`}
      style={style}
      onPointerDown={onFocus}
      aria-label={title}
    >
      <header
        className="os-titlebar"
        style={{ touchAction: 'none', userSelect: 'none' }}
        onPointerDown={startDrag}
        onDoubleClick={onMaximize}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        <span className="os-titlebar-text">{title}</span>
        <span className="os-titlebar-buttons">
          <button className="os-titlebtn" onClick={onMinimize} aria-label={`Minimize ${title}`}>_</button>
          <button className="os-titlebtn" onClick={onMaximize} aria-label={`Maximize ${title}`}>□</button>
          <button className="os-titlebtn" onClick={onClose} aria-label={`Close ${title}`}>×</button>
        </span>
      </header>
      <div className="os-window-body">{children}</div>
    </section>
  );
}