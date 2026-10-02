import { useEffect, useState } from "react";
import type { WindowId } from "./useWindowManager";

// Define context-aware messages per window ID
const CONTEXT_TIPS: Partial<Record<WindowId, string>> = {
  projects:
    "Working on something cool? Don't forget to document your tech stack! 📁",
  resume: "Need a PDF? Click 'Save as PDF' in the toolbar! 📄",
  guestbook: "Say hi! I promise Ralph reads every message. 👋",
  music: "Great taste! Chiptune hits different in Night Mode. 🎵",
  about: "Hi there! I'm Clippy. Did you know Ralph loves clean delivery? ✨",
  skills: "Vue.js, Laravel, React... quite the VILT/MERN master, huh? 🛠️",
  contact: "Ready to hire? My boss says yes! Send that email. 📧",
  computer: "System Properties? Fancy. Check out the uptime stats! 💻",
  recycle: "Empty bin? Good hygiene. jQuery spaghetti stays deleted. 🗑️",
  display: "Love the new wallpaper? Try Night Mode for late-night coding. 🌙",
  pizza: "Pizza Rat.exe running... delicious bugs detected. 🐀",
};

// Fallback generic tips when no specific window is active or for variety
const GENERIC_TIPS = [
  "It looks like you're trying to hire a Full Stack Developer. Would you like to open my Resume?",
  "Psst… right-click the desktop for secrets. 🤫",
  'Type "bsod" on your keyboard… if you dare. 💀',
  "You can change my wallpaper in Display Properties! 🎨",
  "Did you know this OS runs entirely in your browser? No servers harmed. ⚡",
];

interface ClippyProps {
  onOpenResume: () => void;
  activeWindow?: WindowId | null; // ← NEW PROP
}

export default function Clippy({ onOpenResume, activeWindow }: ClippyProps) {
  const [visible, setVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isGenericMode, setIsGenericMode] = useState(true);

  // Determine which message to show
  const currentMessage =
    !isGenericMode && activeWindow && CONTEXT_TIPS[activeWindow]
      ? CONTEXT_TIPS[activeWindow]
      : GENERIC_TIPS[tipIndex % GENERIC_TIPS.length];

  useEffect(() => {
    // Initial delay before showing up
    const firstShow = setTimeout(() => setVisible(true), 8000);

    // Loop through generic tips if not in context mode
    const loop = setInterval(() => {
      if (!isGenericMode) return; // Pause rotation during context hints

      setTipIndex((t) => t + 1);
      setVisible(true);
    }, 45000);

    return () => {
      clearTimeout(firstShow);
      clearInterval(loop);
    };
  }, [isGenericMode]);

  // Switch to Context Mode when a window opens/focuses
  useEffect(() => {
    if (activeWindow) {
      setIsGenericMode(false);
      setVisible(true); // Force show immediately when switching apps

      // Auto-return to Generic Mode after 10 seconds of no interaction
      const timeout = setTimeout(() => {
        setIsGenericMode(true);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [activeWindow]);

  if (!visible) return null;

  return (
    <div className="clippy">
      <div className="clippy-bubble">
        <p>{currentMessage}</p>
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
      <div className="clippy-body" aria-hidden="true">
        📎
      </div>
    </div>
  );
}
