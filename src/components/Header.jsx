import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WhatsAppCTA from './WhatsAppCTA';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <img src="/logo.png" alt="Melo" width="34" height="34" />
          <span>melo</span>
        </Link>
        <nav className="header__nav">
          <Link to="/" className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}>Inicio</Link>
          <Link to="/planes" className={`header__link ${location.pathname === '/planes' ? 'header__link--active' : ''}`}>Planes</Link>
          <WhatsAppCTA variant="primary">Quiero empezar</WhatsAppCTA>
        </nav>
      </div>
    </header>
  );
}
