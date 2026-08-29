import { useState, type FormEvent } from 'react';
import { profile } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Contact.css';

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const sectionRef = useScrollReveal<HTMLElement>('.reveal', { stagger: 0.12 });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // NOTE: this form doesn't send anything yet — it's a placeholder.
    // Wire it up to a service like Formspree, EmailJS, or your own API route.
    setStatus('sent');
  }

  return (
    <section id="contact" className="section" ref={sectionRef}>
      <div className="section-inner contact-grid">
        <div>
          <div className="eyebrow reveal">04 — contact</div>
          <h2 className="section-title reveal">Let's talk</h2>
          <p className="contact-copy reveal">
            Have a role, project, or question in mind? My inbox is open — I try to
            reply within a couple of days.
          </p>

          <ul className="contact-links reveal">
            <li>
              <a href={`mailto:${profile.email}`} className="contact-link mono">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link mono">
                github.com/{profile.github.split('/').pop()}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link mono">
                linkedin.com/in/{profile.linkedin.split('/').pop()}
              </a>
            </li>
          </ul>
        </div>

        <form className="contact-form reveal" onSubmit={handleSubmit}>
          <label className="contact-field">
            <span className="mono contact-label">name</span>
            <input type="text" name="name" required placeholder="Enter your name" />
          </label>
          <label className="contact-field">
            <span className="mono contact-label">email</span>
            <input type="email" name="email" required placeholder="Enter your email" />
          </label>
          <label className="contact-field">
            <span className="mono contact-label">message</span>
            <textarea name="message" required rows={5} placeholder="Let's build something..." />
          </label>

          <button type="submit" className="btn btn-primary contact-submit mono">
            $ send_message()
          </button>

          {status === 'sent' && (
            <p className="contact-status mono">
              // form captured locally — connect a backend to actually send this
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;