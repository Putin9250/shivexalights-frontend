import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer";
import { toggleWishlist } from "../../redux/wishlistReducer";
import useFetch from "../../Hooks/useFetch";
import Cards from "../Cards/Cards";
import "./FeaturedProducts.scss";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useFetch("/products?featured=true&limit=8");
  const allProducts = data?.filter((item) => item.isFeatured) || [];

  const cartItems = useSelector((state) => state.cart.products);
  const wishlistItems = useSelector((state) => state.wishlist.products);

  const [visibleCount, setVisibleCount] = useState(6);
  const [showLoadMore, setShowLoadMore] = useState(allProducts.length > 6);

  useEffect(() => {
    setShowLoadMore(visibleCount < allProducts.length);
  }, [visibleCount, allProducts.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, allProducts.length));
  };

  // Slider refs
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [allProducts]);

  const scrollSlider = (direction) => {
    const el = sliderRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.9;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const visibleProducts = allProducts.slice(0, visibleCount);

  // Toggle cart (add if not present, remove if present)
  const handleToggleCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    const inCart = cartItems.some((i) => i._id === item._id);
    if (inCart) {
      dispatch(removeItem(item._id));
    } else {
      dispatch(
        addToCart({
          _id: item._id,
          title: item.title,
          price: item.price,
          img: item.img,
          quantity: 1,
        })
      );
    }
  };

  // Toggle wishlist (add if not present, remove if present)
  const handleToggleWishlist = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(item));
  };

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="loading-hero" />
        <div className="loading-slider">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="featured-error">Unable to load collection.</div>;
  if (allProducts.length === 0) return null;

  return (
    <section className="featured-editorial">
      <div className="featured-container">
        {/* LEFT HERO (static) */}
        <div className="featured-hero">
          <div className="hero-inner">
            <span className="hero-label">Curated Selection</span>
            <h2 className="hero-title">
              Featured <span>Illuminations</span>
            </h2>
            <p className="hero-description">
              An exclusive edit of sculptural lighting – where heritage meets
              contemporary minimalism.
            </p>
            <Link to="/products/featured" className="hero-cta">
              View entire collection <ArrowForwardIosIcon />
            </Link>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="featured-slider">
          <div className="slider-header">
            <span className="slider-eyebrow">— Editor’s Pick</span>
            <span className="slider-count">
              {visibleProducts.length} / {allProducts.length} pieces
            </span>
          </div>

          <div className="slider-track" ref={sliderRef}>
            {visibleProducts.map((item) => {
              const inCart = cartItems.some((i) => i._id === item._id);
              const inWishlist = wishlistItems.some((i) => i._id === item._id);
              return (
                <div key={item._id} className="product-slide">
                  <Cards item={item} />
                  <div className="product-buttons">
                    <button
                      className={`btn-cart ${inCart ? "active" : ""}`}
                      onClick={(e) => handleToggleCart(item, e)}
                    >
                      {inCart ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />}
                      <span>{inCart ? "Added" : "Add"}</span>
                    </button>
                    <button
                      className={`btn-wishlist ${inWishlist ? "active" : ""}`}
                      onClick={(e) => handleToggleWishlist(item, e)}
                    >
                      {inWishlist ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                      <span>{inWishlist ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows at bottom right */}
          <div className="slider-controls">
            <button
              className="arrow left"
              onClick={() => scrollSlider("left")}
              disabled={!canScrollLeft}
              aria-label="Previous"
            >
              <KeyboardArrowLeftIcon />
            </button>
            <button
              className="arrow right"
              onClick={() => scrollSlider("right")}
              disabled={!canScrollRight}
              aria-label="Next"
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>

          {showLoadMore && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Discover more +
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;