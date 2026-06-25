import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Gallary from "../components/Gallery";
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
      <WhyChooseUs />
      <Testimonials />
      <Gallary />
      <Contact />
      <Faq />
      <Footer />
      <FloatingButtons />
    </>
  );
};

export default Home;