import { Link } from 'react-router-dom';
import { Sparkles, Zap, CheckCircle, Unlock, Calendar, FileCheck, BarChart3, Target, Shield, TrendingUp, MessageCircle } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Reveal from '../components/Reveal';
import FAQ from '../components/FAQ';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__glow" />
        <Reveal><div className="hero__banner">
          <Sparkles size={16} strokeWidth={2} />
          <span><strong>50% off</strong> primer mes</span>
        </div></Reveal>
        <h1 className="hero__title">
          <span className="hero__title-line">Marketing que</span>
          <span className="hero__title-accent">trabaja por ti.</span>
        </h1>
        <p className="hero__sub">
          Redes sociales con IA. Tú apruebas, nosotros publicamos.
        </p>
        <div className="hero__actions">
          <a href="#cta" className="btn-primary">Empezar con 50% off</a>
          <Link to="/planes" className="btn-outline">Ver planes</Link>
        </div>
        <div className="hero__proof">
          <div className="proof-pill"><Zap size={14} /> <span>48 h</span> primera entrega</div>
          <div className="proof-sep" />
          <div className="proof-pill"><CheckCircle size={14} /> Apruebas <span>todo</span></div>
          <div className="proof-sep" />
          <div className="proof-pill"><Unlock size={14} /> Sin contrato</div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line" />
          descubrir
        </div>
      </section>

      <section className="section">
        <Reveal>
          <span className="section-eyebrow">Lo que Melo hace por tu negocio</span>
          <h2 className="section-title">Una presencia digital<br />que <span className="grad-text">trabaja todos los días.</span></h2>
          <p className="section-lead">Sin que tengas que escribir un solo caption, pensar en qué publicar ni aprender a usar herramientas complicadas.</p>
        </Reveal>
        <div className="value-grid">
          {[
            { num: '01', title: 'Contenido creado a tu imagen', text: 'Cada post, story y reel habla con la voz de tu negocio. Construimos tu perfil de marca desde el inicio.', tag: 'Voz de marca propia' },
            { num: '02', title: 'Tú decides qué sale al aire', text: 'Todo el contenido pasa por tu aprobación antes de publicarse. Un tap en el celular es suficiente.', tag: 'Control total tuyo' },
            { num: '03', title: 'Se publica solo, en el momento ideal', text: 'Una vez que apruebas, Melo se encarga del resto. Publicación automática en el horario ideal.', tag: 'Publicación automática' },
            { num: '04', title: 'Resultados que puedes leer', text: 'Cada mes recibes un reporte claro: alcance, crecimiento, qué funcionó. Sin tecnicismos.', tag: 'Métricas reales' }
          ].map((card) => (
            <Reveal key={card.num}><div className="value-card">
              <div className="value-num">{card.num}</div>
              <div className="value-title">{card.title}</div>
              <div className="value-text">{card.text}</div>
              <span className="value-tag">{card.tag}</span>
            </div></Reveal>
          ))}
        </div>
      </section>

      <Reveal><div className="stats-band">
        <div className="stat-cell"><span className="stat-val">48</span><span className="stat-lbl">horas para tu primera entrega</span></div>
        <div className="stat-cell"><span className="stat-val">65%</span><span className="stat-lbl">menos que una agencia tradicional</span></div>
        <div className="stat-cell"><span className="stat-val">100%</span><span className="stat-lbl">del contenido pasa por tu aprobación</span></div>
        <div className="stat-cell"><span className="stat-val">0</span><span className="stat-lbl">meses de contrato mínimo</span></div>
      </div></Reveal>

      <section className="process-section process-section--compact">
        <div className="process-inner">
          <Reveal><span className="section-eyebrow">El proceso</span></Reveal>
          <Reveal><h2 className="section-title">Empezar toma<br />menos de 10 minutos.</h2></Reveal>
          <div className="steps-wrap steps-wrap--equal">
            {[
              { icon: FileCheck, label: 'Paso 01', title: 'Nos cuentas de tu negocio', text: 'Un formulario de 5 minutos: tu rubro, tono, clientes ideales. Una sola vez.' },
              { icon: Calendar, label: 'Paso 02', title: 'Recibes tu calendario en 48 h', text: 'Posts, captions y guiones de reels para el mes completo. Todo listo para aprobar.' },
              { icon: CheckCircle, label: 'Paso 03', title: 'Apruebas con un tap', text: 'Desde tu celular. ¿Quieres ajustar algo? Lo cambiamos al instante.' },
              { icon: BarChart3, label: 'Paso 04', title: 'Melo publica. Tú atiendes.', text: 'Publicamos en el horario ideal, respondemos y te mandamos el reporte a fin de mes.' }
            ].map((step) => {
              const StepIcon = step.icon;
              return (
              <Reveal key={step.label}><div className="step-card">
                <div className="step-icon"><StepIcon size={22} strokeWidth={2} /></div>
                <div className="step-num-label">{step.label}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-text">{step.text}</div>
              </div></Reveal>
            );})}
          </div>
        </div>
      </section>

      <section className="section props-section props-section--centered props-section--compact">
        <div className="props-header">
          <span className="section-eyebrow">Por qué Melo</span>
          <h2 className="section-title">Tu negocio merece<br /><span className="grad-text">ser encontrado.</span></h2>
          <p className="section-lead">Tus clientes te buscan en Instagram y Google antes de llamarte. Una presencia activa y profesional no es un lujo.</p>
        </div>
        <div className="props-grid">
          {[
            { icon: Target, title: 'Contenido que mejora mes a mes', text: 'Melo aprende los gustos de tu audiencia. El mes 6 es notablemente mejor que el mes 1.', tag: 'IA que aprende' },
            { icon: Shield, title: 'Nunca pierdes el control de tu marca', text: 'Aprobación previa obligatoria. Tu reputación es tuya. Nunca publicamos sin tu visto bueno.', tag: 'Seguridad garantizada' },
            { icon: BarChart3, title: 'Sabes exactamente qué está pasando', text: 'Reporte mensual claro: alcance, crecimiento, qué post funcionó mejor.', tag: 'Transparencia total' },
            { icon: MessageCircle, title: 'Un equipo real detrás de cada publicación', text: 'La IA genera, las personas revisan. Cada pieza pasa por ojos humanos.', tag: 'IA + revisión humana' }
          ].map((prop) => {
            const PropIcon = prop.icon;
            return (
            <Reveal key={prop.title}><div className="prop-item">
              <div className="prop-icon"><PropIcon size={19} strokeWidth={2} /></div>
              <div className="prop-title">{prop.title}</div>
              <div className="prop-text">{prop.text}</div>
              <span className="prop-tag">{prop.tag}</span>
            </div></Reveal>
          );})}
        </div>
        <div className="props-cta reveal">
          <a href="#cta" className="btn-primary">Empezar ahora</a>
        </div>
      </section>

      <section className="cta-section cta-section--compact" id="cta">
        <div className="cta__glow" />
        <Reveal>
          <span className="section-eyebrow">Oferta de lanzamiento</span>
          <h2 className="cta-title">Tu primer mes,<br /><span className="grad-text">con 50% de descuento.</span></h2>
          <p className="cta-sub">Sin riesgo. Sin contrato. Sin tarjeta de crédito para empezar.<br /><strong>Prueba Melo durante 30 días.</strong></p>
          <div className="cta-actions">
            <WhatsAppCTA variant="primary" className="btn-cta-primary">Quiero empezar</WhatsAppCTA>
            <Link to="/planes" className="btn-outline">Ver todos los planes</Link>
          </div>
          <p className="cta-micro">Primer mes con <span>50% off</span> · Sin tarjeta · Cancela cuando quieras</p>
        </Reveal>
      </section>

      <section className="compare-section">
        <div className="compare-inner">
          <span className="section-eyebrow">La diferencia real</span>
          <h2 className="section-title">Lo que cuesta una agencia.<br /><span className="grad-text">Lo que cuesta Melo.</span></h2>
          <p className="compare-intro">Una agencia cobra entre $300.000 y $800.000 al mes solo por community manager. Con Melo pagas una fracción y obtienes más.</p>

          <div className="compare-grid">
            <div className="compare-item">
              <div className="compare-item-label">Precio mensual</div>
              <div className="compare-item-cols">
                <div className="compare-item-row">
                  <span className="compare-col-header compare-col-header--agencia">Agencia</span>
                  <span className="compare-item-agencia">$300.000 – $800.000</span>
                </div>
                <div className="compare-item-row compare-item-row--melo">
                  <span className="compare-col-header compare-col-header--melo">Melo</span>
                  <span className="compare-item-melo">$39.900 – $119.900</span>
                </div>
              </div>
            </div>
            <div className="compare-item">
              <div className="compare-item-label">Contrato mínimo</div>
              <div className="compare-item-cols">
                <div className="compare-item-row">
                  <span className="compare-col-header compare-col-header--agencia">Agencia</span>
                  <span className="compare-item-agencia">3 a 12 meses</span>
                </div>
                <div className="compare-item-row compare-item-row--melo">
                  <span className="compare-col-header compare-col-header--melo">Melo</span>
                  <span className="compare-item-melo"><CheckCircle size={16} /> Mes a mes</span>
                </div>
              </div>
            </div>
            <div className="compare-item">
              <div className="compare-item-label">Primera entrega</div>
              <div className="compare-item-cols">
                <div className="compare-item-row">
                  <span className="compare-col-header compare-col-header--agencia">Agencia</span>
                  <span className="compare-item-agencia">2 a 4 semanas</span>
                </div>
                <div className="compare-item-row compare-item-row--melo">
                  <span className="compare-col-header compare-col-header--melo">Melo</span>
                  <span className="compare-item-melo"><CheckCircle size={16} /> 48 horas</span>
                </div>
              </div>
            </div>
            <div className="compare-item">
              <div className="compare-item-label">Tú apruebas antes de publicar</div>
              <div className="compare-item-cols">
                <div className="compare-item-row">
                  <span className="compare-col-header compare-col-header--agencia">Agencia</span>
                  <span className="compare-item-agencia">Depende del contrato</span>
                </div>
                <div className="compare-item-row compare-item-row--melo">
                  <span className="compare-col-header compare-col-header--melo">Melo</span>
                  <span className="compare-item-melo"><CheckCircle size={16} /> Siempre</span>
                </div>
              </div>
            </div>
            <div className="compare-item">
              <div className="compare-item-label">Reporte mensual de métricas</div>
              <div className="compare-item-cols">
                <div className="compare-item-row">
                  <span className="compare-col-header compare-col-header--agencia">Agencia</span>
                  <span className="compare-item-agencia">A veces, con costo extra</span>
                </div>
                <div className="compare-item-row compare-item-row--melo">
                  <span className="compare-col-header compare-col-header--melo">Melo</span>
                  <span className="compare-item-melo"><CheckCircle size={16} /> Incluido</span>
                </div>
              </div>
            </div>
          </div>

          <p className="compare-note">Con el plan Pro de Melo pagas <strong>$69.900/mes</strong>. Una agencia promedio cobra <strong>$500.000/mes</strong>. Eso es un ahorro de más de <strong>$5.160.000 al año</strong> — sin sacrificar calidad ni control.</p>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
