import type { CoffeeArtKey, CoffeePalette } from "@/content/products";
import { hillShape, polar, ridge, waveLine } from "@/lib/geometry";
import { Blossom, Cherries, Crescent, Furrows, Stars, Sun } from "@/components/illustration/primitives";

/* ==========================================================================
   Label motifs: one landscape per coffee, drawn in a 180 × 150 window.
   Each ties the origin (terraces, ridges, plateau, night field) to the
   tasting notes (jasmine and peach sun, honey sky, citrus sun, cherries).
   ========================================================================== */

export const MOTIF_W = 180;
export const MOTIF_H = 150;

type MotifProps = { palette: CoffeePalette };

/** Ethiopia, Guji: sunrise over terraced hills, jasmine in the foreground. */
function FirstLight({ palette }: MotifProps) {
  const [olive, straw, deep] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Sun cx={96} cy={80} r={26} fill={palette.accent} rings={3} ringGap={9} />
      <path d={hillShape(78, 180, 150, 7, 1.2, 0.6)} fill={straw} />
      {[86, 93, 100].map((y, i) => (
        <path key={y} d={waveLine(y, 180, 7, 1.2, 0.6 + i * 0.05)} fill="none" stroke={palette.window} strokeWidth={0.9} opacity={0.55} />
      ))}
      <path d={hillShape(98, 180, 150, 9, 0.9, 2.4)} fill={olive} />
      {[106, 113, 120, 127].map((y, i) => (
        <path key={y} d={waveLine(y, 180, 9, 0.9, 2.4 + i * 0.04)} fill="none" stroke={straw} strokeWidth={1} opacity={0.6} />
      ))}
      <path d={hillShape(122, 180, 150, 6, 0.7, 4.2)} fill={deep} />
      <path d="M8 150C14 136 22 128 34 124" fill="none" stroke={deep} strokeWidth={2} />
      <path d="M22 134C30 124 42 122 50 126C42 132 32 136 22 134Z" fill={olive} />
      <Blossom cx={20} cy={128} r={9} petal="#fffaf0" center={palette.accent} rotate={12} />
      <Blossom cx={40} cy={140} r={7} petal="#fffaf0" center={palette.accent} rotate={40} />
      <Blossom cx={154} cy={136} r={6} petal="#fffaf0" center={palette.accent} rotate={-10} />
    </>
  );
}

/** Colombia, Huila: steep honey-lit ridges planted in contour rows. */
function HoneyRidge({ palette }: MotifProps) {
  const [deep, ember, darkest] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Sun cx={128} cy={54} r={20} fill={palette.accent} rings={2} ringStroke={ember} ringGap={8} />
      <path d={ridge([[-10, 96], [30, 64], [62, 88], [104, 46], [146, 82], [190, 60]], 150)} fill={ember} opacity={0.9} />
      <path d={waveLine(84, 180, 3, 2, 1)} fill="none" stroke={palette.window} strokeWidth={2.5} opacity={0.7} />
      <path d={ridge([[-10, 120], [36, 82], [78, 112], [120, 78], [190, 116]], 150)} fill={deep} />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 96 + i * 6;
        return (
          <path
            key={i}
            d={`M${54 + i * 3} ${y + 14}Q${88} ${y - 6} ${124 - i * 2} ${y + 6}`}
            fill="none"
            stroke={ember}
            strokeWidth={1.3}
            opacity={0.85}
          />
        );
      })}
      <path d={ridge([[-10, 136], [40, 120], [96, 138], [150, 118], [190, 132]], 150)} fill={darkest} />
      <path d="M150 100c0 6 -4 10 -8 10s-8 -4 -8 -10c0 -6 8 -14 8 -14s8 8 8 14z" fill={palette.accent} />
    </>
  );
}

/** Guatemala, Huehuetenango: limestone plateau under a citrus sun, raked drying patio. */
function HighlandAlmanac({ palette }: MotifProps) {
  const [mid, zest, deep] = palette.tones;
  const cx = 62;
  const cy = 58;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <circle cx={cx} cy={cy} r={28} fill={zest} />
      <circle cx={cx} cy={cy} r={23} fill="none" stroke={palette.window} strokeWidth={1.6} />
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = polar(cx, cy, 22, i * 36);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={palette.window} strokeWidth={1.4} />;
      })}
      <circle cx={cx} cy={cy} r={3} fill={palette.window} />
      <path d={ridge([[-10, 98], [26, 80], [70, 84], [100, 66], [140, 70], [190, 86]], 150)} fill={mid} opacity={0.75} />
      <path d={ridge([[-10, 108], [44, 96], [92, 100], [132, 84], [190, 98]], 150)} fill={deep} />
      <path d="M0 118H180V150H0Z" fill={palette.bag} />
      <Furrows width={180} height={150} rows={14} horizon={112} vanishX={110} stroke={deep} strokeWidth={1} opacity={0.55} />
      <path d="M0 118H180" stroke={deep} strokeWidth={1} />
    </>
  );
}

