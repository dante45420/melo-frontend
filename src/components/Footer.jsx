import { Link } from 'react-router-dom';
import WhatsAppCTA from './WhatsAppCTA';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt="Melo" width="40" height="40" />
          <span>Melo</span>
        </div>
        <div className="footer__links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram">
            Instagram
          </a>
          <Link to="/planes" className="footer__link">Planes</Link>
        </div>
        <WhatsAppCTA variant="primary">Contactar por WhatsApp</WhatsAppCTA>
      </div>
    </footer>
  );
}
