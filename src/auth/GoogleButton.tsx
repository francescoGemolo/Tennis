import googleIcon from '../assets/google.svg';
import './Auth.css';

interface GoogleButtonProps {
  label: string;
  onClick: () => void;
}

export function GoogleButton({ label, onClick }: GoogleButtonProps) {
  return (
    <button type="button" className="google-btn" onClick={ onClick }>
      <img src={ googleIcon } alt="" width={ 20 } height={ 20 } />
      { label }
    </button>
  );
}