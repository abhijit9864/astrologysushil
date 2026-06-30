import { useState } from "react";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";
// import "../styles/navbar.css";
import { Link } from "react-router-dom";

import {
    FaPhoneAlt,
    FaWhatsapp,
    FaBars,
    FaTimes,
    FaMapMarkerAlt,
    FaClock,
    FaMoon,
    FaSun,
} from "react-icons/fa";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Gallery", path: "/gallery" },
        { name: "Consultation", path: "/consultation" },
        { name: "Contact", path: "/contact" },
    ];

    const { darkMode, setDarkMode } = useTheme();

    return (
        <>
            {/* Top Bar */} <div className="bg-[#1E3A8A] text-white"> <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2 text-sm font-medium"> <div className="flex items-center gap-2"> <FaPhoneAlt /> <span>+91 7377237360</span> </div>

                <div className="flex items-center gap-2">
                    <FaClock />
                    <span>Mon - Sun : 8:00 AM - 9:00 PM</span>
                </div>

                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>Kalyan Nagar, Cuttack</span>
                </div>
            </div>
            </div>

            {/* Main Navbar */}
            <nav
                className={`sticky top-0 z-50 border-b border-[#2563EB]/25 shadow-lg backdrop-blur-xl transition-all duration-300 ${darkMode
                    ? "bg-[#08111F]/90 text-white"
                    : "bg-[#08111F]/90 text-white"
                    }`}
            >

                <div className="max-w-7xl mx-auto px-4">

                    {/* Upper Section */}
                    <div className="flex justify-between items-center py-2">

                        {/* Logo Section */}
                        <div className="flex items-center gap-4">

                            <img
                                src={logo}
                                alt="Astrology Logo"
                                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                            />

                            <div>
                                <h1 className="text-3xl font-bold text-[#D4AF37] tracking-wide">
                                    VEDIC JYOTISH
                                </h1>

                                <p className="text-[#CBD5E1] text-sm">
                                    Astrologer Pandit Sushil
                                </p>

                                <p className="text-[#D4AF37] text-sm mt-1">
                                    ॥ ज्योतिषं वेदचक्षुः ॥
                                </p>
                            </div>
                        </div>

                        {/* Right Section Desktop */}
                        <div className="hidden lg:flex items-center gap-5">

                            <div className="text-right">
                                <p className="text-[#CBD5E1] text-sm">
                                    For Consultation
                                </p>

                                <h3 className="text-[#D4AF37] text-lg font-semibold">
                                    +91 7377237360
                                </h3>

                                <p className="text-[#CBD5E1] text-xs">
                                    Mon - Sun : 8AM - 9PM
                                </p>
                            </div>
                            {/* <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="w-12 h-12 rounded-full border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition"

                            >

                                {darkMode ? <FaSun /> : <FaMoon />} </button> */}


                            <a
                                href="tel:+917377237360"
                                className="border border-[#D4AF37] text-[#D4AF37] px-5 py-3 rounded-full hover:bg-[#2563EB] hover:text-white transition"
                            >
                                Call Now
                            </a>

                            <Link
                                to="/consultation"
                                className="bg-[#2563EB] text-white px-5 py-3 rounded-full font-semibold border border-[#D4AF37]"
                            >
                                Book Consultation
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-[#D4AF37] text-2xl"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    {/* Menu Bar Desktop */}
                    <div className="hidden lg:flex justify-center border-t border-[#2563EB]/20 hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-300">
                        <ul
                            className={`flex gap-10 py-4 font-medium ${darkMode ? "text-white" : "text-black"
                                }`}
                        >

                            {navLinks.map((item) => (
                                <li
                                    key={item.name}
                                    className="cursor-pointer hover:text-[#D4AF37] transition duration-300"
                                >
                                    <Link to={item.path}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-[#08111F]/95 border-t border-[#2563EB]/20">
                        <ul className={`flex flex-col gap-5 p-5 ${darkMode ? "text-white" : "text-black"}`}>

                            {navLinks.map((item) => (
                                <li
                                    key={item.name}
                                    className="hover:text-[#D4AF37] cursor-pointer"
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}

                            <Link
                                to="/consultation"
                                className="bg-[#2563EB] text-white px-5 py-3 rounded-full font-semibold hover:scale-105 transition border border-[#D4AF37]"
                            >
                                Book Consultation
                            </Link>

                            <a
                                href="tel:+917377237360"
                                className="border border-[#D4AF37] text-[#D4AF37] text-center py-3 rounded-lg"
                            >
                                Call Now
                            </a>

                            <button className="bg-[#2563EB] text-white py-3 rounded-lg font-semibold border border-[#D4AF37]">
                                Book Consultation
                            </button>
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
