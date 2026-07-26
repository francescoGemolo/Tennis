import { BackButton } from '../components/BackButton';
import { useAuth } from '../auth/AuthContext';
import './Account.css';

interface GuestAccountProps {
  onBack: () => void;
}

export function GuestAccount({ onBack }: GuestAccountProps) {
  const { signOutUser } = useAuth();

  return (
    <section className="view account" aria-labelledby="guest-account-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <h2 className="view-title" id="guest-account-title">Area personale</h2>
      </div>

      <div className="view-scroll">
        <div className="card account-empty-state">
          <p className="account-empty">Effettua l'accesso per vedere la tua area personale.</p>
          <button className="icon-cta cta-primary" type="button" onClick={ () => void signOutUser() }>
            Accedi
          </button>
        </div>
      </div>
    </section>
  );
}