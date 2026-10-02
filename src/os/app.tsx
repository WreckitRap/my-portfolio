import { useEffect, useRef, useState } from "react"; // ✅ Added useRef
import type { FormEvent } from "react";
import {
  aboutText,
  profile,
  projects,
  skills,
  resume,
} from "../data/portfolioData";
import type { Project } from "../data/portfolioData";
import { WALLPAPERS, WALLPAPER_IDS, SCHEMES } from "./wallpaper";
import type { WallpaperId, SchemeId } from "./wallpaper";
import { sounds } from "./sounds";
import { Mascot } from "page-mascot";

export function ComputerApp() {
  return (
    <div className="sysprops">
      <div className="sysprops-logo">💻 RALPH TUNGCUL 95</div>
      <div className="sysprops-sub">{profile.title} · Second Owner</div>

      <table className="sysprops-table">
        <tbody>
          <tr>
            <td>CPU:</td>
            <td>VILT / MERN Dual-Stack Processor</td>
          </tr>
          <tr>
            <td>Memory:</td>
            <td>PHP · Vue.js · Laravel · React · Node.js</td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{profile.location}</td>
          </tr>
          <tr>
            <td>Uptime:</td>
            <td>Shipping web apps since 2023</td>
          </tr>
          <tr>
            <td>Status:</td>
            <td className="ok">● Open to opportunities</td>
          </tr>
        </tbody>
      </table>

      <p className="sysprops-reg">
        Registered to: a full stack developer who likes clean delivery
      </p>
    </div>
  );
}

export function AboutApp() {
  return (
    <div className="notepad">
      <div className="os-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Search</span>
        <span>Help</span>
      </div>

      <div className="notepad-body">
        <p>Hello, world!</p>

        {/*  + intro side by side */}
        <div className="about-hero">
          <div className="about-hero-mascot mascot-static">
            <Mascot
              directions="/mascots/ralph-directions.png"
              size={110}
              label="Ralph"
            />
          </div>
          <p className="about-hero-text">{aboutText[0]}</p>
        </div>

        {/* the rest of the paragraphs below, full width */}
        {aboutText.slice(1).map((paragraph, index) => (
          <p key={`about-paragraph-${index}`}>{paragraph}</p>
        ))}

        <p className="notepad-meta">
          &gt; currently: {profile.currentlyLearning}
          <br />
          &gt; location:&nbsp;&nbsp;{profile.location}
          <br />
          &gt; open_to:&nbsp;&nbsp;&nbsp;{profile.openTo}
        </p>
      </div>
    </div>
  );
}

