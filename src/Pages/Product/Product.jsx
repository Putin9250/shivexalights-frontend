import React, { useState } from "react";
import "./Product.scss";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { toggleWishlist } from "../../redux/wishlistReducer";
import RandomProducts from "../../Components/RandomProducts/RandomProducts";

const Product = () => {
  const { id } = useParams();

  // 1. All hooks go here (unconditionally)
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  const { data, loading, error } = useFetch(
    `/products?filters[documentId][$eq]=${id}&populate=*`,
  );

  // ✅ useSelector called unconditionally at the top
  const wishlist = useSelector((state) => state.wishlist.products);

  // Early returns after all hooks
  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product.</p>;

  const product = data?.[0];
  if (!product) return <p>Product not found.</p>;

  // ✅ Now product exists – we can safely use wishlist
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;
    if (imgField.url) return baseUrl + imgField.url;
    return "";
  };

  const images = [getImageUrl(product.img), getImageUrl(product.img2)].filter(
    Boolean,
  );

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: "Check out this product",
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard");
    }
  };

  return (
    <>
      <div className="product">
        <div className="left">
          <div className="images">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                loading="lazy"
                onClick={() => setSelectedImg(index)}
                onError={(e) => (e.target.src = fallbackImage)}
              />
            ))}
          </div>

          <div className="mainImg">
            {images[selectedImg] ? (
              <img
                src={images[selectedImg]}
                alt=""
                loading="lazy"
                onError={(e) => (e.target.src = fallbackImage)}
              />
            ) : (
              <img src={fallbackImage} loading="lazy" alt="" />
            )}
          </div>
        </div>

        <div className="right">
          <h1>{product.title}</h1>

          <div className="price">
            {product.OldPrice && (
              <span className="oldPrice">${product.OldPrice}</span>
            )}
            <span className="currentPrice">${product.price}</span>
            {product.OldPrice && (
              <span className="discount">
                {Math.round(
                  ((product.OldPrice - product.price) / product.OldPrice) * 100,
                )}
                % OFF
              </span>
            )}
          </div>
          <p>{product.desc}</p>

          <div className="quantity">
            <button
              onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}
            >
              -
            </button>
            {quantity}
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>

          <div className="actions">
            {/* Wishlist button with conditional active class */}
            <button
              className={`wishlist ${isInWishlist ? "active" : ""}`}
              onClick={() =>
                dispatch(
                  toggleWishlist({
                    id: product.id,
                    documentId: product.documentId,
                    title: product.title,
                    price: product.price,
                    img: getImageUrl(product.img),
                  }),
                )
              }
            >
              <FavoriteBorderIcon />
            </button>

            <button
              className="add"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product.id,
                    documentId: product.documentId,
                    title: product.title,
                    desc: product.desc,
                    img: getImageUrl(product.img),
                    price: product.price,
                    quantity,
                  }),
                )
              }
            >
              <ShoppingCartCheckoutIcon /> Add to Cart
            </button>

            <button
              className="shareBtn"
              onClick={handleShare}
              title="Share this product"
            >
              <ShareIcon />
            </button>
          </div>

          <div className="links">
            <div className="item">🚚 Free shipping</div>
            <div className="item">📦 Delivery in 3–5 days</div>
            <div className="item">↩ 7-day return policy</div>
          </div>
        </div>
      </div>
      <RandomProducts count={4} />
    </>
  );
};

export default Product;
