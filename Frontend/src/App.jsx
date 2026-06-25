import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Consultation from "./pages/Consultation";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import ChatEntry from "./pages/ChatEntry";
import ChatPage from "./pages/ChatPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/start-chat" element={<ChatEntry />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;