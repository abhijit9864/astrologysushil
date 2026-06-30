import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/consultation.css";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../config/api";

const Consultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    service: "",
    problem: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/consultation-request`, {
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        service: formData.service,
        problem: formData.problem,
      });

      if (response.data?.success) {
        const message = `🙏 Namaskar Pandit Ji\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDOB: ${formData.dob}\nBirth Time: ${formData.birthTime}\nBirth Place: ${formData.birthPlace}\nService: ${formData.service}\nProblem: ${formData.problem}\n\nI would like to book a consultation.`;
        const whatsappUrl = `https://wa.me/917377237360?text=${encodeURIComponent(message)}`;

        Swal.fire({
          title: "Thank you!",
          text: "Your consultation request has been received. We are redirecting you to WhatsApp.",
          icon: "success",
          confirmButtonColor: "#D4AF37",
        }).then(() => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          window.location.href = whatsappUrl;
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: error?.response?.data?.message || "Unable to process your request right now.",
        icon: "error",
        confirmButtonColor: "#D4AF37",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="cp-page">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[rgba(37,99,235,0.25)] bg-[rgba(16,33,58,0.9)] p-6 shadow-[0_20px_60px_rgba(3,12,28,0.4)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Consultation Form</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Book a premium astrology consultation</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#BBBBBB]">Share your details and we will connect with you on WhatsApp for a calm, personal consultation.</p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#D4AF37]">Name</label>
              <input className="cp-input" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#D4AF37]">Phone</label>
              <input className="cp-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#D4AF37]">Date of Birth</label>
              <input className="cp-input" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#D4AF37]">Time of Birth</label>
              <input className="cp-input" type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[#D4AF37]">Place of Birth</label>
              <input className="cp-input" name="birthPlace" value={formData.birthPlace} onChange={handleChange} placeholder="City or town of birth" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#D4AF37]">Select Service</label>
              <select className="cp-input" name="service" value={formData.service} onChange={handleChange} required>
                <option value="">Select a service</option>
                <option value="Career">Career</option>
                <option value="Marriage">Marriage</option>
                <option value="Love">Love</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Kundali">Kundali</option>
                <option value="Manglik Dosh">Manglik Dosh</option>
                <option value="Vastu">Vastu</option>
                <option value="Palm Reading">Palm Reading</option>
                <option value="Numerology">Numerology</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[#D4AF37]">Problem</label>
              <textarea className="cp-input min-h-[140px]" name="problem" value={formData.problem} onChange={handleChange} placeholder="Describe your concern and what guidance you need" required />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={submitting} className="w-full rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? "Submitting..." : "Submit Consultation Request"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Consultation;