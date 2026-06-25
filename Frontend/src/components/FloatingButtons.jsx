import "../styles/floatingButtons.css";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaArrowUp,
} from "react-icons/fa";

const FloatingButtons = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* WhatsApp */}
      <a
        href="https://wa.me/917377237360"
        target="_blank"
        rel="noreferrer"
        className="floating-btn whatsapp-btn"
      >
        <FaWhatsapp />
      </a>

      {/* Call */}
      <a
        href="tel:+917377237360"
        className="floating-btn call-btn"
      >
        <FaPhoneAlt />
      </a>

      {/* Scroll Top */}
      <button
        onClick={scrollToTop}
        className="floating-btn top-btn"
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default FloatingButtons;