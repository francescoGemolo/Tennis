import { TennisBallLoader } from '../components/TennisBallLoader';
import './Auth.css';

export function AuthLoading() {
  return (
    <section className="view auth-view" aria-label="Caricamento">
      <div className="auth-content">
        <div className="loading-state">
          <TennisBallLoader size="lg" />
          <span className="section-label">Caricamento…</span>
        </div>
      </div>
    </section>
  );
}