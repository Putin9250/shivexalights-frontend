import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlist } from "../../redux/wishlistReducer";
import "./Wishlist.scss";

// Icons
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Wishlist = ({ onClose }) => {
  const wishlistRef = useRef();
  const wishlist = useSelector((state) => state.wishlist.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-container" ref={wishlistRef}>
        <div className="wishlist-header">
          <h2>
            <FavoriteBorderOutlinedIcon /> My Wishlist ({wishlist.length})
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <FavoriteBorderOutlinedIcon />
              <p>No saved items yet</p>
              <button className="shop-now-btn" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div className="wishlist-item" key={item.id}>
                <Link
                  to={`/product/${item._id || item.id}`}
                  onClick={onClose}
                  className="item-link"
                >
                  <img src={item.img} alt={item.title} loading="lazy"/>
                </Link>
                <div className="item-details">
                  <Link
                    to={`/product/${item._id || item.id}`}
                    onClick={onClose}
                    className="item-title"
                  >
                    {item.title}
                  </Link>
                  <p className="item-price">₹{item.price}</p>
                </div>
                <DeleteOutlineIcon
                  className="delete-icon"
                  onClick={() => dispatch(toggleWishlist(item))}
                />
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="wishlist-footer">
            <button className="continue-shopping" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;