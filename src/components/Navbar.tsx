import { useEffect, useState } from 'react';
import './Navbar.css';

const tabs = [
  { id: 'home', file: 'home' },
  { id: 'about', file: 'about' },
  { id: 'skills', file: 'skills' },
  { id: 'projects', file: 'projects' },
  { id: 'contact', file: 'contact' },
];

function Navbar() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="navbar-brand mono">
          <span className="navbar-brand-dot" />
          <span>ralph.dev</span>
        </a>

        <nav>
          <ul className="navbar-tabs">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <a
                  href={`#${tab.id}`}
                  className={`navbar-tab mono ${active === tab.id ? 'is-active' : ''}`}
                >
                  {tab.file}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
