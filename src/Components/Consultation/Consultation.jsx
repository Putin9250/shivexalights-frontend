import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Consultation.scss";

const Consultation = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lux-section" ref={ref}>
      <div className={`lux-container ${visible ? "show" : ""}`}>

        {/* LEFT IMAGE */}
        <div className="lux-image">
          <div className="img-wrap">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
              alt="consultation"
              loading="lazy"
            />
            <div className="veil" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lux-content">
          <span className="tag">Bespoke Lighting Studio</span>

          <h2>
            Tailored <span>Illumination</span>
          </h2>

          <p>
            A quiet design consultation experience where light, space and emotion
            are shaped into one seamless atmosphere.
          </p>

          <ul>
            <li>Personal design guidance</li>
            <li>Spatial lighting simulation</li>
            <li>Custom luxury fittings</li>
          </ul>

          <Link to="/contact" className="btn">
            Book Consultation →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Consultation;