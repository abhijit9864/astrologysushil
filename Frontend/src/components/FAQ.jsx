import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQ = () => {
  const [active, setActive] = useState(0);

  const faqs = [
    {
      question: "Do you provide online consultation?",
      answer: "Yes, consultations are arranged through WhatsApp or phone call for your convenience."
    },
    {
      question: "How can I book an appointment?",
      answer: "Simply fill the consultation form or reach out directly on WhatsApp to start your request."
    },
    {
      question: "What services do you provide?",
      answer: "We cover Career, Marriage, Love, Business, Health, Kundali, Vastu, Numerology and more."
    },
    {
      question: "Is my information confidential?",
      answer: "Yes, every consultation request is handled with care and complete privacy."
    },
    {
      question: "Do you provide remedies?",
      answer: "Yes, tailored guidance and remedies are shared based on your chart and life situation."
    }
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Frequently Asked Questions</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Have Questions? We Have Answers</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Find answers to the most common questions about our astrology services.</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = active === index;
            return (
              <div key={index} className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm">
                <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setActive(isOpen ? null : index)}>
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <div className="rounded-full bg-white p-2 text-[#1E40AF]">
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </div>
                </button>
                {isOpen && <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;