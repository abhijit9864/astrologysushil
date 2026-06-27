import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/consultation.css";
import { Link } from "react-router-dom";

const Consultation = () => {
    const [showConsultation, setShowConsultation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const packagesRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dob: "",
        birthTime: "",
        birthPlace: "",
        consultationType: "",
        package: "",
        slot: "",
        problemType: "",
        description: "",
    });

    const selectPackage = (pkg) => {
        setFormData((prev) => ({ ...prev, package: pkg }));
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleReveal = () => {
        setShowConsultation(true);
    };

    useEffect(() => {
        if (showConsultation && packagesRef.current) {
            setTimeout(() => {
                packagesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
        }
    }, [showConsultation]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const message = `
New Consultation Request

Name: ${formData.name}
Phone: ${formData.phone}
Date of Birth: ${formData.dob}
Birth Time: ${formData.birthTime}
Birth Place: ${formData.birthPlace}
Consultation Type: ${formData.consultationType}
${formData.slot ? `Office Slot: ${formData.slot}` : ""}
Package: ${formData.package}
Problem Type: ${formData.problemType}
Description: ${formData.description}
        `.trim();

        const whatsappUrl = `https://wa.me/917377237360?text=${encodeURIComponent(message)}`;

        setShowSuccess(true);
        setTimeout(() => {
            window.open(whatsappUrl, "_blank");
            setShowSuccess(false);
        }, 1000);
    };

    const steps = [
        { icon: "💬", title: "Start Free Chat", desc: "Begin a free 2-minute chat with our astrologer — no commitment required." },
        { icon: "🔮", title: "Discuss Your Problem", desc: "Share your concern. The astrologer listens and understands your situation." },
        { icon: "📋", title: "Choose a Plan", desc: "After the free chat, pick a consultation plan that fits your needs." },
        { icon: "🌟", title: "Get Guidance", desc: "Receive personalised Vedic astrology guidance on your path forward." },
    ];

    return (
        <>
            <Navbar />

            <section className="cp-page">

                {/* ── SECTION 1: Hero ── */}
                <div className="cp-hero">
                    <span className="cp-badge">✦ Online Astrology Consultation</span>
                    <h1 className="cp-hero-title">Start Your Free Consultation</h1>
                    <p className="cp-hero-sub">
                        Get guidance on Love, Marriage, Career, Business and Life Problems
                        from an experienced Vedic astrologer — free for the first 2 minutes.
                    </p>
                    <Link to="/start-chat" className="cp-hero-cta">
                        Start Free 2-Minute Chat
                    </Link>
                </div>

                {/* ── SECTION 2: Info Cards ── */}
                <div className="cp-info-row">
                    <div className="cp-info-card">
                        <div className="cp-info-icon">🕐</div>
                        <h3 className="cp-info-title">Consultation Hours</h3>
                        <div className="cp-hours-row">
                            <span className="cp-hours-label">Morning</span>
                            <span className="cp-hours-time">8:00 AM – 1:30 PM</span>
                        </div>
                        <div className="cp-hours-row">
                            <span className="cp-hours-label">Evening</span>
                            <span className="cp-hours-time">3:30 PM – 8:00 PM</span>
                        </div>
                    </div>

                    <div className="cp-info-card">
                        <div className="cp-info-icon">📍</div>
                        <h3 className="cp-info-title">Office Visit Available</h3>
                        <p className="cp-info-desc">
                            Book an appointment online and visit our office for a detailed
                            in-person astrology consultation.
                        </p>
                        <span className="cp-info-location-tag">📌 Kalyan Nagar, Cuttack</span>
                    </div>
                </div>

                {/* ── SECTION 3: How It Works ── */}
                <div className="cp-how-section">
                    <p className="cp-section-eyebrow">The Process</p>
                    <h2 className="cp-section-title">How It Works</h2>
                    <div className="cp-steps">
                        {steps.map((step, i) => (
                            <div className="cp-step" key={i}>
                                <div className="cp-step-num">{i + 1}</div>
                                <div className="cp-step-icon">{step.icon}</div>
                                <h4 className="cp-step-title">{step.title}</h4>
                                <p className="cp-step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Divider CTA — triggers packages + form ── */}
                {!showConsultation && (
                    <div className="cp-divider-cta">
                        <p className="cp-divider-text">
                            Already had your free chat? Choose a plan to continue.
                        </p>
                        <button className="cp-divider-btn" onClick={handleReveal}>
                            View Consultation Plans ↓
                        </button>
                    </div>
                )}

                {/* ── SECTION 4: Packages (hidden until showConsultation) ── */}
                {showConsultation && (
                    <div className="cp-packages-section" ref={packagesRef}>
                        <p className="cp-section-eyebrow">Choose Your Plan</p>
                        <h2 className="cp-section-title">Consultation Packages</h2>
                        <p className="cp-section-note">
                            Kundali Analysis (₹501 extra) can be discussed separately with the astrologer if required.
                        </p>

                        <div className="cp-packages">
                            {/* Basic */}
                            <div
                                className={`cp-pkg-card${formData.package === "Basic Consultation - ₹303" ? " cp-pkg-selected" : ""}`}
                                onClick={() => selectPackage("Basic Consultation - ₹303")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && selectPackage("Basic Consultation - ₹303")}
                            >
                                <p className="cp-pkg-tier">Basic</p>
                                <h2 className="cp-pkg-price">₹303</h2>
                                <p className="cp-pkg-name">Basic Consultation</p>
                                <ul className="cp-pkg-features">
                                    <li>✓ One-time Consultation</li>
                                    <li>✓ Website Chat Support</li>
                                    <li>✓ Astrology Guidance</li>
                                    <li>✓ Problem Discussion</li>
                                </ul>
                                <div className={`cp-pkg-select-indicator${formData.package === "Basic Consultation - ₹303" ? " active" : ""}`}>
                                    {formData.package === "Basic Consultation - ₹303" ? "✓ Selected" : "Select Plan"}
                                </div>
                            </div>

                            {/* Premium */}
                            <div
                                className={`cp-pkg-card cp-pkg-featured${formData.package === "Premium Membership - ₹501" ? " cp-pkg-selected" : ""}`}
                                onClick={() => selectPackage("Premium Membership - ₹501")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && selectPackage("Premium Membership - ₹501")}
                            >
                                <span className="cp-pkg-badge">Most Popular</span>
                                <p className="cp-pkg-tier">Premium</p>
                                <h2 className="cp-pkg-price">₹501</h2>
                                <p className="cp-pkg-name">Premium Membership</p>
                                <ul className="cp-pkg-features">
                                    <li>✓ Lifetime Consultation Support</li>
                                    <li>✓ Direct WhatsApp Access</li>
                                    <li>✓ Priority Queue</li>
                                    <li>✓ Existing Client Benefits</li>
                                    <li>✓ Office Visit Support</li>
                                </ul>
                                <div className={`cp-pkg-select-indicator${formData.package === "Premium Membership - ₹501" ? " active" : ""}`}>
                                    {formData.package === "Premium Membership - ₹501" ? "✓ Selected" : "Select Plan"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SECTION 5: Form (hidden until showConsultation) ── */}
                {showConsultation && (
                    <div className="cp-form-wrapper">
                        <div className="cp-form-header">
                            <h2 className="cp-form-heading">Complete Your Booking</h2>
                            <p className="cp-form-sub">
                                Fill in your birth details and we'll connect with you via WhatsApp.
                            </p>
                        </div>

                        <form className="cp-form" onSubmit={handleSubmit}>
                            <div className="cp-field-group">
                                <label className="cp-label">Full Name</label>
                                <input className="cp-input" type="text" name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="cp-field-group">
                                <label className="cp-label">Phone Number</label>
                                <input className="cp-input" type="tel" name="phone"
                                    placeholder="Enter your phone number"
                                    value={formData.phone} onChange={handleChange} required />
                            </div>

                            <div className="cp-field-group">
                                <label className="cp-label">Date of Birth</label>
                                <input className="cp-input" type="date" name="dob"
                                    value={formData.dob} onChange={handleChange} required />
                            </div>

                            <div className="cp-field-group">
                                <label className="cp-label">Birth Time</label>
                                <input className="cp-input" type="time" name="birthTime"
                                    value={formData.birthTime} onChange={handleChange} required />
                            </div>

                            <div className="cp-field-group cp-span2">
                                <label className="cp-label">Birth Place</label>
                                <input className="cp-input" type="text" name="birthPlace"
                                    placeholder="City / Town of birth"
                                    value={formData.birthPlace} onChange={handleChange} required />
                            </div>

                            <div className="cp-field-group">
                                <label className="cp-label">Consultation Type</label>
                                <select className="cp-input" name="consultationType"
                                    value={formData.consultationType} onChange={handleChange} required>
                                    <option value="">Select type</option>
                                    <option value="Chat Consultation">Chat Consultation</option>
                                    <option value="Phone Call">Phone Call</option>
                                    <option value="Office Visit">Office Visit</option>
                                </select>
                            </div>

                            <div className="cp-field-group">
                                <label className="cp-label">Package</label>
                                <select className="cp-input" name="package"
                                    value={formData.package} onChange={handleChange} required>
                                    <option value="">Select package</option>
                                    <option value="Basic Consultation - ₹303">Basic Consultation – ₹303</option>
                                    <option value="Premium Membership - ₹501">Premium Membership – ₹501</option>
                                </select>
                            </div>

                            {formData.consultationType === "Office Visit" && (
                                <div className="cp-field-group cp-span2">
                                    <label className="cp-label">Preferred Time Slot</label>
                                    <select className="cp-input" name="slot"
                                        value={formData.slot} onChange={handleChange}>
                                        <option value="">Select a slot</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="03:30 PM">03:30 PM</option>
                                        <option value="04:30 PM">04:30 PM</option>
                                        <option value="05:30 PM">05:30 PM</option>
                                    </select>
                                </div>
                            )}

                            <div className="cp-field-group cp-span2">
                                <label className="cp-label">Problem Type</label>
                                <select className="cp-input" name="problemType"
                                    value={formData.problemType} onChange={handleChange} required>
                                    <option value="">Select problem type</option>
                                    <option value="Marriage Problem">Marriage Problem</option>
                                    <option value="Love Problem">Love Problem</option>
                                    <option value="Career Guidance">Career Guidance</option>
                                    <option value="Business Problem">Business Problem</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="cp-field-group cp-span2">
                                <label className="cp-label">Describe Your Problem</label>
                                <textarea className="cp-input cp-textarea" rows="5" name="description"
                                    placeholder="Share as much detail as you'd like…"
                                    value={formData.description} onChange={handleChange} required />
                            </div>

                            <div className="cp-span2">
                                <button className="cp-submit-btn" type="submit">
                                    Book Consultation via WhatsApp
                                </button>
                            </div>
                        </form>

                        {showSuccess && (
                            <div className="cp-success-popup">
                                <h3>✅ Request Submitted</h3>
                                <p>Redirecting to WhatsApp…</p>
                            </div>
                        )}
                    </div>
                )}

            </section>

            <Footer />
        </>
    );
};

export default Consultation;