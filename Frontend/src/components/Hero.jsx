import "../styles/hero.css";
import astrologer from "../assets/astrologer.png";
import zodiacWheel from "../assets/zodiac-wheel.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section hero-dark">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-image-section">
          <div className="hero-image-frame">
            <img src={zodiacWheel} alt="" className="zodiac-wheel" />
            <img src={astrologer} alt="Astrologer Sushil Kumar" className="hero-image" />
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-badge">✦ Trusted Astrology Guidance</span>
          <h1 className="hero-title">Astrologer Pandit Sushil</h1>
          <h2 className="hero-subtitle">Career, Marriage, Love, Business, Health, Kundali, Vastu and Horoscope Consultation.</h2>
          <p className="hero-description">Get premium astrological guidance from Pandit Sushil Kumar with a calm, confidential and luxurious consultation experience.</p>

          <div className="hero-buttons">
            <Link to="/consultation" className="primary-btn">Book Consultation</Link>
            <a href="https://wa.me/917377237360" target="_blank" rel="noreferrer" className="secondary-btn">Talk on WhatsApp</a>
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
              <p>Lead Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
