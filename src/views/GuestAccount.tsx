import { BackButton } from '../components/BackButton';
import { useAuth } from '../auth/AuthContext';

interface GuestAccountProps {
  onBack: () => void;
}

export function GuestAccount({ onBack }: GuestAccountProps) {
  const { signOutUser } = useAuth();

  return (
    <section className="view" aria-labelledby="guest-account-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <h2 className="view-title" id="guest-account-title">Area personale</h2>
      </div>

      <div className="view-scroll">
        <div className="card flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-500 max-[359px]:text-xs">Effettua l'accesso per vedere la tua area personale.</p>
          <button className="icon-cta cta-primary self-stretch" type="button" onClick={ () => void signOutUser() }>
            Accedi
          </button>
        </div>
      </div>
    </section>
  );
}