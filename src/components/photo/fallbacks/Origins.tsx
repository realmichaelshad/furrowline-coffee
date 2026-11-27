import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { hillShape, ridge, waveLine, openCurve, rng } from "@/lib/geometry";
import { Furrows } from "@/components/illustration/primitives";

/* Origin landscapes for Ethiopia (terraces under shade trees), Colombia
   (steep planted ridges, drying beds) and Guatemala (raked drying patio
   below limestone mountains). 1200 × 800. */

function Trees({ seed, y, count, color, shade, minX = 0, maxX = 1200, size = 34 }: { seed: number; y: number; count: number; color: string; shade: string; minX?: number; maxX?: number; size?: number }) {
  const rand = rng(seed);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = minX + rand() * (maxX - minX);
        const yy = y + rand() * 40 - 20;
        const r = size * (0.7 + rand() * 0.6);
        return (
          <g key={i}>
            <rect x={x - 2} y={yy} width="4" height={r * 1.2} fill={shade} />
            <ellipse cx={x} cy={yy - r * 0.2} rx={r * 1.25} ry={r * 0.7} fill={color} />
            <ellipse cx={x - r * 0.3} cy={yy - r * 0.38} rx={r * 0.7} ry={r * 0.32} fill="#fff" opacity="0.08" />
          </g>
        );
      })}
    </g>
  );
}

function Shrubs({ seed, rows, color, cherry, y0, gap }: { seed: number; rows: number; color: string; cherry: string; y0: number; gap: number }) {
  const rand = rng(seed);
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const y = y0 + r * gap;
    const size = 16 + r * 7;
    const step = size * 2.1;
    for (let x = -20 + (r % 2) * step * 0.5; x < 1240; x += step) {
      out.push(<ellipse key={`${r}-${x}`} cx={x} cy={y} rx={size} ry={size * 0.62} fill={color} />);
      if (rand() > 0.45) out.push(<circle key={`c${r}-${x}`} cx={x + size * 0.3} cy={y + size * 0.1} r={2 + r * 0.6} fill={cherry} />);
    }
  }
  return <g>{out}</g>;
}

export function OriginEthiopia({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Frame aspect="3:2" label={label} position={position}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d9bd" />
          <stop offset="0.6" stopColor="#f2b994" />
          <stop offset="1" stopColor="#efc3a4" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill={`url(#${id}-sky)`} />
      <circle cx="760" cy="300" r="90" fill="#f8e6cf" opacity="0.9" />
      <circle cx="760" cy="300" r="140" fill="#f8e6cf" opacity="0.25" />
      <path d={hillShape(330, 1200, 800, 26, 1.3, 0.5)} fill="#c9b892" opacity="0.8" />
      <path d={waveLine(360, 1200, 18, 1.5, 1.2)} stroke="#f8e6cf" strokeWidth="18" fill="none" opacity="0.5" />
      <path d={hillShape(390, 1200, 800, 34, 1.1, 2.2)} fill="#9aa262" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={waveLine(410 + i * 18, 1200, 34 - i * 1.5, 1.1, 2.2 + i * 0.03)} fill="none" stroke="#c9b26a" strokeWidth="2" opacity="0.55" />
      ))}
      <Trees seed={3} y={420} count={14} color="#5f6e33" shade="#3e4a20" size={30} />
      <path d={hillShape(520, 1200, 800, 28, 0.8, 4)} fill="#6e7c3b" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={waveLine(545 + i * 22, 1200, 28 - i * 2, 0.8, 4)} fill="none" stroke="#9aa262" strokeWidth="3" opacity="0.6" />
      ))}
      <Trees seed={9} y={560} count={8} color="#4b5a32" shade="#2f3a1f" size={44} />
      <path d="M0 680C200 650 420 700 640 670C860 640 1000 690 1200 660V800H0Z" fill="#3e4a28" />
      <Shrubs seed={5} rows={3} color="#2f3a1f" cherry="#c2414f" y0={700} gap={40} />
      <path d="M520 800C560 740 640 712 720 690" fill="none" stroke="#c9a27e" strokeWidth="10" opacity="0.6" strokeLinecap="round" />
    </Frame>
  );
}

