import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Gallery", path: "/gallery" },
        { name: "Consultation", path: "/consultation" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-[#efe6d7] bg-[#fffdfa]/90 backdrop-blur-xl">
            <div className="section-shell">
                <div className="flex items-center justify-between py-4 lg:py-5">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="Astrology Logo" className="h-16 w-16 rounded-full border border-[#efe6d7] object-contain bg-white p-1 shadow-sm" />
                        <div>
                            <h1 className="text-xl font-semibold tracking-[0.25em] text-[#6b3418]">VEDIC JYOTISH</h1>
                            <p className="text-sm text-[#8b5e3c]">Astrologer Pandit Sushil</p>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <Link key={item.name} to={item.path} className="text-sm font-medium text-[#6b7280] transition duration-300 hover:text-[#6b3418] relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#c9a227] after:transition-all after:duration-300 hover:after:w-full">
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-3">
                        <a href="tel:+917377237360" className="flex items-center gap-2 rounded-full border border-[#6b3418] px-4 py-2.5 text-sm font-semibold text-[#6b3418] transition hover:bg-[#6b3418] hover:text-white">
                            <FaPhoneAlt className="text-[#c9a227]" /> Call
                        </a>
                        <Link to="/consultation" className="rounded-full bg-[#6b3418] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(107,52,24,0.16)] transition hover:bg-[#4d2310]">
                            Book Consultation
                        </Link>
                    </div>

                    <button className="rounded-full border border-[#efe6d7] bg-white p-3 text-[#6b3418] lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-[#efe6d7] bg-[#fffdfa]/95 px-4 py-5 lg:hidden">
                    <div className="section-shell flex flex-col gap-4">
                        {navLinks.map((item) => (
                            <Link key={item.name} to={item.path} className="text-base font-medium text-[#2b2b2b]" onClick={() => setIsOpen(false)}>
                                {item.name}
                            </Link>
                        ))}
                        <a href="tel:+917377237360" className="flex items-center justify-center gap-2 rounded-full border border-[#6b3418] px-4 py-3 text-sm font-semibold text-[#6b3418]">
                            <FaPhoneAlt /> Call Now
                        </a>
                        <Link to="/consultation" className="rounded-full bg-[#6b3418] px-4 py-3 text-center text-sm font-semibold text-white" onClick={() => setIsOpen(false)}>
                            Book Consultation
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
