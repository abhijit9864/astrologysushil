import "../styles/testimonials.css";
import { FaStar } from "react-icons/fa";

const Testimonials = () => {
  const reviews = [
    {
      name: "Rahul Sharma",
      location: "Bhubaneswar",
      review:
        "The consultation was very accurate and helped me solve my career issues.",
    },
    {
      name: "Priya Das",
      location: "Cuttack",
      review:
        "I got positive results in my marriage after following the guidance.",
    },
    {
      name: "Amit Kumar",
      location: "Puri",
      review:
        "Very knowledgeable astrologer. Highly recommended for Kundli analysis.",
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