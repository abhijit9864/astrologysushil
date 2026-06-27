import "../styles/footer.css";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* About */}
        <div className="footer-about">
          <h2>VEDIC JYOTISH</h2>

          <p>
            Trusted Astrology Consultation for Career,
            Marriage, Love, Business and Life Problems.
          </p>

          <div className="footer-contact">

            <p>
              <FaPhoneAlt />
              <span>+91 7377237360</span>
            </p>

            <p>
              <FaWhatsapp />
              <span>WhatsApp Support</span>
            </p>

            <p>
              <FaMapMarkerAlt />
              <span>Kalyan Nagar, Cuttack</span>
            </p>

          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>

        {/* Services */}
        <div className="footer-links">
          <h3>Our Services</h3>

          <a href="#">Kundli Analysis</a>
          <a href="#">Marriage Problems</a>
          <a href="#">Love Problems</a>
          <a href="#">Career Guidance</a>
          <a href="#">Vastu Consultation</a>
        </div>

        {/* Map */}
        <div className="footer-map">

          <h3>Our Location</h3>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.3626516595255!2d85.90672789999999!3d20.450293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190d6392dac667%3A0xdc72ded885959b06!2sRS%20Pandit%20Sushil%20Astro%20Office!5e0!3m2!1sen!2sin!4v1782269902630!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title="RS Pandit Sushil Astro Office"
          />

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 VEDIC Jyotish | All Rights Reserved
      </div>

    </footer>
  );
};

export default Footer;