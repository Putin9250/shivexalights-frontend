import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer";
import { toggleWishlist } from "../../redux/wishlistReducer";
import useFetch from "../../Hooks/useFetch";
import Cards from "../Cards/Cards";
import "./TrendingProducts.scss";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const TrendingProducts = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useFetch("/products?trending=true&limit=12");
  const trendingProducts = data?.filter((item) => item.isTrending) || [];

  const cartItems = useSelector((state) => state.cart.products);
  const wishlistItems = useSelector((state) => state.wishlist.products);

  const [visibleCount, setVisibleCount] = useState(8);
  const [showLoadMore, setShowLoadMore] = useState(trendingProducts.length > 8);

  useEffect(() => {
    setShowLoadMore(visibleCount < trendingProducts.length);
  }, [visibleCount, trendingProducts.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, trendingProducts.length));
  };

  // Mobile slider (pure swipe)
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
  }, [trendingProducts]);

  const visibleProducts = trendingProducts.slice(0, visibleCount);

  // Toggle cart (add/remove)
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
        }),
      );
    }
  };

  const handleToggleWishlist = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(item));
  };

  if (loading) {
    return (
      <div className="trending-loading">
        <div className="loading-header">
          <div className="skeleton-badge" />
          <div className="skeleton-title" />
          <div className="skeleton-subtitle" />
        </div>
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="trending-error">Unable to load trending products.</div>
    );
  if (trendingProducts.length === 0) return null;

  return (
    <section className="trending-luxury">
      <div className="luxury-container">
        <div className="trending-header">
          <div className="badge-wrapper">
            <span className="trending-badge">🔥 Hottest Picks</span>
            <span className="product-count">
              {trendingProducts.length} Items
            </span>
          </div>
          <h2 className="trending-title">
            Trending <span className="highlight">Now</span>
          </h2>
          <p className="trending-subtitle">
            Discover what everyone is loving — curated from real demand and
            customer favorites across our collections.
          </p>
          <div className="header-actions">
            <Link to="/products/trending" className="view-all-link">
              Explore All Trending
              <ArrowForwardIosIcon className="arrow-icon" />
            </Link>
          </div>
        </div>

        {/* Desktop Grid (no arrows) */}
        <div className="desktop-grid">
          {visibleProducts.map((item) => {
            const inCart = cartItems.some((i) => i._id === item._id);
            const inWishlist = wishlistItems.some((i) => i._id === item._id);
            return (
              <div key={item._id} className="product-card">
                <Cards item={item} />
                <div className="product-buttons">
                  <button
                    className={`btn-cart ${inCart ? "active" : ""}`}
                    onClick={(e) => handleToggleCart(item, e)}
                  >
                    {inCart ? (
                      <ShoppingCartIcon />
                    ) : (
                      <ShoppingCartOutlinedIcon />
                    )}
                    <span>{inCart ? "Added" : "Add to Cart"}</span>
                  </button>
                  <button
                    className={`btn-wishlist ${inWishlist ? "active" : ""}`}
                    onClick={(e) => handleToggleWishlist(item, e)}
                  >
                    {inWishlist ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                    <span>{inWishlist ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pure Swipe Slider (no arrows) */}
        <div className="mobile-slider-container">
          <div className="slider-track" ref={sliderRef}>
            {visibleProducts.map((item) => {
              const inCart = cartItems.some((i) => i._id === item._id);
              const inWishlist = wishlistItems.some((i) => i._id === item._id);
              return (
                <div key={item._id} className="slide-item">
                  <Cards item={item} />
                  <div className="mobile-buttons">
                    <button
                      className={`mobile-btn-cart ${inCart ? "active" : ""}`}
                      onClick={(e) => handleToggleCart(item, e)}
                    >
                      {inCart ? (
                        <ShoppingCartIcon />
                      ) : (
                        <ShoppingCartOutlinedIcon />
                      )}
                      <span>{inCart ? "Added" : "Add"}</span>
                    </button>
                    <button
                      className={`mobile-btn-wishlist ${inWishlist ? "active" : ""}`}
                      onClick={(e) => handleToggleWishlist(item, e)}
                    >
                      {inWishlist ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )}
                      <span>{inWishlist ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="scroll-hint">
            <span className="hint-dot" />
            <span className="hint-text">Swipe to explore →</span>
          </div>
        </div>

        {showLoadMore && (
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Discover more +
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
