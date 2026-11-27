import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { Bean } from "@/components/illustration/primitives";

/* latte: top-down rosetta in a speckled stoneware cup on a warm wooden table. */
export function LatteFallback({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <Frame aspect="1:1" label={label} position={position}>
      <defs>
        <radialGradient id={`${id}-crema`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c48a5a" />
          <stop offset="0.75" stopColor="#a06038" />
          <stop offset="1" stopColor="#6b3a1e" />
        </radialGradient>
        <radialGradient id={`${id}-cup`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fbf4e8" />
          <stop offset="1" stopColor="#d9ccb6" />
        </radialGradient>
        <pattern id={`${id}-speck`} width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="8" r="1.6" fill="#7a6a58" opacity="0.5" />
          <circle cx="26" cy="20" r="1.2" fill="#7a6a58" opacity="0.4" />
          <circle cx="14" cy="32" r="1.4" fill="#7a6a58" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="1000" height="1000" fill="#8a5a3a" />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M0 ${i * 76 + 20}C300 ${i * 76 - 10} 600 ${i * 76 + 50} 1000 ${i * 76 + 10}`} fill="none" stroke="#5e3b24" strokeWidth="3" opacity="0.35" />
      ))}
      {/* Linen napkin */}
      <path d="M640 0H1000V330C900 320 760 300 680 250C640 160 650 80 640 0Z" fill="#e9ddc8" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${680 + i * 70} 0C${690 + i * 66} 120 ${700 + i * 64} 220 ${730 + i * 60} 300`} stroke="#cdbfa9" strokeWidth="3" fill="none" />
      ))}
      {/* Saucer + cup */}
      <ellipse cx="470" cy="540" rx="350" ry="350" fill="#2a1a10" opacity="0.25" />
      <circle cx="460" cy="520" r="340" fill={`url(#${id}-cup)`} />
      <circle cx="460" cy="520" r="340" fill={`url(#${id}-speck)`} />
      <circle cx="460" cy="520" r="270" fill="#cdbfa9" />
      <path d="M720 560C800 580 820 660 760 690" fill="none" stroke="#e9ddc8" strokeWidth="44" strokeLinecap="round" />
      <circle cx="460" cy="520" r="250" fill={`url(#${id}-cup)`} />
      <circle cx="460" cy="520" r="250" fill={`url(#${id}-speck)`} />
      <circle cx="460" cy="520" r="218" fill={`url(#${id}-crema)`} />
      {/* Rosetta */}
      <g fill="#f6ead6">
        {leaves.map((i) => {
          const y = 380 + i * 36;
          const w = 150 - i * 15;
          return <path key={i} d={`M${460 - w} ${y}C${460 - w * 0.6} ${y + 40} ${460 + w * 0.6} ${y + 40} ${460 + w} ${y}C${460 + w * 0.4} ${y + 22} ${460 - w * 0.4} ${y + 22} ${460 - w} ${y}Z`} />;
        })}
        <path d="M460 330C500 330 520 360 500 386C480 400 440 400 420 386C400 360 420 330 460 330Z" />
      </g>
      <path d="M460 340V650" stroke="#f6ead6" strokeWidth="6" strokeLinecap="round" />
      {/* Spoon */}
      <path d="M140 860L330 700" stroke="#b8b1a7" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="350" cy="684" rx="36" ry="22" fill="#d9d4cc" transform="rotate(-40 350 684)" />
      <Bean x={860} y={820} r={22} rotate={30} fill="#4a2a1a" crease="#24130b" />
      <Bean x={910} y={870} r={20} rotate={-20} fill="#5a341f" crease="#24130b" />
      <Bean x={820} y={890} r={18} rotate={70} fill="#4a2a1a" crease="#24130b" />
    </Frame>
  );
}
