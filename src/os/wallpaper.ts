import type { CSSProperties } from 'react';

export type WallpaperId = 'teal' | 'hawkins' | 'purple' | 'stars';

export interface Wallpaper {
  label: string;
  style: CSSProperties;
}

export const WALLPAPERS: Record<WallpaperId, Wallpaper> = {
  teal: {
    label: 'Classic Teal',
    style: { backgroundColor: '#008080', backgroundImage: 'none' },
  },
  hawkins: {
    label: 'Hawkins Pixels',
    style: {
      backgroundColor: '#222',
      backgroundImage: "url('/my/stranger_things.png')",
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
  },
  purple: {
    label: 'Purple Void',
    style: {
      backgroundColor: '#0d0518',
      backgroundImage: 'radial-gradient(circle at 50% 35%, #2b1055 0%, #0d0518 75%)',
    },
  },
  stars: {
    label: 'Starry Night',
    style: {
      backgroundColor: '#000010',
      backgroundImage:
        'radial-gradient(1px 1px at 25px 35px, #fff, transparent), radial-gradient(1px 1px at 75px 90px, #cfd8ff, transparent), radial-gradient(1.5px 1.5px at 140px 40px, #fff, transparent), radial-gradient(1px 1px at 180px 130px, #9fb4ff, transparent), radial-gradient(1.5px 1.5px at 60px 160px, #fff, transparent)',
      backgroundSize: '200px 200px',
      backgroundRepeat: 'repeat',
    },
  },
};

export const WALLPAPER_IDS = Object.keys(WALLPAPERS) as WallpaperId[];

export const DEFAULT_WALLPAPER: WallpaperId = 'hawkins'; // your current look 😄