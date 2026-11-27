import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { Bean } from "@/components/illustration/primitives";
import { rng } from "@/lib/geometry";

/* roastery: a drum roaster inside a timber seed barn, light through the doors. */
export function Roastery({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rand = rng(42);
  return (
    <Frame aspect="3:2" label={label} position={position}>
      <defs>
        <linearGradient id={`${id}-door`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fbe2c4" />
          <stop offset="1" stopColor="#f0b48f" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe2c4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fbe2c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-drum`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c25a3a" />
          <stop offset="0.35" stopColor="#9e3a2a" />
          <stop offset="1" stopColor="#5a1d16" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a5a28" />
          <stop offset="0.4" stopColor="#e3b56a" />
          <stop offset="1" stopColor="#7a4a1e" />
        </linearGradient>
      </defs>
      {/* Timber walls */}
      <rect width="1200" height="800" fill="#4a3324" />
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={i * 48} y="0" width="46" height="560" fill={i % 3 === 0 ? "#553b29" : "#4d3526"} />
      ))}
      {Array.from({ length: 26 }, (_, i) => (
        <line key={`l${i}`} x1={i * 48 + 46} x2={i * 48 + 46} y1="0" y2="560" stroke="#2c1d13" strokeWidth="3" />
      ))}
      <path d="M0 60H1200" stroke="#2c1d13" strokeWidth="18" />
      {/* Open barn door with daylight */}
      <rect x="70" y="150" width="250" height="410" fill={`url(#${id}-door)`} />
      <path d="M70 150L195 90L320 150" fill="none" stroke="#2c1d13" strokeWidth="14" />
      <path d="M90 560L130 400L160 560Z" fill="#9aa262" opacity="0.6" />
      <rect x="330" y="150" width="120" height="410" fill="#5e412d" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={345 + i * 28} x2={345 + i * 28} y1="150" y2="560" stroke="#3e2a1c" strokeWidth="3" />
      ))}
      <path d="M330 150L450 560M450 150L330 560" stroke="#3e2a1c" strokeWidth="6" />
      <path d="M70 560L320 560L760 800H-100Z" fill={`url(#${id}-beam)`} />
      <path d="M100 150L320 150L820 640L560 700Z" fill={`url(#${id}-beam)`} opacity="0.35" />
      {/* Floor */}
      <path d="M0 560H1200V800H0Z" fill="#3a2a20" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={600} y1="560" x2={-600 + i * 220} y2="800" stroke="#2a1d15" strokeWidth="3" opacity="0.7" />
      ))}
      {/* Burlap sacks */}
      {[[930, 470, 150], [1060, 480, 140], [995, 395, 140]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height="96" rx="34" fill={i === 2 ? "#cdb48c" : "#bfa478"} />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={(x ?? 0) + 14} x2={(x ?? 0) + (w ?? 0) - 14} y1={(y ?? 0) + 30 + k * 18} y2={(y ?? 0) + 30 + k * 18} stroke="#8a6e48" strokeWidth="2" opacity="0.6" />
          ))}
          <rect x={(x ?? 0) + (w ?? 0) / 2 - 22} y={(y ?? 0) + 34} width="44" height="26" fill="none" stroke="#a4472a" strokeWidth="3" opacity="0.7" />
        </g>
      ))}
      <rect x="900" y="566" width="300" height="14" fill="#2a1d15" />
      {/* Chimney */}
      <rect x="690" y="0" width="34" height="250" fill="#2c2420" />
      <rect x="684" y="120" width="46" height="12" fill="#1a1512" />
      {/* Roaster: hopper, drum, front plate, legs */}
      <path d="M612 200H760L720 262H652Z" fill={`url(#${id}-brass)`} />
      <rect x="664" y="258" width="44" height="30" fill="#5a4a3a" />
      <rect x="520" y="284" width="360" height="200" rx="26" fill={`url(#${id}-drum)`} />
      <rect x="520" y="284" width="360" height="40" rx="20" fill="#fff" opacity="0.08" />
      <circle cx="560" cy="384" r="98" fill="#2c2420" />
      <circle cx="560" cy="384" r="84" fill={`url(#${id}-brass)`} />
      <circle cx="560" cy="384" r="56" fill="#3b2116" />
      <circle cx="560" cy="384" r="56" fill="none" stroke="#f0b48f" strokeOpacity="0.4" strokeWidth="3" />
      <circle cx="540" cy="364" r="14" fill="#fbe2c4" opacity="0.25" />
      <rect x="760" y="330" width="80" height="40" rx="6" fill="#2c2420" />
      <circle cx="782" cy="350" r="8" fill="#e3b56a" />
      <circle cx="812" cy="350" r="8" fill="#f4ecdf" opacity="0.8" />
      <path d="M560 484V560M840 484V560" stroke="#1a1512" strokeWidth="18" />
      {/* Cooling tray */}
      <ellipse cx="420" cy="600" rx="230" ry="70" fill="#1a1512" />
      <ellipse cx="420" cy="592" rx="214" ry="58" fill="#5a3a26" />
      {Array.from({ length: 110 }, (_, i) => {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        return <Bean key={i} x={420 + Math.cos(a) * 200 * r} y={592 + Math.sin(a) * 52 * r} r={7} rotate={rand() * 180} fill={rand() > 0.5 ? "#6b3f26" : "#4a2a1a"} crease="#2a160c" />;
      })}
      <path d="M420 592L600 560M420 592L260 640" stroke="#c9b9a3" strokeWidth="6" strokeLinecap="round" />
      <circle cx="420" cy="592" r="12" fill="#2c2420" />
      <path d="M380 470L420 540" stroke="#2c2420" strokeWidth="14" />
      {/* Roasting haze */}
      <path d="M700 240C680 180 740 150 720 90" fill="none" stroke="#f4ecdf" strokeWidth="26" opacity="0.06" strokeLinecap="round" />
    </Frame>
  );
}
