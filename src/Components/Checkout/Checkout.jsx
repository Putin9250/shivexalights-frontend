import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { resetCart } from "../../redux/cartReducer";
import "./Checkout.scss";
import { useClerk } from "@clerk/clerk-react";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openSignIn } = useClerk();

  const { user, isSignedIn } = useUser();
  const cartProducts = useSelector((state) => state.cart.products);

  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    pin: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌕 COMMON VALIDATION
  const validateForm = () => {
    const { name, email, phoneNumber, address, pin } = formData;

    if (!isSignedIn || !user) {
      openSignIn();
      return false;
    }

    if (!name || !email || !phoneNumber || !address || !pin) {
      alert("Fill all details");
      return false;
    }

    return true;
  };

  // 🌑 COD ORDER
  const handleCOD = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const cleanProducts = cartProducts.map((item) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      img:item.img,
    }));

    const orderData = {
      data: {
        ...formData,
        paymentId: "COD_" + Date.now(),
        products: cleanProducts,
        totalAmount: totalPrice,
        orderStatus: "COD",

        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress,
      },
    };

    try {
      const res = await axios.post(
        "http://localhost:1337/api/orders",
        orderData,
      );

      console.log("✅ COD Saved:", res.data);

      dispatch(resetCart());
      alert("🎉 Order Placed (Cash on Delivery)");
      navigate("/order");
    } catch (err) {
      console.error("❌ COD Error:", err.response?.data || err.message);
      alert("Order not saved!");
    }

    setLoading(false);
  };

  // 🌒 ONLINE PAYMENT
  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const amountInPaise = totalPrice * 100;

      const { data: order } = await axios.post(
        "http://localhost:1337/api/orders/create-razorpay-order",
        { amount: amountInPaise },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShivExa Lights",
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#2879fe" },

        handler: async (response) => {
          const cleanProducts = cartProducts.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            img: item.img, // keep raw image
          }));

          const orderData = {
            data: {
              ...formData,
              paymentId: response.razorpay_payment_id,
              products: cleanProducts,
              totalAmount: totalPrice,
              orderStatus: "PAID",

              userId: user.id,
              userEmail: user.emailAddresses[0]?.emailAddress,
            },
          };

          try {
            const res = await axios.post(
              "http://localhost:1337/api/orders",
              orderData,
            );

            console.log("✅ Paid Saved:", res.data);

            dispatch(resetCart());
            alert("🎉 Payment Successful!");
            navigate("/order");
          } catch (err) {
            console.error("❌ Save Error:", err.response?.data || err.message);
            alert("Payment done but NOT saved!");
          }

          setLoading(false);
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="checkout-page empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="back-btn">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        {/* LEFT */}
        <div className="summary-section">
          <h2>Order Summary</h2>

          {cartProducts.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.documentId || item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="item">
                <img src={item.img} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            </Link>
          ))}

          <div className="total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="form-section">
          <h2>Delivery Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <input
            name="pin"
            placeholder="PIN Code"
            onChange={handleChange}
            value={formData.pin}
          />
          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            value={formData.address}
          />

          {/* 🌟 TWO BUTTONS */}
          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <button onClick={handleCOD} disabled={loading}>
            {loading ? "Processing..." : "Cash on Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
