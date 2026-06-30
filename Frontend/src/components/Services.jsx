import "../styles/services.css";

const services = [
  { icon: "💼", title: "Career", description: "Guidance for growth, decisions and success." },
  { icon: "💍", title: "Marriage", description: "Support for compatibility and relationship clarity." },
  { icon: "❤️", title: "Love", description: "Relationship insight with empathetic guidance." },
  { icon: "📈", title: "Business", description: "Astrological direction for growth and prosperity." },
  { icon: "🎓", title: "Education", description: "Support for focus, confidence and academic progress." },
  { icon: "🩺", title: "Health", description: "Holistic remedies and wellness guidance." },
  { icon: "🌙", title: "Kundali", description: "Detailed birth chart analysis and remedies." },
  { icon: "🪔", title: "Manglik Dosh", description: "Specialized consultation for relationship balance." },
  { icon: "🏠", title: "Vastu", description: "Balance and harmony for your home or office." },
  { icon: "✋", title: "Palm Reading", description: "Deep insights through hand analysis." },
  { icon: "🔢", title: "Numerology", description: "Numbers-based guidance for life choices." },
];

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <span className="services-badge">Our Services</span>
          <h2 className="services-title">Premium astrology services for every life area</h2>
          <p className="services-subtitle">Choose the guidance you need and connect with our team directly through WhatsApp.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
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