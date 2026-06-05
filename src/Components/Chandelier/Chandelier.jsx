import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import "./Chandelier.scss";

const GAP = 20;
const MAX_ITEMS = 8; // Only load 12 chandeliers at a time

const Chandelier = () => {
  const { data = [] } = useFetch("/products?category=chandelier&limit=12");
  const [chandeliers, setChandeliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const touchStartX = useRef(null);

  // Filter chandeliers (server already filters if API supports it)
  useEffect(() => {
    if (!data) return;
    const filtered = data.filter((item) =>
      (item.categories || [])
        .map((c) => c.toLowerCase().trim())
        .includes("chandelier")
    );
    setChandeliers(filtered.slice(0, MAX_ITEMS));
  }, [data]);

  // Responsive card count
  const updateVisibleCards = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1100) setVisibleCards(4);
    else if (w >= 768) setVisibleCards(3);
    else if (w >= 480) setVisibleCards(2);
    else setVisibleCards(1);
  }, []);

  useEffect(() => {
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [updateVisibleCards]);

  const totalPages = Math.max(1, Math.ceil(chandeliers.length / visibleCards));
  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(totalPages - 1);
  }, [totalPages, currentPage]);

  const nextPage = useCallback(
    () => setCurrentPage((p) => (p + 1) % totalPages),
    [totalPages]
  );
  const prevPage = useCallback(
    () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages),
    [totalPages]
  );

  useEffect(() => {
    if (!isAutoPlaying || chandeliers.length === 0) return;
    const id = setInterval(nextPage, 5000);
    return () => clearInterval(id);
  }, [isAutoPlaying, nextPage, chandeliers.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextPage();
    else if (diff < -50) prevPage();
    touchStartX.current = null;
  };

  if (!chandeliers.length) return null;

  const containerWidth = carouselRef.current?.offsetWidth ?? 1260;
  const cardWidth = (containerWidth - GAP * (visibleCards - 1)) / visibleCards;
  const slideOffset = currentPage * visibleCards * (cardWidth + GAP);

  const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : n);

  return (
    <section className="ch-section">
      <div className="ch-gold-rule" aria-hidden />
      <div className="ch-inner">
        <header className="ch-header">
          <div className="ch-eyebrow">
            <span className="ch-eyebrow__line" />
            <span className="ch-eyebrow__text">Exclusive Collection</span>
            <span className="ch-eyebrow__line ch-eyebrow__line--flip" />
          </div>
          <h2 className="ch-heading">Italian Chandeliers</h2>
          <p className="ch-sub">Where glass meets emotion, and light becomes sculpture</p>
        </header>

        <div
          className="ch-carousel"
          ref={carouselRef}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="ch-track-wrap">
            <div
              className="ch-track"
              style={{ transform: `translateX(-${slideOffset}px)` }}
            >
              {chandeliers.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="ch-card"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="ch-card__img-wrap">
                    <img src={item.img} alt={item.title} loading="lazy" />
                    <div className="ch-card__overlay">
                      <span className="ch-card__cta">View Piece</span>
                    </div>
                  </div>
                  <div className="ch-card__body">
                    <span className="ch-card__tag">Chandelier</span>
                    <h3 className="ch-card__name">{item.title}</h3>
                    <div className="ch-card__price-row">
                      <span className="ch-card__price">₹ {fmt(item.price)}</span>
                      {item.oldPrice && (
                        <del className="ch-card__old">₹ {fmt(item.oldPrice)}</del>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button className="ch-arrow ch-arrow--prev" onClick={prevPage} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="ch-arrow ch-arrow--next" onClick={nextPage} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {totalPages > 1 && (
          <nav className="ch-dots" aria-label="Carousel pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`ch-dot${i === currentPage ? " active" : ""}`}
                onClick={() => setCurrentPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </nav>
        )}

        {/* View All link */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            to="/products?category=chandelier"
            style={{
              color: "#c9a96e",
              textDecoration: "none",
              fontFamily: "Josefin Sans, sans-serif",
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            View All Chandeliers →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Chandelier;