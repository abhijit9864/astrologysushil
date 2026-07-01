import { motion } from "framer-motion";
import { FaBriefcase, FaHeart, FaChartLine, FaGraduationCap, FaHeartbeat, FaMoon, FaHome, FaHandsHelping, FaCalculator } from "react-icons/fa";

const services = [
  { icon: FaBriefcase, title: "Career", description: "Guidance for growth, decisions and success." },
  { icon: FaHeart, title: "Marriage", description: "Support for compatibility and relationship clarity." },
  { icon: FaHeart, title: "Love", description: "Relationship insight with empathetic guidance." },
  { icon: FaChartLine, title: "Business", description: "Astrological direction for growth and prosperity." },
  { icon: FaGraduationCap, title: "Education", description: "Support for focus, confidence and academic progress." },
  { icon: FaHeartbeat, title: "Health", description: "Holistic remedies and wellness guidance." },
  { icon: FaMoon, title: "Kundali", description: "Detailed birth chart analysis and remedies." },
  { icon: FaHandsHelping, title: "Manglik Dosh", description: "Specialized consultation for relationship balance." },
  { icon: FaHome, title: "Vastu", description: "Balance and harmony for your home or office." },
  { icon: FaHandsHelping, title: "Palm Reading", description: "Deep insights through hand analysis." },
  { icon: FaCalculator, title: "Numerology", description: "Numbers-based guidance for life choices." },
];

const Services = () => {
  return (
    <section className="bg-[#fffdf8] py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Our Services</p>
          <h2 className="text-3xl font-semibold text-[#2b2b2b] sm:text-4xl">Premium astrology services for every life area</h2>
          <p className="mt-4 text-lg text-[#6b7280]">Choose the guidance you need and connect with our team directly through WhatsApp.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                key={index}
                className="group rounded-[24px] border border-[#efe6d7] bg-white p-7 shadow-[0_16px_40px_rgba(107,52,24,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(107,52,24,0.12)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8f0] text-[#6b3418] transition group-hover:bg-[#6b3418] group-hover:text-[#c9a227]">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#2b2b2b]">{service.title}</h3>
                <p className="mt-3 text-[#6b7280]">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;