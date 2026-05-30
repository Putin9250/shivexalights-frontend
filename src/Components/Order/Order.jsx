import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import "./Order.scss";

const Orders = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_UPLOAD_URL || "";

  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;
    if (imgField.url) return baseUrl + imgField.url;
    return "";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user.id}`
        );

        console.log("Orders:", res.data);

        setOrders(res.data || []);
      } catch (err) {
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn && user?.id) {
      fetchOrders();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="orders-auth">
        <h2>Please sign in to view your orders</h2>
        <SignInButton mode="modal">
          <button className="login-btn">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No orders found</h2>
      </div>
    );
  }

  const generateOrderId = (order) => {
    const date = new Date(order.createdAt);
    const shortDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;

    return `ORD-${order._id.slice(-6)}-${shortDate}`;
  };

  return (
    <div className="orders">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <div className="order-info">
              <p>
                <strong>Order ID</strong>
                <span>{generateOrderId(order)}</span>
              </p>

              <p>
                <strong>Payment ID</strong>
                <span>{order.paymentId || "N/A"}</span>
              </p>

              <p>
                <strong>Status</strong>
                <span
                  className={
                    order.orderStatus === "COD" ? "cod" : "paid"
                  }
                >
                  {order.orderStatus}
                </span>
              </p>

              <p>
                <strong>Date</strong>
                <span>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </p>

              <p>
                <strong>Address</strong>
                <span>
                  {order.address}, {order.pin}
                </span>
              </p>

              <p>
                <strong>Phone</strong>
                <span>{order.phoneNumber}</span>
              </p>
            </div>
          </div>

          <div className="products">
            {order.products?.map((item, idx) => {
              const productId =
                item._id ||
                item.productId ||
                item.id ||
                item.documentId;

              return (
                <Link
                  key={idx}
                  to={productId ? `/product/${productId}` : "#"}
                  className="product"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div className="image-wrapper">
                    <img
                      src={
                        getImageUrl(item.img) ||
                        getImageUrl(item.image)
                      }
                      alt={item.title}
                    />

                    <span
                      className={`badge ${(
                        order.orderStatus || ""
                      ).toLowerCase()}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="product-details">
                    <h4>{item.title}</h4>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      ₹{item.price} each
                    </p>
                  </div>

                  <span className="product-price">
                    ₹{item.price * item.quantity}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="order-footer">
            <strong>Total: ₹{order.totalAmount}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;