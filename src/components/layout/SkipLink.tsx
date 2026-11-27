/** First focusable element on every page: jumps past the header to <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-full bg-espresso px-5 py-3 text-small font-semibold text-parchment shadow-lift"
    >
      Skip to content
    </a>
  );
}