export function ProjectsApp() {
  const [selected, setSelected] = useState<string | null>(null);

  const current = projects.find((project) => project.name === selected);

  const withProtocol = (url: string) =>
    url.startsWith("http") ? url : `https://${url}`;

  const openProject = (project: Project) => {
    if (!project.link) return;
    window.open(withProtocol(project.link), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="explorer">
      <table className="os-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Year</th>
            <th>Impact</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr
              key={project.name}
              className={`${selected === project.name ? "selected" : ""} ${
                project.link ? "has-link" : ""
              }`}
              tabIndex={0}
              onClick={() => setSelected(project.name)}
              onDoubleClick={() => openProject(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter") openProject(project);
              }}
            >
              <td>
                {project.icon} {project.name}
              </td>
              <td>{project.role}</td>
              <td>{project.year}</td>
              <td>{project.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="explorer-hint">
        {current ? (
          <>
            {current.description}{" "}
            {current.link && (
              <a
                href={withProtocol(current.link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Open
              </a>
            )}{" "}
          </>
        ) : (
          "Double-click a file to open it… (or single-click, we're not monsters)"
        )}
      </p>
    </div>
  );
}

export function SkillsApp() {
  const tabs = Object.keys(skills);
  const [tab, setTab] = useState(tabs[0] ?? "");

  return (
    <div className="control-panel">
      <div className="os-tabs">
        {tabs.map((tabName) => (
          <button
            key={tabName}
            className={`os-tab ${tabName === tab ? "active" : ""}`}
            onClick={() => setTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>

      <div className="os-tab-body">
        {(skills[tab] ?? []).map((skill) => (
          <label key={skill} className="os-check">
            <input type="checkbox" checked readOnly /> {skill}
          </label>
        ))}
      </div>
    </div>
  );
}

export function ResumeApp() {
  return (
    <div className="wordpad">
      <div className="wordpad-body">
        <h1>{resume.name.toUpperCase()}</h1>
        <p className="wp-sub">
          {resume.title} · {resume.email} · {resume.linkedin}
        </p>

        <h2>EXPERIENCE</h2>
        <ul className="wp-experience">
          {resume.experience.map((job) => (
            <li key={`${job.company}-${job.role}`}>
              <strong>
                {job.role} — {job.company} ({job.period})
              </strong>
              <br />
              {job.detail}
            </li>
          ))}
        </ul>

        <h2>EDUCATION</h2>
        <p>{resume.education}</p>

        <h2>CERTIFICATIONS & TRAINING</h2>
        <ul>
          {resume.certifications.map((cert) => (
            <li key={cert}>{cert}</li>
          ))}
        </ul>

        <h2>STACK</h2>
        <p>{resume.stack.join(" · ")}</p>
      </div>
    </div>
  );
}

function ErrorDialog({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="os-dialog-overlay">
      <div
        className="os-window os-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="os-titlebar">
          <span className="os-titlebar-text">{title}</span>
          <span className="os-titlebar-buttons">
            <button
              className="os-titlebtn"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </span>
        </header>

        <div className="os-dialog-body">
          <span className="os-dialog-icon" aria-hidden="true">
            ⛔
          </span>
          <p>{message}</p>
        </div>

        <div className="os-btn-row">
          <button className="os-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactApp() {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(data.get("subject") ?? ""));
    const message = String(data.get("message") ?? "").trim();

    if (!message) {
      sounds.error();
      setError(
        "The message field cannot be empty. Please type something first.",
      );
      return;
    }

    // ✅ More reliable way to trigger mailto than window.location.href
    const mailtoLink = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
    const a = document.createElement("a");
    a.href = mailtoLink;
    a.click();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      sounds.click();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback if clipboard fails */
    }
  };

  const withProtocol = (url: string) =>
    url.startsWith("http") ? url : `https://${url}`;

  const socials = [profile.github, profile.linkedin].filter(
    (link): link is string => Boolean(link),
  );

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        To:
        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
          <input
            className="os-input"
            value={profile.email}
            readOnly
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="os-btn"
            onClick={copyEmail}
            style={{ minWidth: "72px" }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </label>

      <label>
        Subject:{" "}
        <input
          className="os-input"
          name="subject"
          placeholder="Opportunity / Project / Collaboration"
        />
      </label>

      <label>
        Message:{" "}
        <textarea
          className="os-textarea"
          name="message"
          rows={5}
          defaultValue="Hi Ralph, saw your PortfolioOS — very cool."
        />
      </label>

      <div className="os-btn-row">
        <button className="os-btn" type="submit">
          Send
        </button>
        <button className="os-btn" type="reset">
          Cancel
        </button>
      </div>

      {socials.length > 0 && (
        <p className="contact-links">
          or find me:{" "}
          {socials.map((url, index) => (
            <span key={url}>
              {index > 0 && " · "}
              <a
                href={withProtocol(url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url}
              </a>
            </span>
          ))}
        </p>
      )}

      {error && (
        <ErrorDialog
          title="portfolio_os.exe"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </form>
  );
}

export function RecycleApp() {
  return (
    <div className="recycle">
      <div className="recycle-icon">🗑️</div>

      <p>The Recycle Bin is empty.</p>

      <p className="recycle-sub">
        (jQuery spaghetti, <code>!important</code> CSS and console.log debugging
        were permanently removed.)
      </p>
    </div>
  );
}

export function DisplayApp({
  current,
  onPick,
  scheme,
  onPickScheme,
}: {
  current: WallpaperId;
  onPick: (id: WallpaperId) => void;
  scheme: SchemeId;
  onPickScheme: (id: SchemeId) => void;
}) {
  return (
    <div className="display-props">
      <div className="display-monitor">
        <div className="display-preview" style={WALLPAPERS[current].style} />
      </div>

      <p className="display-label">Wallpaper:</p>
      <div className="display-list">
        {WALLPAPER_IDS.map((id) => (
          <button
            key={id}
            className={`display-option ${id === current ? "selected" : ""}`}
            onClick={() => onPick(id)}
          >
            {WALLPAPERS[id].label}
          </button>
        ))}
      </div>

      <p className="display-label">Color scheme:</p>
      <div className="display-list">
        {SCHEMES.map((s) => (
          <button
            key={s.id}
            className={`display-option ${s.id === scheme ? "selected" : ""}`}
            onClick={() => onPickScheme(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="display-hint">
        Changes apply instantly and are saved on this computer.
      </p>
    </div>
  );
}

export function GuestbookApp() {
  const [entries, setEntries] = useState<
    { id: number; name: string; message: string; createdAt: string }[]
  >([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const load = async () => {
    try {
      const r = await fetch("/api/guestbook");
      if (r.ok) setEntries(await r.json());
    } catch {
      /* no API in local dev */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sign = async () => {
    if (!message.trim() || status === "saving") return;
    setStatus("saving");
    try {
      const r = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous",
          message: message.trim(),
        }),
      });
      if (r.ok) {
        setName("");
        setMessage("");
        setStatus("saved");
        await load();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="guestbook">
      <div className="guestbook-form">
        <input
          className="os-input"
          maxLength={20}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="os-input guestbook-msg"
          maxLength={200}
          placeholder="Leave a message for Ralph..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="os-btn"
          onClick={sign}
          disabled={status === "saving"}
        >
          ✍️ Sign the guestbook
        </button>
        {status === "saved" && (
          <span className="guestbook-ok">✅ Signed! Thank you!</span>
        )}
        {status === "error" && (
          <span className="guestbook-err">❌ Couldn't save — try again</span>
        )}
      </div>

      <div className="guestbook-list">
        {entries.length === 0 ? (
          <p className="guestbook-empty">No messages yet — be the first!</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="guestbook-entry">
              <p className="guestbook-entry-head">
                <b>📌 {e.name}</b>
                <span>{new Date(e.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="guestbook-entry-msg">{e.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// 🆕 TERMINAL APP (MS-DOS PROMPT) - LOCAL VERSION
// No API calls. Works instantly in Vite/Next.js.
// ============================================================

interface HistoryItem {
  id: number;
  text: string;
  type: "input" | "output" | "system";
}

export function TerminalApp() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 0, text: "Microsoft(R) Windows 95", type: "system" },
    { id: 1, text: "[Version 4.00.950]", type: "system" },
    { id: 2, text: "(C) Copyright Microsoft Corp 1981-1999.", type: "system" },
    { id: 3, text: "", type: "system" },
    { id: 4, text: 'Type "help" for available commands.', type: "output" },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * 🚀 LOCAL COMMAND HANDLER
   * Replaces fetch('/api/terminal') entirely.
   */
  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // 1. Add user input to history immediately
    setHistory((prev) => [
      ...prev,
      { id: Date.now(), text: `> ${cmd}`, type: "input" },
    ]);

    setInput("");
    setIsLoading(true);

    // Simulate network delay for realism (optional)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowerCmd = cmd.toLowerCase().trim();
    let output = "";

    // 2. Process Command Locally
    switch (true) {
      case lowerCmd === "help":
        output = [
          "Available Commands:",
          "> whoami   : Who is Ralph?",
          "> ls       : List projects",
          "> cat <file>: Read details (e.g., cat pebrusa)",
          "> clear    : Clear screen",
          "> date     : Current system time",
          "> sudo hire: Initiate hiring protocol 😉",
        ].join("\n");
        break;

      case lowerCmd === "whoami":
        output = "RALPH D. TUNGCUL | Full Stack Engineer | Quezon City, PH";
        break;

      case lowerCmd === "ls" || lowerCmd === "dir":
        output =
          "PEBRUSA_SaaS/\n" +
          "NURSE_SCHEDULER/\n" +
          "VILT_CLIENT_APPS/\n" +
          "PORTFOLIO_OS/";
        break;

      case lowerCmd.startsWith("cat "): {
        const fileName = lowerCmd.replace("cat ", "").trim();

        if (fileName === "pebrusa") {
          output =
            "PROJECT: PEBRUSA SAAS\n" +
            "ROLE: Full Stack Developer\n" +
            "YEAR: 2026\n" +
            "STACK: Next.js, TypeScript, Prisma, MySQL, Auth.js, Vercel, Gemini AI\n" +
            "IMPACT: Reduced payload by 96% via client-side avatar optimization.\n" +
            "STATUS: Active Development";
        } else if (fileName === "portfolio_os") {
          output =
            "PROJECT: PORTFOLIO OS 95\n" +
            "ROLE: Creator / Frontend Lead\n" +
            "YEAR: 2024-2026\n" +
            "STACK: React, TypeScript, CSS Modules, LocalStorage APIs\n" +
            "FEATURES: Draggable Windows, CRT Effects, Live Guestbook, Music Player\n" +
            "LINK: https://ralphtungcul.dev";
        } else if (fileName === "resume" || fileName === "cv") {
          output =
            "RESUME SUMMARY:\n" +
            "- Software Engineer at Tensei Philippines Inc. (Aug 2023 - Present)\n" +
            "- Project Supervisor at Wuhan Fiberhome (Sep 2020 - Apr 2022)\n" +
            "- B.S. Electronics Communication Engineering, USL-Tuguegarao\n" +
            "\nTo download PDF: Visit ralphtungcul.dev/resume.pdf";
        } else {
          output = `File '${fileName}' not found. Try 'ls' to see available files.`;
        }
        break;
      }

      case lowerCmd === "clear":
        setHistory([]);
        setIsLoading(false);
        return; // Exit early, no output needed

      case lowerCmd === "date" || lowerCmd === "time":
        output = new Date().toString();
        break;

      case lowerCmd.includes("sudo"):
        output =
          "Permission denied. \n" +
          "Just kidding! Email me at tungculralph15@gmail.com 📧";
        break;

      default:
        output = `'${lowerCmd}' is not recognized as an internal or external command.\nType 'help' for options.`;
    }

    // 3. Add response to history
    setHistory((prev) => [
      ...prev,
      { id: Date.now() + 1, text: output, type: "output" },
    ]);

    setIsLoading(false);

    // Refocus input after typing
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="terminal-container">
      <div className="terminal-output">
        {history.map((item) => (
          <div key={item.id} className={`term-line term-${item.type}`}>
            {item.text.split("\n").map((line, i) => (
              <p key={i} style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        ))}
        {isLoading && <span className="cursor-blink">_</span>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-row">
        <span className="prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
