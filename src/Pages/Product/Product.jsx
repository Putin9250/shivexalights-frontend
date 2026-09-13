import React, { useEffect, useState } from "react";
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
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState({});

  const { data, loading, error } = useFetch(`/products/${id}`);
  const wishlist = useSelector((state) => state.wishlist.products);

  const product = data;
  const sizes = Array.isArray(product?.sizes)
    ? product.sizes.filter((size) => size?.name && Number.isFinite(Number(size.price)))
    : [];
  const hasSizes = sizes.length > 0;

  useEffect(() => {
    setSelectedImg(0);
    setQuantity(1);
    setMainImageLoaded(false);
    setThumbnailsLoaded({});
    const firstAvailableSize = sizes.find((size) => {
      const sizeStock = Number.isFinite(Number(size.stock)) ? Number(size.stock) : Number(product?.stock ?? 0);
      return sizeStock > 0;
    });
    setSelectedSize(firstAvailableSize || sizes[0] || null);
  }, [id, product?._id, product?.updatedAt]);

  useEffect(() => {
    if (!product) return undefined;
    document.title = `${product.title} | Shivexa Lighting`;
    const schemaId = "shivexa-product-schema";
    document.getElementById(schemaId)?.remove();
    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description || undefined,
      image: [product.img, product.img2, product.img3, product.img4].filter(Boolean).map((image) => typeof image === "string" ? image : image.url),
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: selectedSize?.price || product.price,
        availability: Number(product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [product, selectedSize]);

  if (loading)
    return <div className="product-skeleton">Loading product...</div>;
  if (error) return <p>Error loading product.</p>;
  if (!product) return <p>Product not found.</p>;

  const isInWishlist = wishlist.some((item) => item._id === product._id);
  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;
    if (imgField.url) return baseUrl + imgField.url;
    return "";
  };

  const allImages = [
    getImageUrl(product.img),
    getImageUrl(product.img2),
    getImageUrl(product.img3),
    getImageUrl(product.img4),
  ].filter(Boolean);

  const images = allImages.length ? allImages : [getImageUrl(product.img)];
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: "Check out this product",
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard");
    }
  };

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const variantStock = selectedSize?.stock;
  const stockLimit = Number.isFinite(Number(variantStock))
    ? Number(variantStock)
    : Number(product.stock ?? 0);
  const isOutOfStock = stockLimit === 0;

  const selectSize = (size) => {
    setSelectedSize(size);
    const nextStock = Number.isFinite(Number(size.stock)) ? Number(size.stock) : Number(product.stock ?? 0);
    setQuantity((previous) => Math.max(1, Math.min(previous, nextStock || 1)));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert("Sorry, this product is out of stock.");
      return;
    }
    if (hasSizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: currentPrice,
        img: getImageUrl(product.img),
        quantity,
        size: selectedSize ? selectedSize.name : null,
        stock: stockLimit,
      }),
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImg(index);
    if (window.innerWidth <= 768) {
      document
        .querySelector(".mainImg")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMainImageLoad = () => setMainImageLoaded(true);
  const handleThumbnailLoad = (index) => {
    setThumbnailsLoaded((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <div className="product">
        <div className="left">
          <div className="images">
            {images.map((img, index) => (
              <div key={index} className="thumbnail-wrapper">
                {/* Skeleton overlay – hidden after image loads */}
                {!thumbnailsLoaded[index] && (
                  <div className="thumbnail-skeleton" />
                )}
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  onClick={() => handleThumbnailClick(index)}
                  onError={(e) => (e.target.src = fallbackImage)}
                  onLoad={() => handleThumbnailLoad(index)}
                />
              </div>
            ))}
          </div>
          <div className="mainImg">
            {/* Skeleton overlay – hidden after image loads */}
            {!mainImageLoaded && <div className="main-image-skeleton" />}
            <img
              src={images[selectedImg] || fallbackImage}
              alt=""
              loading="lazy"
              onError={(e) => (e.target.src = fallbackImage)}
              onLoad={handleMainImageLoad}
            />
          </div>
        </div>

        <div className="right">
          <h1>{product.title}</h1>
          <div className="price">
            {product.oldPrice && (
              <span className="oldPrice">₹{product.oldPrice}</span>
            )}
            <span className="currentPrice">₹{currentPrice}/-</span>
            {product.oldPrice && (
              <span className="discount">
                {Math.round(
                  ((product.oldPrice - currentPrice) / product.oldPrice) * 100,
                )}
                % OFF
              </span>
            )}
          </div>
          <p>{product.description}</p>

          {hasSizes && (
            <div className="size-selector">
              <span className="size-label">Select Size: <strong>{selectedSize?.name}</strong></span>
              <div className="size-options">
                {sizes.map((size, idx) => {
                  const sizeStock = Number.isFinite(Number(size.stock)) ? Number(size.stock) : Number(product.stock ?? 0);
                  const unavailable = sizeStock === 0;
                  return (
                  <button
                    key={idx}
                    type="button"
                    disabled={unavailable}
                    className={`size-btn ${selectedSize?.name === size.name ? "active" : ""} ${unavailable ? "unavailable" : ""}`}
                    onClick={() => selectSize(size)}
                  >
                    <span>{size.name}</span><small>₹{Number(size.price).toLocaleString("en-IN")}</small>
                  </button>
                  );
                })}
              </div>
              {selectedSize && <p className={`variant-stock ${isOutOfStock ? "out" : ""}`}>{isOutOfStock ? `${selectedSize.name} is out of stock` : `${stockLimit} available in ${selectedSize.name}`}</p>}
            </div>
          )}

          <div className="quantity">
            <button
              onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}
              disabled={isOutOfStock}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (stockLimit > 0 ? Math.min(prev + 1, stockLimit) : prev))}
              disabled={isOutOfStock || quantity >= stockLimit}
            >
              +
            </button>
            {isOutOfStock && (
              <div className="stock-warning out">
                ❌ Out of Stock
              </div>
            )}
            {!isOutOfStock && stockLimit > 0 && stockLimit <= 5 && (
              <div className="stock-warning">
                ⚡ Only {stockLimit} left – order soon!
              </div>
            )}
            {!isOutOfStock && quantity >= stockLimit && stockLimit > 0 && (
              <div className="stock-warning">
                ℹ️ Max quantity reached ({stockLimit} in stock)
              </div>
            )}
          </div>

          <div className="actions">
            <button
              className={`wishlist ${isInWishlist ? "active" : ""}`}
              onClick={() =>
                dispatch(
                  toggleWishlist({
                    _id: product._id,
                    title: product.title,
                    price: currentPrice,
                    img: getImageUrl(product.img),
                    size: selectedSize ? selectedSize.name : null,
                  }),
                )
              }
            >
              <FavoriteBorderIcon />
            </button>
            <button className={`add ${isOutOfStock ? "disabled" : ""}`} onClick={handleAddToCart} disabled={isOutOfStock}>
              <ShoppingCartCheckoutIcon /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button className="shareBtn" onClick={handleShare} title="Share">
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
      <RandomProducts count={8} currentProductId={product._id} selectedProducts={product.recommendedProducts} />
    </>
  );
};

export default Product;
