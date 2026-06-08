import React, { useState, useEffect, useRef, useCallback } from "react";
import "./EditorialCarousel.scss";

const slides = [
  {
    id: 1,
    image: "https://thumbs.dreamstime.com/b/masterful-origami-robot-soft-lowlight-illumination-exquisite-papercraft-details-unveiled-intricate-crafted-383828594.jpg?w=992",
    title: "Crafted Illumination",
    subtitle: "Sculptural Brilliance",
    description: "Hand‑blown Murano crystals suspended in a modern orbital arrangement. Each piece captures light like morning dew.",
    cta: "Explore the collection",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop",
    title: "Light That Defines Spaces",
    subtitle: "Architectural Elegance",
    description: "Minimalist pendants floating above natural stone surfaces. Where form meets function in perfect equilibrium.",
    cta: "Discover pendants",
  },
  {
    id: 3,
    image: "https://i.pinimg.com/originals/91/35/06/913506f488365eb1ba71323b0bf9183b.jpg",
    title: "Heritage in Every Glow",
    subtitle: "Timeless Craftsmanship",
    description: "Warm ambient luminaires that transform living spaces into intimate sanctuaries of light.",
    cta: "View living collection",
  },
  {
    id: 4,
    image: "https://images.surferseo.art/c560e37c-9b77-4d18-8e44-e2dd5805d508.png",
    title: "Architectural Light Stories",
    subtitle: "Sculptural Installations",
    description: "Custom wall sconces and linear fixtures that dance across staircases and corridors.",
    cta: "Commission a design",
  },
];

const EditorialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const autoRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  const startAutoSlide = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(autoRef.current);
  }, [startAutoSlide]);

  const pauseAuto = () => clearInterval(autoRef.current);
  const resumeAuto = () => startAutoSlide();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    startAutoSlide();
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startAutoSlide();
  };
  const goToSlide = (index) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPrev();
      else goToNext();
    }
    setTouchStart(null);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="editorial-carousel"
      ref={sectionRef}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      
    >
      <div className="carousel-inner">
        {/* Image side (larger visual weight) */}
        <div className="carousel-image">
          <div className="image-frame">
            <img src={currentSlide.image} alt={currentSlide.title} loading="lazy" />
            <div className="image-overlay"></div>
          </div>
        </div>

        {/* Text side (compact, closer to image) */}
        <div className={`carousel-text ${isVisible ? "animate" : ""}`}>
          <div className="text-content">
            <span className="editorial-label">SHIVEXA EDITORIAL</span>
            <h2 className="editorial-title">{currentSlide.title}</h2>
            <div className="editorial-subtitle">{currentSlide.subtitle}</div>
            <p className="editorial-description">{currentSlide.description}</p>
            <button className="editorial-cta">{currentSlide.cta} →</button>
          </div>
        </div>
      </div>

      {/* Navigation – below image, never overlap */}
      <div className="carousel-nav">
        <button className="nav-arrow prev" onClick={goToPrev} aria-label="Previous">
          ←
        </button>
        <div className="nav-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button className="nav-arrow next" onClick={goToNext} aria-label="Next">
          →
        </button>
      </div>
    </section>
  );
};

export default EditorialCarousel;