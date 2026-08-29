import { aboutText, profile } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

function About() {
  const sectionRef = useScrollReveal<HTMLElement>('.reveal', { stagger: 0.12 });

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="section-inner about-grid">
        <div>
          <div className="eyebrow reveal">01 — about</div>
          <h2 className="section-title reveal">A bit about me</h2>
          {aboutText.map((paragraph, i) => (
            <p key={i} className="about-paragraph reveal">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="about-facts mono reveal" aria-label="Quick facts">
          <span className="about-facts-line">
            <span className="tok-keyword">const</span> quickFacts = {'{'}
          </span>
          <span className="about-facts-line about-facts-indent">
            location: <span className="tok-string">'{profile.location}'</span>,
          </span>
          <span className="about-facts-line about-facts-indent">
            focus: <span className="tok-string">'{profile.focus}'</span>,
          </span>
          <span className="about-facts-line about-facts-indent">
            currentlyLearning: <span className="tok-string">'{profile.currentlyLearning}'</span>,
          </span>
          <span className="about-facts-line about-facts-indent">
            openTo: <span className="tok-string">'new opportunities'</span>,
          </span>
          <span className="about-facts-line">{'}'};</span>
        </div>
      </div>
    </section>
  );
}

export default About;