/** House espresso: a ploughed night field, crescent moon, black cherries. */
function DeepField({ palette }: MotifProps) {
  const [cherry, molasses, cream] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Stars
        fill={cream}
        points={[
          [20, 22], [44, 40, 0.8], [70, 16], [92, 36, 0.7], [118, 20, 0.9], [150, 44], [164, 18, 0.8], [30, 62, 0.7], [134, 64, 0.6],
        ]}
      />
      <Crescent cx={60} cy={60} r={16} fill={cream} />
      <path d="M0 92H180V150H0Z" fill={molasses} />
      <Furrows width={180} height={150} rows={16} horizon={92} vanishX={96} stroke={cherry} strokeWidth={1.4} />
      <path d={waveLine(92, 180, 2, 1.5, 0)} fill="none" stroke={cherry} strokeWidth={1.4} />
      <path d="M150 0C148 10 146 18 140 26" fill="none" stroke={cream} strokeWidth={1} opacity={0.6} />
      <Cherries x={140} y={22} scale={0.95} fill={palette.accent} highlight={cream} stem="#6e3b1f" />
    </>
  );
}

/** Decaf: a slow moon over gentle rows. */
function SlowAcre({ palette }: MotifProps) {
  const [dark, mid, straw] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Sun cx={124} cy={56} r={22} fill={palette.accent} rings={2} ringGap={8} />
      <path d={hillShape(88, 180, 150, 10, 0.6, 1)} fill={mid} />
      <path d={hillShape(104, 180, 150, 8, 0.8, 3)} fill={dark} />
      {[112, 120, 128, 136, 144].map((y, i) => (
        <path key={y} d={waveLine(y, 180, 8 - i, 0.8, 3)} fill="none" stroke={straw} strokeWidth={1} opacity={0.55} />
      ))}
    </>
  );
}

/** Seasonal Kenya: a lantern sun hanging over night terraces. */
function HarvestLantern({ palette }: MotifProps) {
  const [plum, amber, red] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Sun cx={90} cy={64} r={24} fill={amber} rings={3} ringGap={9} ringStroke={amber} />
      <path d="M90 0V40" stroke={amber} strokeWidth={1.2} />
      <path d={hillShape(96, 180, 150, 8, 1.1, 0.4)} fill={plum} />
      <path d={hillShape(114, 180, 150, 7, 0.9, 2)} fill={red} opacity={0.85} />
      {[122, 130, 138].map((y) => (
        <path key={y} d={waveLine(y, 180, 6, 0.9, 2)} fill="none" stroke={amber} strokeWidth={0.9} opacity={0.5} />
      ))}
    </>
  );
}

/** Cold brew blend: a big sun over straight summer rows. */
function FieldDay({ palette }: MotifProps) {
  const [sage, peach, deep] = palette.tones;
  return (
    <>
      <rect width={MOTIF_W} height={MOTIF_H} fill={palette.window} />
      <Sun cx={90} cy={86} r={34} fill={peach} />
      <path d="M0 88H180V150H0Z" fill={sage} />
      <Furrows width={180} height={150} rows={12} horizon={88} stroke={deep} strokeWidth={1.3} opacity={0.7} />
    </>
  );
}

const MOTIFS: Record<CoffeeArtKey, (p: MotifProps) => React.ReactNode> = {
  "first-light": FirstLight,
  "honey-ridge": HoneyRidge,
  "highland-almanac": HighlandAlmanac,
  "deep-field": DeepField,
  "slow-acre": SlowAcre,
  "harvest-lantern": HarvestLantern,
  "field-day": FieldDay,
};

export function Motif({ art, palette }: { art: CoffeeArtKey; palette: CoffeePalette }) {
  const Component = MOTIFS[art];
  return <Component palette={palette} />;
}
