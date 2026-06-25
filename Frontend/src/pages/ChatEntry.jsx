import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chatEntry.css";
import axios from "axios";
const ChatEntry = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await axios.post(
      "http://localhost:5000/api/check-user",
      {
        phone: formData.phone,
      }
    );

    localStorage.setItem(
      "chatUser",
      JSON.stringify(formData)
    );

    if (response.data.exists) {

      if (response.data.freeChatUsed) {
        navigate("/payment");
        return;
      }

      navigate("/chat");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/register-user",
      {
        name: formData.name,
        phone: formData.phone,
      }
    );

    navigate("/chat");

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};



  return (
    <section className="entry-page">

      <div className="entry-card">

        <h1>Start Free Consultation</h1>

        <p>
          Get 2 minutes free astrology consultation.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <button type="submit">
            Start Free Chat
          </button>

        </form>

      </div>

    </section>
  );
};

export default ChatEntry;