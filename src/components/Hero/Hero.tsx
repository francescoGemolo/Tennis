import { Icon } from '../../icons/Icon';
import './Hero.css';

interface HeroProps {
  onBook: () => void;
  onContact: () => void;
}

export function Hero({ onBook, onContact }: HeroProps) {
  return (
    <section className="view hero" aria-labelledby="welcome-title">
      <div className="hero-content">
        <span className="eyebrow">Circolo Tennis</span>
        <h1 id="welcome-title">Il campo ti aspetta</h1>
        <p>Prenota il tuo turno o scrivi alla segreteria in pochi tocchi.</p>
      </div>
      <nav className="hero-cta" aria-label="Azioni principali">
        <button className="icon-cta cta-primary" type="button" onClick={onBook}>
          <Icon name="calendar" className="icon-primary" />
          Prenota
        </button>
        <button className="icon-cta cta-secondary" type="button" onClick={onContact}>
          <Icon name="phone" className="icon-secondary" />
          Contatti
        </button>
      </nav>
    </section>
  );
}