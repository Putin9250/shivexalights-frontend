import React, { useEffect, useRef } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector, useDispatch } from "react-redux";
import "./Cart.scss";
import { Link, useNavigate } from "react-router-dom";

import { removeItem, resetCart } from "../../redux/cartReducer";

const Cart = ({ onClose }) => {
  const cartRef = useRef(); // ref for the cart container
  const products = useSelector((state) => state.cart.products);
  const navigate = useNavigate();
  const totalPrice = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const dispatch = useDispatch();
  // Handle checkout button click
  const handleCheckout = () => {
    onClose(); // close the cart overlay
    navigate("/checkout"); // go to checkout page
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="cart" ref={cartRef}>
      <h1>Products in Your Cart</h1>

      {products?.map((item) => (
        <Link
          key={item.id}
          to={`/product/${item._id || item.id}`}
          onClick={onClose}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="item" key={item.id}>
            <img src={item.img} alt={item.title} />

            <div className="details">
              <h1>{item.title}</h1>
              <p>{item?.description?.substring(0, 100)}</p>
              <div className="price">
                {item.quantity} × ${item.price}
              </div>
            </div>
            <DeleteOutlinedIcon
              className="delete"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(removeItem(item._id));
              }}
            />
          </div>
        </Link>
      ))}

      <div className="total">
        <span>SUBTOTAL</span>
        <span>${totalPrice}</span>
      </div>

      <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
