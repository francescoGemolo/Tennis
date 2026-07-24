import { ICONS, type IconName } from './icon-paths';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      width={ size }
      height={ size }
      viewBox={ icon.viewBox }
      fill="none"
      stroke="currentColor"
      strokeWidth={ icon.strokeWidth }
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ className }
      aria-hidden="true"
    >
      { icon.paths.map((d, i) => (
        <path key={ i } d={ d } />
      )) }
    </svg>
  );
}