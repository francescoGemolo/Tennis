import './Auth.css';

export function AuthLoading() {
  return (
    <section className="view auth-view" aria-label="Caricamento">
      <div className="auth-content">
        <span className="section-label">Caricamento…</span>
      </div>
    </section>
  );
}