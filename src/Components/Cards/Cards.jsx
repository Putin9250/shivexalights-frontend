import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cards.scss";

const Cards = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
// console.log(item);
  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  // Get image URL regardless of format (string or Strapi object)
  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;          // direct URL
    if (imgField.url) return baseUrl + imgField.url;            // Strapi object
    return "";
  };

  const mainImgUrl = getImageUrl(item.img);
  const hoverImgUrl = item.img2 ? getImageUrl(item.img2) : "";

  // Inline SVG fallback (no external dependency)
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  return (
    <Link
      className="link"
      to={`/product/${item.documentId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cards">
        <div className="image">
          {item.isNew && <span className="new-badge">New Season</span>}
          <img
            src={
              imgError
                ? fallbackImage
                : isHovered && hoverImgUrl
                ? hoverImgUrl
                : mainImgUrl || fallbackImage
            }
            alt={item.title || "Product"}
            className="mainImg"
            onError={handleImageError}
          />
        </div>
        <h2>{item.title}</h2>
        <div className="prices">
          {item.OldPrice && <h3 className="old-price">${item.OldPrice}</h3>}
          <h3 className="current-price">${item.price}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Cards;