import "../styles/gallery.css";

import img1 from "../assets/gallery1.jpeg";
import img2 from "../assets/gallery2.jpeg";
import img3 from "../assets/gallery3.jpeg";
import img4 from "../assets/gallery4.jpeg";

const Gallery = () => {
  const images = [img1, img2, img3, img4];

  return (
    <section className="gallery-section">

      <div className="gallery-header">
        <span className="gallery-badge">
          Photo Gallery
        </span>

        <h2>
          Moments & Consultations
        </h2>

        <p>
          A glimpse of our astrology consultations,
          events and spiritual guidance sessions.
        </p>
      </div>

      <div className="gallery-grid">

        {images.map((image, index) => (
          <div className="gallery-card" key={index}>
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
            />
          </div>
        ))}

      </div>

    </section>
  );
};

export default Gallery;