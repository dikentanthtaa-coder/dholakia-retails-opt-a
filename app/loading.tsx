/**
 * Root loading boundary — streamed in by Next.js while server data resolves.
 *
 * Renders a section-shaped skeleton instead of a spinner so the first
 * paint already matches the marketing layout. The shimmer is pure CSS
 * (see globals.css `.skeleton`) — no JS, no Framer Motion.
 *
 * Server Component on purpose: zero client JS to ship for the loading frame.
 */
export default function Loading() {
  return (
    <div aria-busy aria-live="polite">
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[var(--color-bg-inverse)]">
        <div className="absolute inset-0 skeleton skeleton-dark" />
        <div className="relative z-10 h-full container-editorial flex flex-col justify-center items-center text-center gap-6 pt-24 pb-32">
          <div className="h-3 w-40 rounded-sm skeleton skeleton-dark" />
          <div className="h-12 w-3/4 max-w-2xl rounded-sm skeleton skeleton-dark" />
          <div className="h-12 w-2/3 max-w-xl rounded-sm skeleton skeleton-dark" />
          <div className="h-4 w-1/2 max-w-md rounded-sm skeleton skeleton-dark mt-4" />
        </div>
      </section>

      <section className="bg-[var(--color-bg-elevated)] py-32">
        <div className="container-editorial flex flex-col items-center gap-6">
          <div className="h-3 w-32 rounded-sm skeleton" />
          <div className="h-10 w-3/4 max-w-2xl rounded-sm skeleton" />
          <div className="h-4 w-2/3 max-w-xl rounded-sm skeleton" />
          <div className="h-4 w-1/2 max-w-md rounded-sm skeleton" />
        </div>
      </section>

      <section className="bg-white py-32">
        <div className="container-editorial">
          <div className="h-8 w-1/2 max-w-md rounded-sm skeleton mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] w-full rounded-sm skeleton" />
                <div className="h-5 w-3/4 rounded-sm skeleton" />
                <div className="h-4 w-full rounded-sm skeleton" />
                <div className="h-4 w-2/3 rounded-sm skeleton" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
