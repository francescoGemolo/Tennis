import type { Ref } from 'react';
import { HONEYPOT_FIELD_NAME } from '../config';

interface HoneypotFieldProps {
  ref: Ref<HTMLInputElement>;
}

export function HoneypotField({ ref }: HoneypotFieldProps) {
  return (
    <input
      ref={ ref }
      type="text"
      name={ HONEYPOT_FIELD_NAME }
      className="honeypot-field"
      tabIndex={ -1 }
      autoComplete="off"
      aria-hidden="true"
    />
  );
}