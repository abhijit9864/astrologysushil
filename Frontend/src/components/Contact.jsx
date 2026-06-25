import "../styles/contact.css";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

const Contact = () => {
  return (
    <section className="contact-section">

      <div className="contact-header">
        <span className="contact-badge">
          Contact Us
        </span>

        <h2>
          Book Your Consultation
        </h2>

        <p>
          Get expert astrology guidance for your life,
          career, marriage and future.
        </p>
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
              <p>Available 24/7</p>
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
              <p>8:00 AM - 9:00 PM</p>
            </div>
          </div>

        </div>

        <div className="contact-form-wrapper">

          <h3>Schedule Appointment</h3>

          <p>
            Fill in your details and our team will
            contact you shortly.
          </p>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Your Full Name"
            />

            <input
              type="tel"
              placeholder="Phone Number"
            />

            <textarea
              rows="6"
              placeholder="Describe Your Problem"
            />

            <button type="submit">
              Book Appointment
            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default Contact;