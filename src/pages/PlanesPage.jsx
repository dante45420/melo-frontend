import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, CheckCircle, Minus } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Reveal from '../components/Reveal';
import FAQ from '../components/FAQ';
import './PlanesPage.css';

const PLANES = [
  {
    nombre: 'Básico',
    precio: '39.900',
    primerMes: '19.950',
    destacado: false,
    desc: 'Para negocios que quieren comenzar a tener presencia activa.',
    features: [
      '2 posts + 3 historias por semana',
      'Captions con IA incluido',
      'Aprobación previa (máx. 1 corrección)',
      'Reporte mensual básico',
      'Perfil de voz de marca',
      'Publicación automática Meta API'
    ],
    off: ['Guiones para reels', 'Gestión de respuestas']
  },
  {
    nombre: 'Pro',
    precio: '69.900',
    primerMes: '34.950',
    destacado: true,
    desc: 'Para negocios que quieren crecer con estrategia y automatización.',
    features: [
      '4 posts (1 reel) + 7 stories por semana',
      'Captions con IA incluido',
      'Aprobación previa (máx. 3 correcciones)',
      'Guiones para reels incluido',
      'Reporte completo con métricas',
      'Publicación automática + programación avanzada'
    ],
    off: []
  },
  {
    nombre: 'Full',
    precio: '119.900',
    primerMes: '59.950',
    destacado: false,
    desc: 'Para negocios que quieren delegar todo el marketing digital.',
    features: [
      '5 posts (2 reels) + 14 stories por semana',
      'Dashboard de aprobación',
      'Reporte + análisis de tendencias',
      'Gestión de respuestas (DMs y comentarios)',
      'Gestión básica de ads en Meta'
    ],
    off: []
  }
];

export default function PlanesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planes">
      <section className="plans-hero">
        <Reveal>
          <span className="section-eyebrow">Planes y precios</span>
          <div className="promo-band promo-band--prominent">
            <Sparkles size={22} />
            <div>
              <div className="promo-band-text"><strong>Oferta de lanzamiento:</strong> primer mes con 50% de descuento.</div>
              <div className="promo-band-text promo-band-text--small">Sin tarjeta de crédito. Sin compromisos.</div>
            </div>
          </div>
          <h1 className="plans-hero-title">
            Precio de SaaS,<br />
            <span className="grad-text">resultado de agencia.</span>
          </h1>
          <p className="plans-hero-sub">Sin letra chica. Sin contrato. Cancela cuando quieras.</p>
        </Reveal>
      </section>

      <div className="plans-grid">
        {PLANES.map((plan) => (
          <Reveal key={plan.nombre}>
          <div className={`plan-card ${plan.destacado ? 'plan-card--featured' : ''}`}>
            {plan.destacado && <span className="plan-badge">Más popular</span>}
            <div className="plan-promo-tag">
              <Sparkles size={12} /> Primer mes: <strong>${plan.primerMes}</strong>
            </div>
            <div className="plan-name">{plan.nombre}</div>
            <div className="plan-price"><sup>$</sup>{plan.precio}</div>
            <div className="plan-period">CLP / mes · facturación mensual</div>
            <div className="plan-first-month">✦ Primer mes por ${plan.primerMes}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-div" />
            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}><span className="chk"><CheckCircle size={14} /></span>{f}</li>
              ))}
              {plan.off.map((f, i) => (
                <li key={`off-${i}`} className="off"><span className="chk"><Minus size={14} /></span>{f}</li>
              ))}
            </ul>
            <WhatsAppCTA variant={plan.destacado ? 'primary' : 'secondary'}>
              Empezar con {plan.nombre}
            </WhatsAppCTA>
          </div>
          </Reveal>
        ))}
      </div>

      <div className="compare-band">
        <div className="compare-band-inner">
          <div className="compare-band-icon"><Sparkles size={28} /></div>
          <div>
            <div className="compare-band-title">¿Cuánto ahorras vs una agencia?</div>
            <div className="compare-band-text">Una agencia cobra ~$500.000/mes. Con el plan Pro pagas <strong>$69.900/mes</strong> — ahorro de <strong>$5.160.000 al año</strong>.</div>
          </div>
          <WhatsAppCTA variant="primary">Empezar ahora</WhatsAppCTA>
        </div>
      </div>

      <section className="addon-section">
        <div className="addon-wrap">
          <div className="addon-header">
            <div className="addon-icon"><Globe size={40} /></div>
            <div>
              <h2 className="addon-title">Suma una página web a tu plan</h2>
              <p className="addon-text">Diseño profesional, formulario de contacto, SEO local. Sin código. A mejor plan, menor costo.</p>
            </div>
          </div>
          <div className="addon-grid">
          <div className="addon-card">
            <div className="addon-card-label">Diseño inicial</div>
            <div className="addon-card-prices">
              <div className="addon-card-row">
                <span>Básico</span>
                <div><span className="addon-price">$149.900</span></div>
              </div>
              <div className="addon-card-row">
                <span>Pro</span>
                <div><span className="addon-price">$119.900</span></div>
              </div>
              <div className="addon-card-row addon-card-row--best">
                <span>Full</span>
                <div><span className="addon-price">$89.900</span></div>
              </div>
            </div>
          </div>
          <div className="addon-card">
            <div className="addon-card-label">Mantención mensual</div>
            <div className="addon-card-prices">
              <div className="addon-card-row">
                <span>Básico</span>
                <div>
                  <span className="addon-price">$29.900/mes</span>
                  <span className="addon-card-note">1 corrección al mes</span>
                </div>
              </div>
              <div className="addon-card-row">
                <span>Pro</span>
                <div>
                  <span className="addon-price">$24.900/mes</span>
                  <span className="addon-card-note">3 correcciones al mes</span>
                </div>
              </div>
              <div className="addon-card-row addon-card-row--best">
                <span>Full</span>
                <div>
                  <span className="addon-price">$19.900/mes</span>
                  <span className="addon-card-note">3 correcciones al mes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="planes-cta">
        <WhatsAppCTA variant="primary">Consultar planes por WhatsApp</WhatsAppCTA>
        <Link to="/" className="planes-back">← Volver al inicio</Link>
      </section>

      <FAQ />
    </div>
  );
}
