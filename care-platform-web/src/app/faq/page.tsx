const faqs = [
  {
    question: 'What types of organizations does Care Platform support?',
    answer: 'We support care teams across clinical programs, care management, and health services organizations that need coordinated workflows and better visibility.',
  },
  {
    question: 'Can I customize the membership plan?',
    answer: 'Yes. We offer custom pricing for large teams and enterprise customers so you can tailor the solution to your needs.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is a priority: we follow industry best practices for data protection and secure hosting.',
  },
];

export default function FAQPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-900">
      <section className="rounded-[2rem] bg-white/95 p-10 shadow-soft ring-1 ring-slate-200">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">FAQ</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Find answers to common questions about the product, pricing, and service.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-xl font-semibold text-slate-950">{faq.question}</h2>
            <p className="mt-3 text-slate-600 leading-7">{faq.answer}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
