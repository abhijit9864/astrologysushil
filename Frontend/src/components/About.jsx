import "../styles/about.css";
import aboutImage from "../assets/about-astrologer.jpeg";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image">
          <img src={aboutImage} alt="Pandit Sushil Kumar" />
        </div>

        <div className="about-content">
          <span className="about-badge">About Pandit Ji</span>
          <h2 className="about-title">Pandit Sushil Kumar</h2>
          <p className="about-description">With more than two decades of experience in Vedic astrology, Kundali analysis, Vastu and spiritual guidance, Pandit Sushil Kumar offers thoughtful, practical and premium consultations that help people move forward with clarity.</p>

          <div className="about-features">
            <div className="feature-card">
              <h3>20+</h3>
              <p>Years Experience</p>
            </div>
            <div className="feature-card">
              <h3>5000+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="feature-card">
              <h3>100%</h3>
              <p>Confidential Guidance</p>
            </div>
          </div>

          <a href="/consultation" className="about-btn">Book Consultation</a>
        </div>
      </div>
    </section>
  );
};

export default About;