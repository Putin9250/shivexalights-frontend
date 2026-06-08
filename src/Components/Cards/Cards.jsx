import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cards.scss";

const Cards = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;
    if (imgField.url) return baseUrl + imgField.url;
    return "";
  };

  const mainImgUrl = getImageUrl(item.img);
  const hoverImgUrl = item.img2 ? getImageUrl(item.img2) : "";
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Single badge logic – no duplication
  let badgeText = "";
  let badgeClass = "";
  if (item.isNew) {
    badgeText = "New Arrival";
    badgeClass = "badge-new";
  } else if (item.isTrending) {
    badgeText = "Trending";
    badgeClass = "badge-trending";
  } else if (item.isFeatured) {
    badgeText = "Featured";
    badgeClass = "badge-featured";
  }

  const productId = item._id || item.id || item.documentId;
  if (!productId) return null;

  return (
    <Link
      className="link"
      to={`/product/${productId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cards">
        <div className="image">
          {badgeText && <span className={`card-badge ${badgeClass}`}>{badgeText}</span>}
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
            loading="lazy"
          />
        </div>
        <h2>{item.title}</h2>
        {item.description && (
          <p className="product-description">{truncateText(item.description)}</p>
        )}
        <div className="prices">
          {item.oldPrice && <h3 className="old-price">₹{item.oldPrice}</h3>}
          <h3 className="current-price">₹{item.price}/-</h3>
        </div>
      </div>
    </Link>
  );
};

export default Cards;