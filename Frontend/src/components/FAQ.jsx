import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/faq.css";

const FAQ = () => {
  const [active, setActive] = useState(0);

  const faqs = [
    {
      question: "Do you provide online consultation?",
      answer: "Yes, consultation is available through Phone Call and WhatsApp."
    },
    {
      question: "How can I book an appointment?",
      answer: "You can call us directly, contact us on WhatsApp or fill out the appointment form."
    },
    {
      question: "What services do you provide?",
      answer: "Kundli Analysis, Marriage Problems, Love Problems, Career Guidance, Numerology and Vastu Consultation."
    },
    {
      question: "Is my information confidential?",
      answer: "Yes, all consultations remain completely private and confidential."
    },
    {
      question: "Do you provide remedies?",
      answer: "Yes, personalized remedies are suggested according to your horoscope and life situation."
    }
  ];

  return (
    <section className="faq-section">

      <div className="faq-header">
        <span className="faq-badge">
          Frequently Asked Questions
        </span>

        <h2>
          Have Questions? We Have Answers
        </h2>

        <p>
          Find answers to the most common questions about our astrology services.
        </p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${active === index ? "active" : ""}`}
          >
            <button
              className="faq-question"
              onClick={() =>
                setActive(active === index ? null : index)
              }
            >
              <span>{faq.question}</span>

              <div className="faq-icon">
                {active === index ? <FaMinus /> : <FaPlus />}
              </div>
            </button>

            {active === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};

export default FAQ;