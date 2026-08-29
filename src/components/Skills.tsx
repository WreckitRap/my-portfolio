import { skills } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Skills.css';

function Skills() {
  const sectionRef = useScrollReveal<HTMLElement>('.skills-card', { stagger: 0.08, y: 24 });

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="section-inner">
        <div className="eyebrow">02 — skills</div>
        <h2 className="section-title">What I work with</h2>

        <div className="skills-grid">
          {skills.map((group) => (
            <div key={group.category} className="skills-card">
              <h3 className="skills-card-title mono">{group.category}</h3>
              <ul className="skills-chips">
                {group.items.map((item) => (
                  <li key={item} className="skills-chip mono">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;