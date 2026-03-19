import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Reveal({ children, className = '', delay }) {
  const ref = useScrollReveal(0.15);
  const delayClass = delay ? `reveal-d${delay}` : '';

  return (
    <div ref={ref} className={`reveal ${delayClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
