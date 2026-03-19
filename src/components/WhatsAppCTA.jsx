const WHATSAPP_URL = 'https://wa.me/56969172764';

export default function WhatsAppCTA({ children, variant = 'primary', className = '' }) {
  const baseClass = 'whatsapp-cta';
  const variantClass = variant === 'primary' ? 'whatsapp-cta--primary' : 'whatsapp-cta--secondary';

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} ${variantClass} ${className}`.trim()}
      aria-label="Contactar por WhatsApp"
    >
      {children || 'Contactar por WhatsApp'}
    </a>
  );
}
