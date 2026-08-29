import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  aboutText,
  profile,
  projects,
  skills,
  resume,
} from '../data/portfolioData';
import type { Project } from '../data/portfolioData';
import { WALLPAPERS, WALLPAPER_IDS } from './wallpaper';
import type { WallpaperId } from './wallpaper';
import { sounds } from './sounds';

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

        {aboutText.map((paragraph, index) => (
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
    url.startsWith('http') ? url : `https://${url}`;

  const openProject = (project: Project) => {
    if (!project.link) return;
    window.open(withProtocol(project.link), '_blank', 'noopener,noreferrer');
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
              className={`${selected === project.name ? 'selected' : ''} ${
                project.link ? 'has-link' : ''
              }`}
              tabIndex={0}
              onClick={() => setSelected(project.name)}
              onDoubleClick={() => openProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openProject(project);
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
            {current.description}{' '}
            {current.link && (
              <a
                href={withProtocol(current.link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Open
              </a>
            )}{' '}
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
  const [tab, setTab] = useState(tabs[0] ?? '');

  return (
    <div className="control-panel">
      <div className="os-tabs">
        {tabs.map((tabName) => (
          <button
            key={tabName}
            className={`os-tab ${tabName === tab ? 'active' : ''}`}
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
        <p>{resume.stack.join(' · ')}</p>
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
      <div className="os-window os-dialog" role="alertdialog" aria-modal="true" aria-label={title}>
        <header className="os-titlebar">
          <span className="os-titlebar-text">{title}</span>
          <span className="os-titlebar-buttons">
            <button className="os-titlebtn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </span>
        </header>

        <div className="os-dialog-body">
          <span className="os-dialog-icon" aria-hidden="true">⛔</span>
          <p>{message}</p>
        </div>

        <div className="os-btn-row">
          <button className="os-btn" onClick={onClose}>OK</button>
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
    const subject = encodeURIComponent(String(data.get('subject') ?? ''));
    const message = String(data.get('message') ?? '').trim();

    if (!message) {
      sounds.error();
      setError('The message field cannot be empty. Please type something first.');
      return;
    }

    // ✅ More reliable way to trigger mailto than window.location.href
    const mailtoLink = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
    const a = document.createElement('a');
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
    url.startsWith('http') ? url : `https://${url}`;

  const socials = [profile.github, profile.linkedin].filter(
    (link): link is string => Boolean(link),
  );

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        To:
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <input className="os-input" value={profile.email} readOnly style={{ flex: 1 }} />
          <button type="button" className="os-btn" onClick={copyEmail} style={{ minWidth: '72px' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </label>

      <label>
        Subject:{' '}
        <input
          className="os-input"
          name="subject"
          placeholder="Opportunity / Project / Collaboration"
        />
      </label>

      <label>
        Message:{' '}
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
          or find me:{' '}
          {socials.map((url, index) => (
            <span key={url}>
              {index > 0 && ' · '}
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
        (jQuery spaghetti, <code>!important</code> CSS and console.log debugging were permanently
        removed.)
      </p>
    </div>
  );
}

export function DisplayApp({
  current,
  onPick,
}: {
  current: WallpaperId;
  onPick: (id: WallpaperId) => void;
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
            className={`display-option ${id === current ? 'selected' : ''}`}
            onClick={() => onPick(id)}
          >
            {WALLPAPERS[id].label}
          </button>
        ))}
      </div>

      <p className="display-hint">Changes apply instantly and are saved on this computer.</p>
    </div>
  );
}