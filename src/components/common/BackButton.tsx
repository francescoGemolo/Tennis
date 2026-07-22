import { Icon } from '../../icons/Icon';

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export function BackButton({ label = 'Indietro', onClick }: BackButtonProps) {
  return (
    <button className="btn-ghost" type="button" onClick={onClick}>
      <Icon name="arrowLeft" size={18} />
      {label}
    </button>
  );
}