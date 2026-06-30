import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <Faq />
      <Footer />
      <FloatingButtons />
    </>
  );
};

export default Home;