export function OriginColombia({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Frame aspect="3:2" label={label} position={position}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d6a0" />
          <stop offset="1" stopColor="#f6e6c4" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill={`url(#${id}-sky)`} />
      <circle cx="930" cy="190" r="70" fill="#f2c46b" />
      <path d={ridge([[-40, 300], [140, 180], [300, 270], [520, 140], [760, 260], [980, 170], [1240, 280]], 800)} fill="#b89a6e" opacity="0.55" />
      <path d={waveLine(270, 1200, 14, 2, 0.4)} fill="none" stroke="#fff" strokeWidth="26" opacity="0.4" />
      <path d={ridge([[-40, 420], [180, 250], [420, 400], [640, 220], [900, 380], [1240, 260]], 800)} fill="#7d8a45" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={openCurve([[200 + i * 26, 270 + i * 12], [430 + i * 10, 420 - i * 2], [640 - i * 6, 240 + i * 14]])} fill="none" stroke="#5d6b3c" strokeWidth="3" opacity="0.7" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={`b${i}`} d={openCurve([[660 + i * 20, 240 + i * 14], [900 - i * 6, 390 + i * 4], [1240, 280 + i * 16]])} fill="none" stroke="#5d6b3c" strokeWidth="3" opacity="0.6" />
      ))}
      {/* Farmhouse */}
      <g transform="translate(880 400)">
        <rect x="0" y="0" width="90" height="54" fill="#f4ecdf" />
        <path d="M-10 4L45 -30L100 4Z" fill="#b4412f" />
        <rect x="34" y="22" width="18" height="32" fill="#6b3f26" />
      </g>
      <path d={ridge([[-40, 560], [260, 470], [560, 560], [860, 500], [1240, 580]], 800)} fill="#4f5d2e" />
      {/* Drying beds glowing amber */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${120 + i * 250} ${610 + (i % 2) * 20}) skewX(-18)`}>
          <rect width="210" height="56" fill="#6b3f26" />
          <rect x="6" y="6" width="198" height="44" fill="#e3a33b" />
          {Array.from({ length: 6 }, (_, k) => (
            <line key={k} x1="6" x2="204" y1={12 + k * 7} y2={12 + k * 7} stroke="#b4412f" strokeOpacity="0.35" strokeWidth="2" />
          ))}
        </g>
      ))}
      <path d="M0 720C300 700 700 740 1200 710V800H0Z" fill="#3e4a28" />
    </Frame>
  );
}

export function OriginGuatemala({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Frame aspect="3:2" label={label} position={position}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfd8d0" />
          <stop offset="0.55" stopColor="#f3e2c4" />
          <stop offset="1" stopColor="#f6d9a8" />
        </linearGradient>
        <linearGradient id={`${id}-patio`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c3a0" />
          <stop offset="1" stopColor="#c9a37a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill={`url(#${id}-sky)`} />
      <circle cx="300" cy="200" r="64" fill="#f0b45c" />
      <path d={ridge([[-40, 330], [120, 230], [260, 250], [420, 160], [600, 210], [780, 140], [960, 220], [1240, 180]], 800)} fill="#d8cdb8" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={openCurve([[380 + i * 30, 180 + i * 18], [500 + i * 20, 260 + i * 10], [640 + i * 6, 230 + i * 14]])} fill="none" stroke="#b9ab92" strokeWidth="3" opacity="0.6" />
      ))}
      <path d={ridge([[-40, 420], [200, 330], [460, 380], [700, 300], [980, 360], [1240, 320]], 800)} fill="#8a4e2b" opacity="0.85" />
      <path d={ridge([[-40, 480], [300, 420], [620, 460], [900, 410], [1240, 450]], 800)} fill="#4f5d2e" />
      <Trees seed={21} y={440} count={16} color="#3e4a28" shade="#2a3219" size={26} />
      {/* Drying patio with raked furrows */}
      <path d="M0 520H1200V800H0Z" fill={`url(#${id}-patio)`} />
      <path d="M0 540H1200V800H0Z" fill="#b98a55" opacity="0.6" />
      <g transform="translate(0 0)">
        <Furrows width={1200} height={800} rows={34} horizon={540} vanishX={760} stroke="#8a5a32" strokeWidth={3} opacity={0.75} />
      </g>
      <rect x="0" y="520" width="1200" height="20" fill="#e9dcc4" />
      {/* Rake leaning on the wall */}
      <path d="M1040 520L960 760" stroke="#6b3f26" strokeWidth="8" strokeLinecap="round" />
      <path d="M920 770H1010" stroke="#6b3f26" strokeWidth="10" strokeLinecap="round" />
    </Frame>
  );
}
