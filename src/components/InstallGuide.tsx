import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiPhone01Icon, AppleIcon, AndroidIcon } from '@hugeicons/core-free-icons';
import './InstallGuide.css';

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

export function InstallGuide() {
  const [open, setOpen] = useState(false);

  if (isStandalone()) return null;

  return (
    <>
      <button
        type="button"
        className="install-guide-trigger"
        aria-label="Come installare l'app"
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon icon={AiPhone01Icon} size={20} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="install-guide-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
          onClick={() => setOpen(false)}
        >
          <div className="install-guide-panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="install-guide-title" id="install-guide-title">Installa l'app</h2>
            <p className="install-guide-intro">Aggiungi l'app alla schermata Home per aprirla come un'app vera.</p>

            <div className="install-guide-body">
              <div className="install-guide-step">
                <HugeiconsIcon icon={AppleIcon} size={28} strokeWidth={1.5} className="install-guide-step-os-icon" />
                <p className="install-guide-step-text">
                  Tocca Condividi in basso, poi "Aggiungi alla schermata Home".
                </p>
              </div>

              <div className="install-guide-step">
                <HugeiconsIcon icon={AndroidIcon} size={28} strokeWidth={1.5} className="install-guide-step-os-icon" />
                <p className="install-guide-step-text">
                  Tocca il menu ⋮ in alto a destra, poi "Installa app".
                </p>
              </div>
            </div>

            <button type="button" className="icon-cta cta-secondary install-guide-close" onClick={() => setOpen(false)}>
              Ho capito
            </button>
          </div>
        </div>
      )}
    </>
  );
}