import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/faq.css";

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