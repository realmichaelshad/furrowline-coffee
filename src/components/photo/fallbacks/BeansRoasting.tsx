import { useId } from "react";
import { Frame, type FallbackProps } from "./Frame";
import { Bean } from "@/components/illustration/primitives";
import { rng } from "@/lib/geometry";

/* beans-roasting: overhead cooling tray, the stirring arm drawing furrows through the beans. */
export function BeansRoasting({ label, position }: FallbackProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rand = rng(7);
  const beans: React.ReactNode[] = [];
  // Beans flow in spiral arms, like furrows ploughed by the paddles.
  for (let i = 0; i < 420; i++) {
    const t = rand();
    const r = 40 + Math.sqrt(t) * 400;
    const arm = Math.floor(rand() * 3);
    const angle = arm * ((Math.PI * 2) / 3) + r * 0.012 + (rand() - 0.5) * 0.9;
    const x = 500 + Math.cos(angle) * r;
    const y = 500 + Math.sin(angle) * r;
    const tone = rand();
    beans.push(
      <Bean
        key={i}
        x={x}
        y={y}
        r={15 + rand() * 4}
        rotate={(angle * 180) / Math.PI + 90 + (rand() - 0.5) * 60}
        fill={tone > 0.66 ? "#7a4a2c" : tone > 0.33 ? "#5c361f" : "#4a2a17"}
        crease="#25130a"
      />,
    );
  }
  return (
    <Frame aspect="1:1" label={label} position={position}>
      <defs>
        <radialGradient id={`${id}-tray`} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#6b3f26" />
          <stop offset="1" stopColor="#2a160c" />
        </radialGradient>
        <radialGradient id={`${id}-sheen`} cx="0.35" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#f6cfa8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#f6cfa8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="#1d1410" />
      <circle cx="500" cy="500" r="470" fill="#3a2f28" />
      <circle cx="500" cy="500" r="452" fill="#16100c" />
      <circle cx="500" cy="500" r="440" fill={`url(#${id}-tray)`} />
      {beans}
      {/* Stirring arms */}
      {[0, 120, 240].map((a) => (
        <g key={a} transform={`rotate(${a + 18} 500 500)`}>
          <rect x="500" y="490" width="420" height="20" rx="10" fill="#b8b1a7" />
          <rect x="500" y="490" width="420" height="7" rx="3" fill="#f4ecdf" opacity="0.4" />
          <rect x="880" y="470" width="18" height="60" rx="6" fill="#8f877d" />
        </g>
      ))}
      <circle cx="500" cy="500" r="54" fill="#2c2420" />
      <circle cx="500" cy="500" r="36" fill="#b8b1a7" />
      <circle cx="500" cy="500" r="440" fill={`url(#${id}-sheen)`} />
      <path d="M180 260C150 200 210 160 180 100" fill="none" stroke="#f4ecdf" strokeWidth="30" opacity="0.06" strokeLinecap="round" />
    </Frame>
  );
}
