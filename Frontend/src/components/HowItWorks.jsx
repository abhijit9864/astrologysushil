const steps = [
  { title: "Book Consultation", desc: "Share your details and the service you need." },
  { title: "Share Birth Details", desc: "We review your request and reach out quickly." },
  { title: "Receive Deep Analysis", desc: "Continue the consultation through WhatsApp or phone." },
  { title: "Receive Guidance", desc: "Get clear guidance and remedies tailored to you." },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#fffdf8] py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Consultation Process</p>
          <h2 className="text-3xl font-semibold text-[#2b2b2b] sm:text-4xl">A graceful four-step journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6b7280]">From your first enquiry to your personalized consultation, everything stays effortless and premium.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-[#efe6d7] bg-white p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)] transition duration-300 hover:-translate-y-2 hover:border-[#c9a227]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff8f0] text-lg font-semibold text-[#6b3418]">0{index + 1}</div>
              <h3 className="mb-2 text-xl font-semibold text-[#2b2b2b]">{step.title}</h3>
              <p className="text-sm leading-7 text-[#6b7280]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
