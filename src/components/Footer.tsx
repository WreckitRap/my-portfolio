import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="mono">"Code is like humor. When you have to explain it, it's bad." — Cory House</p>
      <p className="mono">© {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
