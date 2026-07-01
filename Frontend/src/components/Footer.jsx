import { FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#efe6d7] bg-[#fffdfa] text-[#2b2b2b]">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[0.2em] text-[#6b3418]">VEDIC JYOTISH</h2>
          <p className="mt-4 text-sm leading-7 text-[#6b7280]">Trusted astrology consultation for career, marriage, love, business and life problems.</p>
          <div className="mt-6 space-y-3 text-sm text-[#6b7280]">
            <p className="flex items-center gap-2"><FaPhoneAlt className="text-[#c9a227]" /> +91 7377237360</p>
            <p className="flex items-center gap-2"><FaWhatsapp className="text-[#c9a227]" /> WhatsApp Support</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#c9a227]" /> Kalyan Nagar, Cuttack</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#2b2b2b]">Quick Links</h3>
          <div className="mt-4 space-y-2 text-sm text-[#6b7280]">
            <Link to="/" className="block transition hover:text-[#6b3418]">Home</Link>
            <Link to="/services" className="block transition hover:text-[#6b3418]">Services</Link>
            <Link to="/gallery" className="block transition hover:text-[#6b3418]">Gallery</Link>
            <Link to="/consultation" className="block transition hover:text-[#6b3418]">Consultation</Link>
            <Link to="/contact" className="block transition hover:text-[#6b3418]">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#2b2b2b]">Our Services</h3>
          <div className="mt-4 space-y-2 text-sm text-[#6b7280]">
            <p>Kundli Analysis</p>
            <p>Marriage Guidance</p>
            <p>Love Solutions</p>
            <p>Career Guidance</p>
            <p>Vastu Consultation</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#2b2b2b]">Our Location</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#efe6d7]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.3626516595255!2d85.90672789999999!3d20.450293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190d6392dac667%3A0xdc72ded885959b06!2sRS%20Pandit%20Sushil%20Astro%20Office!5e0!3m2!1sen!2sin!4v1782269902630!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              title="RS Pandit Sushil Astro Office"
              className="h-44 w-full"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#efe6d7] py-4 text-center text-sm text-[#6b7280]">
        © 2026 VEDIC Jyotish | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;