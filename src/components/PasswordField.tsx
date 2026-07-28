import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';

interface PasswordFieldProps {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  hint?: string;
}

export function PasswordField({ id, label, autoComplete, value, onChange, error, hint }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={ `field${error ? ' field--invalid' : ''}` }>
      <label htmlFor={ id }>{ label }</label>
      <div className="password-input">
        <input
          id={ id }
          type={ visible ? 'text' : 'password' }
          autoComplete={ autoComplete }
          required
          aria-invalid={ !!error }
          value={ value }
          onChange={ (e) => onChange(e.target.value) }
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={ visible ? 'Nascondi password' : 'Mostra password' }
          onClick={ () => setVisible((prev) => !prev) }
        >
          <HugeiconsIcon icon={ visible ? ViewOffIcon : ViewIcon } size={ 18 } strokeWidth={ 1.5 } />
        </button>
      </div>
      { error ? <span className="field-error">{ error }</span> : hint && <span className="field-hint">{ hint }</span> }
    </div>
  );
}