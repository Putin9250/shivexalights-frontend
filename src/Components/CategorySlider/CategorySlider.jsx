import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer";
import { toggleWishlist } from "../../redux/wishlistReducer";
import useFetch from "../../Hooks/useFetch";
import Cards from "../Cards/Cards";
import "./CategorySlider.scss";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const CategorySlider = ({ category, title, description, randomize = false }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.products);
  const wishlistItems = useSelector((state) => state.wishlist.products);

  const { data, loading, error } = useFetch(`/products?category=${encodeURIComponent(category)}&limit=12`);

  // Extract & filter by category
  const rawProducts = useMemo(() => (Array.isArray(data) ? data : data?.data || []), [data]);
  const filteredProducts = useMemo(() => {
    if (!category) return rawProducts;
    return rawProducts.filter((product) =>
      product.categories?.some((cat) => cat === category)
    );
  }, [rawProducts, category]);

  // Generate a stable random order using sessionStorage (persists across back/forward)
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (filteredProducts.length === 0) return;
    let result = [...filteredProducts];
    if (randomize) {
      const storageKey = `shuffled_${category.replace(/\s/g, "_")}`;
      const storedIds = sessionStorage.getItem(storageKey);
      if (storedIds) {
        // Restore order from storage
        const idOrder = JSON.parse(storedIds);
        result = idOrder.map((id) => filteredProducts.find((p) => (p._id || p.id) === id)).filter(Boolean);
        // If any product missing, fallback to new shuffle
        if (result.length !== filteredProducts.length) {
          result = shuffleArray([...filteredProducts]);
          sessionStorage.setItem(storageKey, JSON.stringify(result.map((p) => p._id || p.id)));
        }
      } else {
        result = shuffleArray([...filteredProducts]);
        sessionStorage.setItem(storageKey, JSON.stringify(result.map((p) => p._id || p.id)));
      }
    }
    setProducts(result);
  }, [filteredProducts, randomize, category]);

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Pagination (Load More)
  const [visibleCount, setVisibleCount] = useState(8);
  

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, products.length));
  };

  const visibleProducts = products.slice(0, visibleCount);

  // Slider refs & controls (exactly as FeaturedProducts)
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
  }, [products]);

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

  // Cart & wishlist toggles (same as FeaturedProducts)
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

  const handleToggleWishlist = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(item));
  };

  // Loading / error / empty states
  if (loading) {
    return (
      <div className="category-loading">
        <div className="loading-header" />
        <div className="loading-slider">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-skeleton" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="category-error">Unable to load {title}.</div>;
  if (products.length === 0) {
    return (
      <div className="category-empty">
        <h3>{title}</h3>
        <p>Our {title.toLowerCase()} collection is coming soon.</p>
      </div>
    );
  }

  return (
    <section className="category-slider-premium">
      <div className="category-container">
        <div className="category-header">
          <div className="header-left">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <Link to={`/products?category=${encodeURIComponent(category)}`} className="view-all-link">
            View all →
          </Link>
        </div>

        <div className="slider-wrapper">
          <div className="slider-track" ref={sliderRef}>
            {visibleProducts.map((item) => {
              const inCart = cartItems.some((i) => i._id === item._id);
              const inWishlist = wishlistItems.some((i) => i._id === item._id);
              return (
                <div key={item._id || item.id} className="product-slide">
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
        </div>

        
      </div>
    </section>
  );
};

export default CategorySlider;