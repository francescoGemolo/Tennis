import { useAuth } from './AuthContext';

export function AuthError() {
  const { retry, signOutUser } = useAuth();

  return (
    <section className="view items-center" aria-labelledby="auth-error-title">
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="card w-full max-w-[360px] flex flex-col gap-5">
          <h2 className="view-title" id="auth-error-title">Errore di connessione</h2>
          <p className="section-label">Non è stato possibile caricare il tuo profilo. Controlla la connessione e riprova.</p>
          <button className="icon-cta cta-primary" type="button" onClick={ retry }>Riprova</button>
          <button type="button" className="btn-ghost" onClick={ () => void signOutUser() }>Esci</button>
        </div>
      </div>
    </section>
  );
}