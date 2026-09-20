import { useEffect, useRef, useState } from 'react';

interface Track {
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
}

const GENRES = ['chiptune', 'synthwave', 'lofi', 'jazz', 'retrowave'];

export default function MediaPlayerApp() {
  const [query, setQuery] = useState(GENRES[0]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);   // ← NEW: shuffle toggle
  const audioRef = useRef<HTMLAudioElement>(null);

  const search = async (term: string) => {
    setLoading(true);
    setPlaying(false);
    setCurrent(-1);
    setProgress(0);
    try {
      const r = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=25&country=US`,
      );
      const data = await r.json();
      const list: Track[] = (data.results ?? []).filter((t: Track) => t.previewUrl);
      setTracks(list);
    } catch {
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(GENRES[0]);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playIndex = (i: number) => {
    if (i < 0 || i >= tracks.length) return;
    setCurrent(i);
    setPlaying(true);
    const a = audioRef.current;
    if (a) {
      a.src = tracks[i].previewUrl;
      void a.play().catch(() => {});
    }
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || current < 0) {
      if (tracks.length) playIndex(0);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().catch(() => {});
      setPlaying(true);
    }
  };

  // ← CHANGED: shuffle-aware "next"
  const next = () => {
    if (!tracks.length) return;
    const i = shuffle
      ? Math.floor(Math.random() * tracks.length)
      : (current + 1) % tracks.length;
    playIndex(i);
  };
  const prev = () => tracks.length && playIndex((current - 1 + tracks.length) % tracks.length);

  const seek = (v: number) => {
    if (audioRef.current) audioRef.current.currentTime = v;
    setProgress(v);
  };

  const art = (u: string) => u.replace('100x100', '300x300');
  const cur = current >= 0 ? tracks[current] : null;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className="mp">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
        onEnded={next}
        onError={() => setPlaying(false)}
      />

      {/* now playing */}
      <div className="mp-stage">
        <div className={`mp-art ${playing ? 'spin' : ''}`}>
          {cur ? <img src={art(cur.artworkUrl100)} alt="" /> : <span className="mp-art-empty">♪</span>}
        </div>

        <div className="mp-info">
          <p className="mp-track">{cur ? cur.trackName : '— no track —'}</p>
          <p className="mp-artist">{cur ? `${cur.artistName} · ${cur.collectionName}` : 'pick a song below'}</p>

          <div className={`mp-viz ${playing ? 'on' : ''}`} aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>

          <div className="mp-bar">
            <span className="mp-time">{fmt(progress)}</span>
            <input
              className="mp-range"
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
            />
            <span className="mp-time">{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* transport */}
      <div className="mp-transport">
        <button className="os-btn mp-btn" onClick={prev} aria-label="Previous">⏮</button>
        <button className="os-btn mp-btn mp-play" onClick={toggle} aria-label="Play/Pause">
          {playing ? '⏸' : '▶'}
        </button>
        <button className="os-btn mp-btn" onClick={next} aria-label="Next">⏭</button>
        <button
          className={`os-btn mp-btn ${shuffle ? 'active' : ''}`}
          onClick={() => setShuffle((v) => !v)}
          aria-label="Shuffle"
          title="Shuffle"
        >🔀</button>
        <span className="mp-vol">🔊</span>
        <input
          className="mp-range mp-range-sm"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>

      {/* search */}
      <div className="mp-search">
        <div className="mp-chips">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`os-btn mp-chip ${g === query ? 'active' : ''}`}
              onClick={() => {
                setQuery(g);
                search(g);
              }}
            >
              {g}
            </button>
          ))}
        </div>
        <form
          className="mp-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) search(query.trim());
          }}
        >
          <input
            className="os-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search any artist / genre…"
          />
          <button className="os-btn" type="submit">Go</button>
        </form>
      </div>

      {/* playlist */}
      <div className="mp-list">
        {loading && <p className="mp-empty">📡 tuning the antenna…</p>}
        {!loading && tracks.length === 0 && <p className="mp-empty">no signal — try another word</p>}
        {tracks.map((t, i) => (
          <button
            key={`${t.previewUrl}-${i}`}
            className={`mp-row ${i === current ? 'active' : ''}`}
            onClick={() => playIndex(i)}
          >
            <img src={art(t.artworkUrl100)} alt="" />
            <span className="mp-row-txt">
              <b>{t.trackName}</b>
              <i>{t.artistName}</i>
            </span>
            <span className="mp-row-eq">{i === current && playing ? '♪♫' : ''}</span>
          </button>
        ))}
      </div>
    </div>
  );
}