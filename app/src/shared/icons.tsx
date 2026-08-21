export function CoffeeBean({
  size = 36,
  fill = 'hsl(var(--ocheto-coffee-700))',
  className = '',
  style,
  detail = false,
}: {
  size?: number;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  detail?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 56"
      width={size}
      height={(size * 56) / 40}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ellipse cx="20" cy="28" rx="18" ry="26" fill={fill} />
      <path
        d="M20 4 C 14 16, 14 40, 20 52"
        stroke="hsl(var(--ocheto-cream-50))"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {detail && (
        <path
          d="M20 6 C 18 14, 18 22, 20 30 C 22 22, 22 14, 20 6 Z"
          fill="hsl(var(--ocheto-coffee-900))"
          opacity="0.35"
        />
      )}
    </svg>
  );
}
