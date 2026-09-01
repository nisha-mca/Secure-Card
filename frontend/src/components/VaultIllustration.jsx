export default function VaultIllustration() {
  return (
    <svg
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of an encrypted vault protecting linked bank accounts"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fd6c4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e0a24a" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* orbit rings representing multiple bank accounts around one card */}
      <circle cx="240" cy="240" r="190" fill="none" stroke="#1b3763" strokeWidth="1" />
      <circle cx="240" cy="240" r="150" fill="none" stroke="#1b3763" strokeWidth="1" />

      {/* hex-grid vault body */}
      <polygon
        points="240,120 330,170 330,270 240,320 150,270 150,170"
        fill="#12294f"
        stroke="url(#ringGrad)"
        strokeWidth="2"
      />

      {/* padlock */}
      <rect x="205" y="220" width="70" height="56" rx="8" fill="#0b1e3c" stroke="#e0a24a" strokeWidth="2.5" />
      <path
        d="M218 220 v-18 a22 22 0 0 1 44 0 v18"
        fill="none"
        stroke="#e0a24a"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="240" cy="245" r="6" fill="#4fd6c4" />
      <rect x="237" y="248" width="6" height="14" rx="2" fill="#4fd6c4" />

      {/* four small bank nodes orbiting the vault */}
      {[
        [240, 55],
        [420, 240],
        [240, 425],
        [60, 240],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1="240" y1="240" x2={x} y2={y} stroke="#274370" strokeWidth="1.5" strokeDasharray="4 5" />
          <circle cx={x} cy={y} r="16" fill="#0b1e3c" stroke="#4fd6c4" strokeWidth="2" />
          <rect x={x - 7} y={y - 5} width="14" height="10" rx="2" fill="#4fd6c4" />
        </g>
      ))}

      {/* encrypted data ticks around the ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r1 = 190;
        const r2 = i % 3 === 0 ? 178 : 184;
        const x1 = 240 + r1 * Math.cos(angle);
        const y1 = 240 + r1 * Math.sin(angle);
        const x2 = 240 + r2 * Math.cos(angle);
        const y2 = 240 + r2 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#e0a24a"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
