import "../styles/whyChooseUs.css";
import {
  FaAward,
  FaUserShield,
  FaHeadset,
  FaHandsHelping,
} from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaAward />,
      title: "20+ Years Experience",
      desc: "Providing trusted astrology guidance for many years."
    },
    {
      icon: <FaUserShield />,
      title: "100% Confidential",
      desc: "Your personal information remains completely private."
    },
    {
      icon: <FaHandsHelping />,
      title: "Accurate Guidance",
      desc: "Personalized solutions based on Vedic astrology."
    },
    {
      icon: <FaHeadset />,
      title: "Online & Offline Support",
      desc: "Consultation available from anywhere."
    }
  ];

  return (
    <section className="why-section">

      <div className="why-header">
        <span className="wcu-badge">
          Why Choose Us
        </span>

        <h2>
          Why People Trust
          <span> Astrologer Sushil Kumar</span>
        </h2>
      </div>

      <div className="why-grid">

        {features.map((item, index) => (
          <div className="why-card" key={index}>
            <div className="why-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>
          </div>
        ))}

      </div>

    </section>
  );
};

export default WhyChooseUs;