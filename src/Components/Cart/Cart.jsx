import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, resetCart } from "../../redux/cartReducer";
import "./Cart.scss";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Cart = ({ onClose }) => {
  const cartRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);

  const totalPrice = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="cart-overlay">
      <div className="cart-container" ref={cartRef}>
        <div className="cart-header">
          <h2>
            <ShoppingBagOutlinedIcon /> Your Cart ({products.length})
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {products.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBagOutlinedIcon />
              <p>Your cart is empty</p>
              <button className="shop-now-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            products.map((item) => (
              <div className="cart-item" key={item.id}>
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
                  <p className="item-price">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>
                <DeleteOutlineIcon
                  className="delete-icon"
                  onClick={() => dispatch(removeItem(item._id))}
                />
              </div>
            ))
          )}
        </div>

        {products.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="total-row final">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="reset-cart-btn" onClick={() => dispatch(resetCart())}>
              Empty Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;