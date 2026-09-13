import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, resetCart, updateQuantity } from "../../redux/cartReducer";
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

  // Correct quantities saved before stock limits were added to every catalogue card.
  useEffect(() => {
    products.forEach((item) => {
      const stock = Number(item.stock);
      if (Number.isFinite(stock) && stock > 0 && item.quantity > stock) {
        dispatch(updateQuantity({ _id: item._id, size: item.size, quantity: stock }));
      }
    });
  }, [dispatch, products]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleQty = (item, delta) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    const maxStock = Number(item.stock);
    if (!Number.isFinite(maxStock) || maxStock < 1) return;
    if (delta > 0 && next > maxStock) return;
    dispatch(updateQuantity({ _id: item._id, size: item.size, quantity: next }));
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
              <div className="cart-item" key={`${item._id}-${item.size}`}>
                <Link
                  to={`/product/${item._id || item.id}`}
                  onClick={onClose}
                  className="item-link"
                >
                  <img src={item.img} alt={item.title} loading="lazy" />
                </Link>
                <div className="item-details">
                  <Link
                    to={`/product/${item._id || item.id}`}
                    onClick={onClose}
                    className="item-title"
                  >
                    {item.title}
                  </Link>
                  {item.size && <p className="item-size">Size: {item.size}</p>}
                  <p className="item-price">₹{item.price} each</p>

                  {/* Quantity stepper */}
                  <div className="qty-stepper">
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item, -1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item, +1)}
                      disabled={!Number.isFinite(Number(item.stock)) || Number(item.stock) < 1 || item.quantity >= Number(item.stock)}
                    >+</button>
                  </div>
                  {item.stock !== undefined && item.stock > 0 && item.stock <= 5 && (
                    <p className="stock-warn">⚡ Only {item.stock} in stock</p>
                  )}
                </div>
                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>
                <DeleteOutlineIcon
                  className="delete-icon"
                  onClick={() => dispatch(removeItem({ _id: item._id, size: item.size }))}
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
