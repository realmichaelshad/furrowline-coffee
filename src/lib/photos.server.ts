import "server-only";
import fs from "node:fs";
import path from "node:path";
import { HERO_VIDEO, type PhotoSlot } from "@/content/photos";

/* ==========================================================================
   Build-time photo lookup. Pages are statically generated, so this runs
   during `next build` (and per request in dev): adding a file to
   public/photos and rebuilding is all it takes to swap a fallback out.
   ========================================================================== */

const EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"] as const;
const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface FoundPhoto {
  src: string;
}

export function findPhoto(slot: PhotoSlot): FoundPhoto | null {
  for (const ext of EXTENSIONS) {
    const file = path.join(PUBLIC_DIR, "photos", `${slot}.${ext}`);
    if (fs.existsSync(file)) return { src: `/photos/${slot}.${ext}` };
  }
  return null;
}

export function hasHeroVideo(): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, HERO_VIDEO.path));
}
