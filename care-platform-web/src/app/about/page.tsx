export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12 text-slate-900">
      <section className="rounded-[2rem] bg-white/95 p-10 shadow-soft ring-1 ring-slate-200">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          About Us
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Care Platform is designed to streamline care coordination, improve communication, and empower every member of your care team.
          We build thoughtful workflows for clinicians, administrators, and patients so they can focus on what matters most.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">Our mission</h2>
          <p className="mt-4 text-slate-600 leading-7">
            To help care teams deliver better outcomes through clear coordination, data-driven insights, and a compassionate digital experience.
          </p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">Our values</h2>
          <p className="mt-4 text-slate-600 leading-7">
            We believe in simplifying complexity, protecting trust, and building systems that put people first.
          </p>
        </div>
      </section>
    </main>
  );
}
