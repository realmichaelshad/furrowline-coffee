import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { rng } from "@/lib/geometry";

/* cherries: a branch heavy with ripe coffee cherries, soft backlit bokeh. */
function Leaf({ x, y, len, angle, fill, vein }: { x: number; y: number; len: number; angle: number; fill: string; vein: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0C${len * 0.3} ${-len * 0.28} ${len * 0.75} ${-len * 0.22} ${len} 0C${len * 0.75} ${len * 0.22} ${len * 0.3} ${len * 0.28} 0 0Z`} fill={fill} />
      <path d={`M4 0H${len - 8}`} stroke={vein} strokeWidth="2.5" opacity="0.55" />
      {[0.25, 0.45, 0.65].map((t) => (
        <path key={t} d={`M${len * t} 0L${len * (t + 0.12)} ${-len * 0.14}M${len * t} 0L${len * (t + 0.12)} ${len * 0.14}`} stroke={vein} strokeWidth="1.5" opacity="0.4" />
      ))}
    </g>
  );
}

export function CherriesFallback({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rand = rng(12);
  const clusters: Array<[number, number]> = [
    [300, 470],
    [520, 560],
    [720, 470],
  ];
  return (
    <Frame aspect="1:1" label={label} position={position}>
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.7" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#e9d9a8" />
          <stop offset="0.5" stopColor="#8a9a4b" />
          <stop offset="1" stopColor="#3e4a28" />
        </radialGradient>
        <radialGradient id={`${id}-cherry`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#e0634a" />
          <stop offset="0.6" stopColor="#b4412f" />
          <stop offset="1" stopColor="#6e1f17" />
        </radialGradient>
        <radialGradient id={`${id}-yellow`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#f3d27a" />
          <stop offset="1" stopColor="#c88a2e" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill={`url(#${id}-bg)`} />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={rand() * 1000} cy={rand() * 700} r={30 + rand() * 70} fill="#fbf1d8" opacity={0.08 + rand() * 0.12} />
      ))}
      {/* Branch */}
      <path d="M-40 380C200 420 420 480 620 470C780 462 900 420 1040 360" fill="none" stroke="#5a3a24" strokeWidth="22" strokeLinecap="round" />
      <path d="M-40 380C200 420 420 480 620 470C780 462 900 420 1040 360" fill="none" stroke="#8a6040" strokeWidth="6" opacity="0.5" />
      <Leaf x={120} y={400} len={300} angle={-150} fill="#3e5a2a" vein="#a9b38c" />
      <Leaf x={240} y={420} len={330} angle={70} fill="#2f4a22" vein="#a9b38c" />
      <Leaf x={430} y={470} len={320} angle={-110} fill="#4b6a30" vein="#c9d0a8" />
      <Leaf x={620} y={470} len={360} angle={65} fill="#2f4a22" vein="#a9b38c" />
      <Leaf x={800} y={430} len={300} angle={-80} fill="#3e5a2a" vein="#a9b38c" />
      <Leaf x={900} y={400} len={280} angle={40} fill="#4b6a30" vein="#c9d0a8" />
      {clusters.map(([cx, cy], c) =>
        Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2 + c;
          const rr = i === 0 ? 0 : 36 + (i % 3) * 12;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.8;
          const yellow = (i + c) % 5 === 0;
          const green = (i + c * 2) % 7 === 0;
          return (
            <g key={`${c}-${i}`}>
              <circle cx={x} cy={y} r="32" fill={green ? "#8a9a4b" : yellow ? `url(#${id}-yellow)` : `url(#${id}-cherry)`} />
              <ellipse cx={x - 10} cy={y - 12} rx="8" ry="5" fill="#fff" opacity="0.45" />
              <circle cx={x + 12} cy={y + 14} r="3" fill="#3b1c22" opacity="0.4" />
            </g>
          );
        }),
      )}
    </Frame>
  );
}
