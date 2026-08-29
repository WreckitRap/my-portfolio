import { projects } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Projects.css';

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.4-5.26 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 5h5v5M19 5l-9 9M9 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Projects() {
  const sectionRef = useScrollReveal<HTMLElement>('.project-card', { stagger: 0.1, y: 30 });

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="section-inner">
        <div className="eyebrow">03 — projects</div>
        <h2 className="section-title">Things I've built</h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <article
              key={project.title}
              className={`project-card ${project.featured ? 'is-featured' : ''}`}
            >
              <div className="project-card-header">
                <h3 className="project-title mono">{project.title}</h3>
               <div className="project-links">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`} className="project-link">
                    <GithubIcon />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`} className="project-link">
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
              </div>

              <p className="project-description">{project.description}</p>

              <ul className="project-tech">
                {project.tech.map((t) => (
                  <li key={t} className="mono">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;