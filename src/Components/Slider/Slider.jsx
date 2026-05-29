import React, { useState, useEffect, useCallback } from "react";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Hero1 from "../../../AssetsPhotos/Hero1.jpeg";
import Hero2 from "../../../AssetsPhotos/Hero2.jpeg";
import Hero3 from "../../../AssetsPhotos/Hero3.jpeg";
import "./Slider.scss";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const data = [
    {
      id: 1,
      image: Hero1,
      title: "Summer Collection",
      subtitle: "Up to 50% Off on Latest Trends",
      ctaText: "Shop Now",
      link: "/products/21"
    },
    {
      id: 2,
      image: Hero2,
      title: "New Arrivals",
      subtitle:"Fresh Styles for Every Occasion",
      ctaText: "Explore",
      link: "/products/21"
    },
    {
      id: 3,
      image: Hero3,
      title: "Premium Quality",
      subtitle: "Crafted with Excellence & Care",
      ctaText: "Discover",
      link: "/products/21"
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  }, [data.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  }, [data.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  // Touch swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          <div key={slide.id} className="slide" role="group" aria-label={`Slide ${index + 1} of ${data.length}`}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="slide-content">
              <div className="content-wrapper">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button 
                  className="slide-cta" 
                  onClick={() => window.location.href = slide.link}
                  aria-label={`Shop ${slide.title}`}
                >
                  {slide.ctaText}
                  <EastOutlinedIcon className="cta-icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Navigation Buttons */}
      <div className={`navigation-buttons ${isMobile ? 'hidden' : ''}`}>
        <button 
          className="nav-btn prev-btn" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <WestOutlinedIcon />
        </button>
        <button 
          className="nav-btn next-btn" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <EastOutlinedIcon />
        </button>
      </div>

      {/* Mobile Navigation Buttons (Visible only on mobile) */}
      <div className={`mobile-nav-buttons ${!isMobile ? 'hidden' : ''}`}>
        <button 
          className="mobile-nav-btn prev-mobile" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <WestOutlinedIcon />
        </button>
        <button 
          className="mobile-nav-btn next-mobile" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <EastOutlinedIcon />
        </button>
      </div>

      <div className="slide-indicators">
        {data.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index}
          >
            {currentSlide === index ? <CircleIcon /> : <CircleOutlinedIcon />}
          </button>
        ))}
      </div>

      <div className="controls-container">
        <div className="slide-counter">
          <span className="current">{currentSlide + 1}</span>
          <span className="separator">/</span>
          <span className="total">{data.length}</span>
        </div>

        <div className="play-pause-control">
          <button 
            className="play-pause-btn"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? "Pause auto slide" : "Play auto slide"}
          >
            {isAutoPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;