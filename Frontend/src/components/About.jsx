import aboutImage from "../assets/about-astrologer.jpeg";

const About = () => {
  return (
    <section className="bg-[#f8f5ef] py-20 sm:py-24">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[28px] border border-[#efe6d7] bg-white p-3 shadow-[0_20px_60px_rgba(107,52,24,0.08)]">
          <img src={aboutImage} alt="Pandit Sushil Kumar" className="h-full w-full rounded-[22px] object-cover" />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a227]">About Pandit Ji</p>
          <h2 className="text-3xl font-semibold text-[#2b2b2b] sm:text-4xl">Pandit Sushil Mohapatra</h2>
          <p className="mt-5 text-lg leading-8 text-[#6b7280]">With more than two decades of experience in Vedic astrology, kundali analysis, vastu and spiritual guidance, Pandit Sushil Kumar offers thoughtful, practical and premium consultations that help people move forward with clarity.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: "20+", label: "Years Experience" },
              { value: "5000+", label: "Happy Clients" },
              { value: "100%", label: "Confidential Guidance" },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-[#efe6d7] bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold text-[#2b2b2b]">{item.value}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{item.label}</p>
              </div>
            ))}
          </div>

          <a href="/consultation" className="mt-8 inline-flex rounded-full bg-[#6b3418] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d2310]">Book Consultation</a>
        </div>
      </div>
    </section>
  );
};

export default About;