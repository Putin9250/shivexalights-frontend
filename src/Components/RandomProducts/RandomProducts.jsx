import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import "./RandomProducts.scss";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
const EMPTY_RECOMMENDATIONS = [];

const RandomProducts = ({ count = 8, currentProductId, selectedProducts = EMPTY_RECOMMENDATIONS }) => {
  const { data, loading, error } = useFetch("/products");
  const [randomItems, setRandomItems] = useState([]);
  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.url) return baseUrl + img.url;
    return "";
  };

  useEffect(() => {
    // data is { products: [...], total, page, totalPages, hasMore }
    const products = selectedProducts.length ? selectedProducts : data?.products;
    if (products && products.length > 0) {
      // 1. remove current product (if ID provided)
      const filtered = currentProductId
        ? products.filter((item) => item._id !== currentProductId)
        : products;

      // Admin-selected recommendations keep their order; older products use a fallback.
      const items = selectedProducts.length ? filtered : [...filtered].sort(() => Math.random() - 0.5);
      setRandomItems(items.slice(0, count));
    }
  }, [data, count, currentProductId, selectedProducts]);

  if (loading) return <p className="rec-loading">Loading recommendations...</p>;
  if (error) return null; // silent fail
  if (!randomItems.length) return null;

  return (
    <div className="random-products">
      <div className="rp-header">
        <h2>You may also like</h2>
        <p>Discover similar items you might love</p>
      </div>

      <div className="rp-grid">
        {randomItems.map((product) => {
          const img1 = getImageUrl(product.img);
          const img2 = getImageUrl(product.img2);
          const discount = product.oldPrice
            ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
            : null;

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="rp-card"
            >
              <div className="rp-image">
                {discount && <span className="badge">{discount}% OFF</span>}
                <img
                  src={img1 || fallbackImage}
                  alt={product.title}
                  className="main-img"
                  loading="lazy"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                {img2 && (
                  <img
                    src={img2}
                    alt={product.title}
                    className="hover-img"
                    loading="lazy"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              <div className="rp-info">
                <h3>{product.title}</h3>
                <div className="price">
                  {product.oldPrice && (
                    <span className="old">₹ {product.oldPrice}</span>
                  )}
                  <span className="current">₹ {product.price}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RandomProducts;
