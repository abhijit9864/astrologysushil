import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-[#fffdf8] py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Contact</p>
          <h2 className="text-3xl font-semibold text-[#2b2b2b] sm:text-4xl">Book your premium consultation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6b7280]">Reach out directly by phone, WhatsApp or through the consultation form.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-[24px] border border-[#efe6d7] bg-white p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
            {[
              { icon: FaPhoneAlt, title: "Call Us", value: "+91 7377237360" },
              { icon: FaWhatsapp, title: "WhatsApp", value: "Direct consultation lead" },
              { icon: FaMapMarkerAlt, title: "Office Address", value: "Kalyan Nagar, Cuttack" },
              { icon: FaClock, title: "Consultation Hours", value: "8:00 AM – 9:00 PM" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 rounded-[18px] border border-[#efe6d7] bg-[#fcf5ea] p-4">
                  <div className="rounded-full bg-[#fff8f0] p-3 text-[#6b3418]">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2b2b2b]">{item.title}</h3>
                    <p className="mt-1 text-[#6b7280]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[24px] border border-[#efe6d7] bg-white p-8 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
            <h3 className="text-2xl font-semibold text-[#2b2b2b]">Start your request</h3>
            <p className="mt-3 text-[#6b7280]">Fill the details and we will connect with you immediately on WhatsApp.</p>
            <a href="/consultation" className="mt-8 inline-flex rounded-full bg-[#6b3418] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d2310]">Open Consultation Form</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;