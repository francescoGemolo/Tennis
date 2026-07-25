import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiPhone01Icon, AppleIcon, AndroidIcon } from '@hugeicons/core-free-icons';
import './InstallGuide.css';

const STEPS = [
  { icon: AppleIcon, os: 'iOS', text: 'Condividi › Aggiungi a Home' },
  { icon: AndroidIcon, os: 'Android', text: 'Menu ⋮ › Installa app' },
];

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

export function InstallGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (isStandalone()) return null;

  return (
    <>
      <button
        type="button"
        className="btn-round"
        aria-label="Come installare l'app"
        onClick={ () => setOpen(true) }
      >
        <HugeiconsIcon icon={ AiPhone01Icon } size={ 18 } strokeWidth={ 1.5 } />
      </button>

      { open && (
        <div
          className="install-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
          onClick={ () => setOpen(false) }
        >
          <div className="install-panel" onClick={ (e) => e.stopPropagation() }>
            <h2 className="install-title" id="install-title">Installa l'app</h2>

            <ul className="install-steps">
              { STEPS.map((step) => (
                <li className="install-step" key={ step.os }>
                  <HugeiconsIcon icon={ step.icon } size={ 16 } strokeWidth={ 1.5 } className="install-step-icon" />
                  { step.text }
                </li>
              )) }
            </ul>

            <button type="button" className="icon-cta cta-primary install-close" onClick={ () => setOpen(false) }>
              Ho capito
            </button>
          </div>
        </div>
      ) }
    </>
  );
}