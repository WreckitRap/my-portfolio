import { useEffect, useState } from 'react';

const TIPS = [
  "It looks like you're trying to hire a Full Stack Developer. Would you like to open my Resume?",
  'Psst… right-click the desktop for secrets. 🤫',
  'Type "bsod" on your keyboard… if you dare. 💀',
  'You can change my wallpaper in Display Properties! 🎨',
];

export default function Clippy({ onOpenResume }: { onOpenResume: () => void }) {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const first = setTimeout(() => setVisible(true), 8000);
    const loop = setInterval(() => {
      setTip((t) => (t + 1) % TIPS.length);
      setVisible(true);
    }, 45000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="clippy">
      <div className="clippy-bubble">
        <p>{TIPS[tip]}</p>
        <div className="clippy-actions">
          <button
            className="os-btn"
            onClick={() => {
              onOpenResume();
              setVisible(false);
            }}
          >
            Open Resume
          </button>
          <button className="os-btn" onClick={() => setVisible(false)}>
            Hide
          </button>
        </div>
      </div>
      <div className="clippy-body" aria-hidden="true">📎</div>
    </div>
  );
}