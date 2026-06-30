const steps = [
  { title: "Fill Consultation Form", desc: "Share your details and the service you need." },
  { title: "Our Team Contacts You", desc: "We review your request and reach out quickly." },
  { title: "Consult on WhatsApp", desc: "Continue the consultation through WhatsApp or phone." },
  { title: "Receive Guidance", desc: "Get clear guidance and remedies tailored to you." },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">How It Works</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">A simple four-step journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#BBBBBB]">From your first enquiry to your personalized consultation, everything stays effortless and premium.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-[rgba(37,99,235,0.25)] bg-[rgba(16,33,58,0.9)] p-6 shadow-[0_15px_45px_rgba(3,12,28,0.4)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-lg font-semibold text-black">0{index + 1}</div>
              <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-7 text-[#BBBBBB]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
