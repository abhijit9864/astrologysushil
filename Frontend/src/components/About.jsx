import "../styles/about.css";
import aboutImage from "../assets/about-astrologer.jpeg";

const About = () => {
  return (
    <section className="about-section">

      <div className="about-container">

        <div className="about-image">
          <img
            src={aboutImage}
            alt="Astrologer Sushil Kumar"
          />
        </div>

        <div className="about-content">

          <span className="about-badge">
            About Astrologer
          </span>

          <h2 className="about-title">
            Astrologer Pandit Sushil
          </h2>

          <p className="about-description">
            With over 20 years of experience in Vedic Astrology,
            Numerology, Kundli Analysis and Spiritual Guidance,
            Astrologer Sushil Kumar has helped thousands of
            individuals solve life challenges and achieve
            success, peace and prosperity.
          </p>

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
              <p>Confidential Consultation</p>
            </div>

          </div>

          <button className="about-btn">
            Book Consultation
          </button>

        </div>

      </div>

    </section>
  );
};

export default About;