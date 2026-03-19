import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ_ITEMS = [
  { q: '¿Qué pasa si no me gusta el contenido?', a: 'Tú apruebas todo antes de que se publique. Si no te gusta, lo ajustamos sin costo adicional hasta que quede como lo necesitas.' },
  { q: '¿Necesito dar acceso a mis redes sociales?', a: 'Sí. Desde el plan Básico necesitas dar acceso a tus cuentas para que publiquemos por ti. Conectamos con la API oficial de Meta. El acceso es seguro y puedes revocarlo cuando quieras.' },
  { q: '¿Cuánto tiempo tarda el onboarding?', a: 'El formulario inicial toma 5-10 minutos. En 48 horas recibes tu primer calendario mensual completo listo para aprobar. Sin reuniones largas ni presentaciones.' },
  { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí, en cualquier momento. Puedes subir o bajar de plan al inicio de cada mes sin penalizaciones. Y si decides cancelar, solo avísanos antes del siguiente ciclo.' },
  { q: '¿El contenido es realmente personalizado?', a: 'Sí. Construimos un perfil de voz de marca completo para tu negocio: tono, palabras que usas, estilo visual. La IA usa ese perfil para cada pieza y lo refina con cada mes que pasa.' }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq">
      <h2 className="faq__title">Preguntas frecuentes</h2>
      <div className="faq__list">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}>
            <button
              className="faq__question"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              {item.q}
              <ChevronDown size={18} className="faq__icon" />
            </button>
            <div className="faq__answer">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
