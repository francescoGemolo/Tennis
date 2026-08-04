import { TennisBallLoader } from '../components/TennisBallLoader';

export function AuthLoading() {
  return (
    <section className="view items-center" aria-label="Caricamento">
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="loading-state">
          <TennisBallLoader size="lg" />
          <span className="section-label">Caricamento…</span>
        </div>
      </div>
    </section>
  );
}