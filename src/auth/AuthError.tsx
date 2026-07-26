import { useAuth } from './AuthContext';
import './Auth.css';

export function AuthError() {
  const { retry, signOutUser } = useAuth();

  return (
    <section className="view auth-view" aria-labelledby="auth-error-title">
      <div className="auth-content">
        <div className="card auth-card">
          <h2 className="view-title" id="auth-error-title">Errore di connessione</h2>
          <p className="section-label">Non è stato possibile caricare il tuo profilo. Controlla la connessione e riprova.</p>
          <button className="icon-cta cta-primary" type="button" onClick={ retry }>Riprova</button>
          <button type="button" className="btn-ghost" onClick={ () => void signOutUser() }>Esci</button>
        </div>
      </div>
    </section>
  );
}