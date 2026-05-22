const steps = [
  {
    title: 'Connect your team',
    description: 'Invite care coordinators, clinicians, and support staff to work from one shared dashboard.',
  },
  {
    title: 'Organize workflows',
    description: 'Use curated care pathways, task lists, and status updates to move cases forward with confidence.',
  },
  {
    title: 'Track outcomes',
    description: 'Measure key metrics, stay on schedule, and keep patient progress visible to the whole team.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-900">
      <section className="rounded-[2rem] bg-white/95 p-10 shadow-soft ring-1 ring-slate-200">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          How it works
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Care Platform brings your care team together, simplifies task management, and helps you deliver consistent service across every patient interaction.
        </p>
      </section>

      <section className="mt-10 grid gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Step {index + 1}</div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{step.title}</h2>
            <p className="mt-3 text-slate-600 leading-7">{step.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
