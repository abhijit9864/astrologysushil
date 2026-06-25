import "../styles/services.css";

const services = [
  {
    icon: "❤️",
    title: "Love Problem Solution",
    description:
      "Expert guidance for relationship and love related issues.",
  },
  {
    icon: "💍",
    title: "Marriage Consultation",
    description:
      "Solutions for marriage delays and compatibility issues.",
  },
  {
    icon: "💼",
    title: "Career Guidance",
    description:
      "Get the right direction for career growth and success.",
  },
  {
    icon: "📈",
    title: "Business Growth",
    description:
      "Astrological solutions for business prosperity and expansion.",
  },
  {
    icon: "🏠",
    title: "Vastu Consultation",
    description:
      "Bring positivity and harmony to your home and office.",
  },
  {
    icon: "📜",
    title: "Kundli Analysis",
    description:
      "Detailed horoscope and birth chart reading by experts.",
  },
];

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">

        <div className="services-header">
          <span className="services-badge">
            Our Astrology Services
          </span>

          <h2 className="services-title">
            Discover Solutions For Every Problem
          </h2>

          <p className="services-subtitle">
            Trusted astrology consultation with accurate guidance
            for love, marriage, career, business and life.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;