import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { Bean } from "@/components/illustration/primitives";

/* hero-pour: a slow pour-over in morning window light. */
export function HeroPour({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Frame aspect="3:2" label={label} position={position}>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a4130" />
          <stop offset="0.55" stopColor="#3a2a20" />
          <stop offset="1" stopColor="#24180f" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#f6cfa8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6cfa8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a6a43" />
          <stop offset="1" stopColor="#5e3b24" />
        </linearGradient>
        <linearGradient id={`${id}-cone`} x1="0" x2="1">
          <stop offset="0" stopColor="#cdbfa9" />
          <stop offset="0.3" stopColor="#fbf4e8" />
          <stop offset="0.7" stopColor="#efe4d2" />
          <stop offset="1" stopColor="#a8987f" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a4a24" />
          <stop offset="1" stopColor="#2a140a" />
        </linearGradient>
        <linearGradient id={`${id}-kettle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2e27" />
          <stop offset="1" stopColor="#120c09" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.58" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#f0b48f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f0b48f" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-carafe`}>
          <path d="M548 470C520 520 512 590 530 640H770C788 590 780 520 752 470Z" />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width="1200" height="800" fill={`url(#${id}-wall)`} />
      <rect width="1200" height="800" fill={`url(#${id}-glow)`} />
      {/* Window light falling across the wall in long bars */}
      <g opacity="0.9">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-80 + i * 170} 0H${30 + i * 170}L${360 + i * 170} 640H${250 + i * 170}Z`} fill={`url(#${id}-beam)`} opacity={0.55 - i * 0.08} />
        ))}
      </g>
      {/* Shelf with a jar and cup in soft focus */}
      <g opacity="0.55">
        <rect x="70" y="250" width="300" height="10" fill="#2a1d15" />
        <rect x="104" y="170" width="70" height="80" rx="10" fill="#7b5a43" />
        <rect x="104" y="160" width="70" height="16" rx="5" fill="#5a4130" />
        <path d="M228 206h64v32c0 8-6 12-12 12h-40c-6 0-12-4-12-12z" fill="#c9b9a3" />
        <path d="M292 214c18 0 18 24 0 24" fill="none" stroke="#c9b9a3" strokeWidth="6" />
      </g>

      {/* Counter */}
      <path d="M0 640H1200V800H0Z" fill={`url(#${id}-wood)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${660 + i * 16}C300 ${652 + i * 16} 700 ${672 + i * 16} 1200 ${658 + i * 16}`}
          fill="none"
          stroke="#3e2617"
          strokeOpacity={0.22}
          strokeWidth="1.5"
        />
      ))}
      <rect x="0" y="636" width="1200" height="8" fill="#b9875a" opacity="0.6" />
      <ellipse cx="650" cy="646" rx="200" ry="16" fill="#1a0f09" opacity="0.45" />

      {/* Carafe */}
      <path d="M548 470C520 520 512 590 530 640H770C788 590 780 520 752 470Z" fill="#c9b9a3" opacity="0.18" />
      <g clipPath={`url(#${id}-carafe)`}>
        <path d="M500 560C580 548 700 572 800 556V660H500Z" fill={`url(#${id}-coffee)`} />
        <path d="M500 560C580 548 700 572 800 556" fill="none" stroke="#c07a46" strokeWidth="4" opacity="0.8" />
      </g>
      <path d="M548 470C520 520 512 590 530 640H770C788 590 780 520 752 470Z" fill={`url(#${id}-glass)`} stroke="#f4ecdf" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="560" y="456" width="180" height="20" rx="6" fill="#6b3f26" />

      {/* Dripper */}
      <path d="M470 300H830L728 452H572Z" fill={`url(#${id}-cone)`} />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${505 + i * 48} 308L${590 + i * 21} 446`} stroke="#8c7b62" strokeOpacity="0.22" strokeWidth="3" />
      ))}
      <ellipse cx="650" cy="300" rx="180" ry="22" fill="#fbf4e8" />
      <ellipse cx="650" cy="302" rx="160" ry="15" fill="#3b2116" />
      <ellipse cx="650" cy="302" rx="150" ry="11" fill="#6b3a1e" />
      {/* Bloom bubbles */}
      {[[612, 300, 5], [640, 304, 4], [676, 299, 6], [700, 304, 3.5], [590, 304, 3]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#c48a5a" opacity="0.7" />
      ))}
      <path d="M830 320C886 318 892 392 838 396" fill="none" stroke="#efe4d2" strokeWidth="18" strokeLinecap="round" />
      <rect x="586" y="448" width="128" height="12" rx="4" fill="#d9ccb6" />

      {/* Kettle spout entering from the top right */}
      <path d="M1220 60C1080 90 980 120 900 150C840 172 790 190 742 208" fill="none" stroke={`url(#${id}-kettle)`} strokeWidth="26" strokeLinecap="round" />
      <path d="M1220 60C1080 90 980 120 900 150C840 172 790 190 742 208" fill="none" stroke="#7a6658" strokeWidth="3" strokeOpacity="0.6" transform="translate(0 -9)" />
      <path d="M1200 0H1260V140H1140C1150 80 1170 30 1200 0Z" fill="#120c09" />
      {/* Water stream */}
      <path d="M740 214C724 236 700 262 668 296" fill="none" stroke="#f3dcc0" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <path d="M740 214C724 236 700 262 668 296" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Steam */}
      <g fill="none" stroke="#f4ecdf" strokeLinecap="round">
        <path d="M600 280C580 240 620 210 596 168C580 140 600 110 590 80" strokeWidth="8" opacity="0.14" />
        <path d="M660 270C680 230 640 196 664 150C678 122 660 92 672 60" strokeWidth="10" opacity="0.12" />
        <path d="M712 278C700 250 726 230 712 200" strokeWidth="6" opacity="0.16" />
      </g>

      {/* Beans on the counter */}
      <Bean x={300} y={690} r={13} rotate={-30} fill="#4a2a1a" crease="#24130b" />
      <Bean x={334} y={706} r={12} rotate={40} fill="#5a341f" crease="#24130b" />
      <Bean x={276} y={716} r={11} rotate={10} fill="#4a2a1a" crease="#24130b" />
      <Bean x={930} y={700} r={12} rotate={-60} fill="#5a341f" crease="#24130b" />
      <Bean x={962} y={688} r={11} rotate={20} fill="#4a2a1a" crease="#24130b" />
    </Frame>
  );
}
