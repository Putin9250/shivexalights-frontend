import React, { useState, useEffect, useCallback } from "react";
import Hero1 from "../../../Images/what.jpg";
import Hero2 from "../../../Images/what2.jpeg";
import Hero3 from "../../../Images/what3.jpg";
import "./Slider.scss";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const data = [
    {
      id: 1,
      image: Hero1,
      title: "Art of Illumination",
      subtitle: "Discover chandeliers that sculpt space and light.",
      ctaText: "Explore Collection",
      link: "/products/collection"
    },
    {
      id: 2,
      image: Hero2,
      title: "Elegance in Every Glow",
      subtitle: "Handcrafted Italian designs for timeless interiors.",
      ctaText: "Shop Chandeliers",
      link: "/products/21"
    },
    {
      id: 3,
      image: Hero3,
      title: "Sculpting Ambiance",
      subtitle: "Where lighting becomes art.",
      ctaText: "View Gallery",
      link: "/products/21"
    }
  ];

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  }, [data.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  }, [data.length]);

  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  // Touch swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <div
      className="slider"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Image carousel"
    >
      <div
        className="container"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {data.map((slide, index) => (
          <div
            key={slide.id}
            className="slide"
            role="group"
            aria-label={`Slide ${index + 1} of ${data.length}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="slide-image"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="slide-overlay" />

            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button
                className="slide-cta"
                onClick={() => (window.location.href = slide.link)}
                aria-label={`Shop ${slide.title}`}
              >
                {slide.ctaText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar indicator */}
      <div className="progress-indicator">
        {data.map((_, index) => (
          <button
            key={index}
            className={`progress-item ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="progress-bar" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;