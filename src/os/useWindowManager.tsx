import { useCallback, useRef, useState } from 'react';
import { sounds } from './sounds';

export type WindowId =
  | 'computer' | 'about' | 'projects' | 'skills'
  | 'resume' | 'contact' | 'recycle' | 'display';

export interface WindowState {
  id: WindowId;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  x: number;
  y: number;
}

export const WINDOW_ORDER: WindowId[] = ['about', 'projects', 'skills', 'resume', 'contact'];

const DEFAULT_POS: Record<WindowId, { x: number; y: number }> = {
  computer: { x: 120, y: 60 },
  about:    { x: 200, y: 90 },
  projects: { x: 250, y: 70 },
  skills:   { x: 310, y: 110 },
  resume:   { x: 230, y: 50 },
  contact:  { x: 370, y: 130 },
  recycle:  { x: 300, y: 150 },
  display:  { x: 340, y: 120 },
};

function initialState(): Record<WindowId, WindowState> {
  const ids: WindowId[] = ['computer', ...WINDOW_ORDER, 'recycle', 'display'];
  return Object.fromEntries(
    ids.map((id, i) => [
      id,
      { id, open: false, minimized: false, maximized: false, z: 10 + i, ...DEFAULT_POS[id] },
    ]),
  ) as Record<WindowId, WindowState>;
}

export function useWindowManager() {
  const [windows, setWindows] = useState(initialState);
  const topZ = useRef(20);

  const patch = useCallback((id: WindowId, p: Partial<WindowState>) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], ...p } }));
  }, []);

  const focus = useCallback((id: WindowId) => {
    topZ.current += 1;
    patch(id, { z: topZ.current, minimized: false });
  }, [patch]);

  const open = useCallback((id: WindowId) => {
  sounds.click();
  topZ.current += 1;
  patch(id, { open: true, minimized: false, z: topZ.current });
}, [patch]);

    const close = useCallback((id: WindowId) => {
    sounds.click();
    patch(id, { open: false, maximized: false });
    }, [patch]);

    const minimize = useCallback((id: WindowId) => {
    sounds.click();
    patch(id, { minimized: true });
    }, [patch]);

    const toggleMaximize = useCallback((id: WindowId) => {
    sounds.click();
    topZ.current += 1;
    const z = topZ.current;
    setWindows((w) => ({
        ...w,
        [id]: { ...w[id], maximized: !w[id].maximized, minimized: false, z },
    }));
    }, []);



  const move = useCallback((id: WindowId, x: number, y: number) => patch(id, { x, y }), [patch]);

  return { windows, open, close, minimize, toggleMaximize, focus, move };
}

