import googleIcon from '../assets/google.svg';
import './Auth.css';

interface GoogleButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function GoogleButton({ label, onClick, disabled = false }: GoogleButtonProps) {
  return (
    <button type="button" className="google-btn" onClick={ onClick } disabled={ disabled }>
      <img src={ googleIcon } alt="" width={ 20 } height={ 20 } />
      { label }
    </button>
  );
}