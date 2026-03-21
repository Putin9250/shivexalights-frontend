import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlist } from "../../redux/wishlistReducer";
import "./Wishlist.scss";

const Wishlist = ({ onClose }) => {
  const wishlistRef = useRef(); // ref for the wishlist container
  const wishlist = useSelector((state) => state.wishlist.products);
  const dispatch = useDispatch();

  // Close wishlist when clicking outside
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
    <div className="wishlist" ref={wishlistRef}>
      <h1>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No saved items</p>
      ) : (
        wishlist.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.documentId || item.id}`}
            onClick={onClose}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="item">
              <img src={item.img} alt={item.title} />
              <div className="details">
                <h2>{item.title}</h2>
                <p>${item.price}</p>
              </div>
              <DeleteOutlineIcon
                className="delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dispatch(toggleWishlist(item));
                }}
              />
            </div>
          </Link>
        ))
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Wishlist;