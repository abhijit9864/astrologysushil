import "../styles/testimonials.css";
import { FaStar } from "react-icons/fa";

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
    <section className="testimonial-section">
      <div className="testimonial-header">
        <span className="client-badge">
          Client Testimonials
        </span>

        <h2>
          What Our Clients Say
        </h2>

        <p>
          Trusted by thousands of satisfied clients.
        </p>
      </div>

      <div className="testimonial-grid">
        {reviews.map((review, index) => (
          <div className="testimonial-card" key={index}>

            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p className="review-text">
              "{review.review}"
            </p>

            <h3>{review.name}</h3>

            <span>{review.location}</span>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;