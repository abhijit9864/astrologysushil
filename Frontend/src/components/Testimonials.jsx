import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const reviews = [
    {
      name: "Rahul Sharma",
      location: "Bhubaneswar",
      review: "The consultation felt premium and deeply personal. The guidance helped me make a confident career decision.",
    },
    {
      name: "Priya Das",
      location: "Cuttack",
      review: "The process was smooth, clear and comforting. I felt heard from the very first step.",
    },
    {
      name: "Amit Kumar",
      location: "Puri",
      review: "I booked through WhatsApp and received thoughtful guidance with great clarity and patience.",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Client Testimonials</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">What Our Clients Say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Trusted by thousands of satisfied clients for compassionate and thoughtful guidance.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.06)]" key={index}>
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3">
                <div className="mt-1 rounded-full bg-[#EEF4FF] p-3 text-[#1E40AF]">
                  <FaQuoteLeft />
                </div>
                <p className="text-slate-600">“{review.review}”</p>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-slate-900">{review.name}</h3>
                <p className="text-sm text-slate-500">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;