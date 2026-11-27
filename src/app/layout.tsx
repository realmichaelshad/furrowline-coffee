import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/content/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { InteractionLayer } from "@/components/motion/InteractionLayer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · Seasonal coffee, roasted twice a week`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} · Follow the line from farm to cup`,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f4ecdf",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SkipLink />
        <CartProvider>
          <Header
            logo={<Logo variant="compact" shared="define" decorative className="h-[1.6rem] w-auto sm:h-[1.75rem]" />}
            menuLogo={
              <Logo variant="compact" shared="use" decorative markColor="var(--color-peach)" className="h-[1.6rem] w-auto" />
            }
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <MotionProvider />
        <InteractionLayer />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
