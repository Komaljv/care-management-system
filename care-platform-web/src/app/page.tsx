
export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 px-6 py-16 text-gold-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-gold-200">Grace & Goodwill</p>
          <h1 className="text-5xl font-semibold leading-tight text-gold-50 sm:text-6xl">
            Trusted care defined by integrity and refined coordination.
          </h1>
          <p className="max-w-xl text-base text-gold-200">
            Build a modern care experience with elegant workflows, compassionate support, and technology designed for seniors, families, and providers.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-navy-950 shadow-elegant transition hover:bg-gold-400"
            >
              View pricing
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-gold-300 px-8 py-4 text-sm font-semibold text-gold-100 transition hover:bg-navy-900/80"
            >
              Learn more
            </a>
          </div>
        </div>

        <div className="rounded-[32px] border border-gold-300/20 bg-navy-900/80 p-8 shadow-elegant backdrop-blur-lg lg:max-w-md">
          <div className="flex items-center gap-4 rounded-3xl border border-gold-300/20 bg-navy-950/80 p-5">
            <img src="/logo.svg" alt="Grace & Goodwill logo" className="h-16 w-16 rounded-xl border border-gold-300/30 bg-navy-900 p-2" />
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gold-200">Grace & Goodwill</p>
              <p className="text-2xl font-semibold text-gold-50">Care defined by integrity</p>
            </div>
          </div>
          <p className="mt-6 text-gold-200">
            Designed to feel premium and personal, our platform brings harmony to care teams and families while supporting every touchpoint with clarity.
          </p>
        </div>
      </section>
    </main>
  );
}
