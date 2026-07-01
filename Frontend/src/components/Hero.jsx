import astrologer from "../assets/astrologer.png";
import zodiacWheel from "../assets/zodiac-wheel.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaShieldAlt, FaCompass, FaHeart } from "react-icons/fa";

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#fff8f0_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 lotus-pattern opacity-60" />
      <div className="hero-glow absolute inset-0" />
      <div className="section-shell relative overflow-hidden">
        <div className="lg:hidden">
          <div className="relative mx-auto mb-10 mt-4 w-full max-w-[420px] px-4 pb-8 pt-8">
            <div className="absolute left-1/2 top-0 z-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.24),transparent_65%)] blur-3xl" />
            <img src={zodiacWheel} alt="" className="absolute left-1/2 top-8 z-10 h-[120px] w-[120px] -translate-x-1/2 object-contain opacity-25" />
            <img src={astrologer} alt="Astrologer Sushil Kumar" className="relative z-20 mx-auto w-full max-w-[340px] object-contain opacity-100" />
          </div>
        </div>

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative z-20 order-2 lg:order-1 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#efe6d7] bg-white/90 px-4 py-2 text-sm font-semibold text-[#6b3418] shadow-sm">
              <FaStar className="text-[#c9a227]" /> Trusted Astrology Guidance
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-[#2b2b2b] sm:text-5xl lg:text-6xl">
              Astrologer <span className="text-gradient">Pandit Sushil</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#6b7280] sm:text-xl">
              Career, marriage, love, business, health, kundali, vastu and horoscope guidance with a calm, premium consultation experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/consultation" className="rounded-full bg-[#6b3418] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_14px_35px_rgba(107,52,24,0.18)] transition hover:bg-[#4d2310]">
                Book Consultation
              </Link>
              <a href="https://wa.me/917377237360" target="_blank" rel="noreferrer" className="rounded-full border border-[#6b3418] bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#6b3418] transition hover:bg-[#6b3418] hover:text-white">
                Talk on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { value: "5000+", label: "Happy Clients" },
                { value: "20+", label: "Years Experience" },
                { value: "24x7", label: "Responsive Support" },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-[#efe6d7] bg-white/85 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-[#2b2b2b]">{item.value}</p>
                  <p className="mt-1 text-sm text-[#6b7280]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="hidden relative order-1 lg:order-2 lg:flex justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#c9a227]/20 via-white to-[#8b5e3c]/10 blur-3xl" />
            <div className="relative w-full max-w-[520px] overflow-visible rounded-[2rem] p-4 lg:p-0">
              <div className="absolute left-1/2 top-1/2 z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-[40%] rounded-full opacity-55">
                <img src={zodiacWheel} alt="" className="h-full w-full object-contain opacity-55" />
              </div>
              <div className="absolute left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.3),transparent_65%)] blur-3xl" />
              <img src={astrologer} alt="Astrologer Sushil Kumar" className="relative z-20 mx-auto w-full max-w-[480px] object-contain drop-shadow-[0_0_40px_rgba(201,162,39,0.25)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
