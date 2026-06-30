import "../styles/contact.css";
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-header">
        <span className="contact-badge">Contact</span>
        <h2>Book your premium consultation</h2>
        <p>Reach out directly by phone, WhatsApp or through the consultation form.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-card">
            <FaPhoneAlt />
            <div>
              <h3>Call Us</h3>
              <p>+91 7377237360</p>
            </div>
          </div>

          <div className="contact-card">
            <FaWhatsapp />
            <div>
              <h3>WhatsApp</h3>
              <p>Direct consultation lead</p>
            </div>
          </div>

          <div className="contact-card">
            <FaMapMarkerAlt />
            <div>
              <h3>Office Address</h3>
              <p>Kalyan Nagar, Cuttack</p>
            </div>
          </div>

          <div className="contact-card">
            <FaClock />
            <div>
              <h3>Consultation Hours</h3>
              <p>8:00 AM – 9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h3>Start your request</h3>
          <p>Fill the details and we will connect with you immediately on WhatsApp.</p>
          <a href="/consultation" className="contact-cta">Open Consultation Form</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;