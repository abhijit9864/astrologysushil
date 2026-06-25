import "../styles/hero.css";
import astrologer from "../assets/astrologer.png";
import zodiacWheel from "../assets/zodiac-wheel.png";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
const Hero = () => {
  const { darkMode } = useTheme();
  return (
    <section
      className={`hero-section ${darkMode ? "hero-dark" : "hero-light"
        }`}
    >

      <div className="hero-overlay"></div>

      <div className="hero-container">

        <div className="hero-image-section">
          <div className="hero-image-frame">
            <img
              src={zodiacWheel}
              alt=""
              className="zodiac-wheel"
            />
            <img
              src={astrologer}
              alt="Astrologer Sushil Kumar"
              className="hero-image"
            />
          </div>
        </div>

        <div className="hero-content">

          <span className="hero-badge">
            ✨ Trusted Astrology Consultation
          </span>

          <h1 className="hero-title">
            Astrologer Pandit Sushil
          </h1>

          <h2 className="hero-subtitle">
            Accurate Solutions For Every Life Problem
          </h2>

          <p className="hero-description">
            Expert guidance for Love, Marriage,
            Career, Business, Family Problems,
            Horoscope Analysis and Vastu Consultation.
          </p>

          <div className="hero-buttons">
            <Link
              to="/consultation"
              className="primary-btn"
            >
              Book Consultation
            </Link>

            <button className="secondary-btn">
              WhatsApp Now
            </button>
          </div>

          <div className="hero-stats">

            <div className="stat-card">
              <h3>5000+</h3>
              <p>Happy Clients</p>
            </div>

            <div className="stat-card">
              <h3>20+</h3>
              <p>Years Experience</p>
            </div>

            <div className="stat-card">
              <h3>24x7</h3>
              <p>Support Available</p>
            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default Hero;
