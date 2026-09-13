import React, { useRef } from "react";
import useFetch from "../../Hooks/useFetch";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Testimonials.scss";

const Testimonials = () => {
  const { data: testimonials = [], loading } = useFetch("/testimonials");
  const sliderRef = useRef(null);
  const displayList = Array.isArray(testimonials)
    ? testimonials.filter((item) => item.isFeatured !== false)
    : [];

  const scrollSlider = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -sliderRef.current.clientWidth : sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Client Feedback</span>
          <h2>Loved by Designers & Homeowners</h2>
          <p>Read what our clients say about their ShivExa Lights experience.</p>
        </div>

        {displayList.length > 0 && (
          <div className="testimonial-controls" aria-label="Testimonial controls">
            <button type="button" aria-label="Previous testimonials" onClick={() => scrollSlider("left")}><KeyboardArrowLeftIcon /></button>
            <button type="button" aria-label="Next testimonials" onClick={() => scrollSlider("right")}><KeyboardArrowRightIcon /></button>
          </div>
        )}

        {loading ? <p className="testimonials-status">Loading client feedback…</p> : displayList.length === 0 ? (
          <p className="testimonials-status">Client feedback will appear here soon.</p>
        ) : (
        <div className="testimonials-grid" ref={sliderRef}>
          {displayList.map((item) => (
            <div key={item._id} className="testimonial-card">
              <div className="stars">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <StarIcon key={i} className="star-icon" />
                ))}
              </div>
              <p className="comment">"{item.comment}"</p>
              <div className="user-profile">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="avatar" />
                ) : (
                  <div className="avatar-placeholder">{item.name?.charAt(0)}</div>
                )}
                <div className="details">
                  <h4>{item.name}</h4>
                  <span>{item.role || "Verified Buyer"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
