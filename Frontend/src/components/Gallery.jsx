import img1 from "../assets/gallery1.jpeg";
import img2 from "../assets/gallery2.jpeg";
import img3 from "../assets/gallery3.jpeg";
import img4 from "../assets/gallery4.jpeg";

const Gallery = () => {
  const images = [img1, img2, img3, img4];

  return (
    <section className="bg-[#F6F8FC] py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Photo Gallery</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Moments & Consultations</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">A glimpse of our astrology consultations, events and spiritual guidance sessions.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {images.map((image, index) => (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)]" key={index}>
              <img src={image} alt={`Gallery ${index + 1}`} className="h-72 w-full rounded-[18px] object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;