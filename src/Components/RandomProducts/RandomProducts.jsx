import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./RandomProducts.scss";

const RandomProducts = ({ count = 4 }) => {
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
    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, count));
    }
  }, [data, count]);

  if (loading) return <p className="rec-loading">Loading recommendations...</p>;
  if (error) return null;

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

          const discount =
            product.oldPrice &&
            Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100,
            );

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="rp-card"
            >
              <div className="rp-image">
                {discount && <span className="badge">{discount}% OFF</span>}

                <img src={img1} alt={product.title} className="main-img" />

                {img2 && (
                  <img src={img2} alt={product.title} className="hover-img" />
                )}

                <button className="wishlist-btn">
                  <FavoriteBorderIcon />
                </button>
              </div>

              <div className="rp-info">
                <h3>{product.title}</h3>

                <div className="price">
                  {product.OldPrice && (
                    <span className="old">${product.OldPrice}</span>
                  )}

                  <span className="current">${product.price}</span>
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
