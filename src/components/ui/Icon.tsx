export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  return (
    <span className={`material-symbols-rounded${className ? ` ${className}` : ''}`} style={{ fontSize: size }} aria-hidden>
      {name}
    </span>
  );
}
