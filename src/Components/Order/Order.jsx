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

  // Helper to get full image URL (same as in Cart and Product)
  const getImageUrl = (imgField) => {
    if (!imgField) return "";
    if (typeof imgField === "string") return imgField;
    if (imgField.url) return baseUrl + imgField.url;
    return "";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:1337/api/orders?filters[userId][$eq]=${user.id}&sort[0]=createdAt:desc`,
        );
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn && user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // Not signed in
  if (!isSignedIn && !loading) {
    return (
      <div className="orders-auth">
        <h2>Please sign in to view your orders</h2>
        <SignInButton mode="modal">
          <button className="login-btn">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  // Empty orders
  if (orders.length === 0) {
    return <div className="orders-empty">You have no orders yet.</div>;
  }

  // Helper to generate a user‑friendly order ID
  const generateOrderId = (order) => {
    const date = new Date(order.createdAt);
    const shortDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    const status = order.orderStatus || "PAID";
    return `${status}-${order.id}-${shortDate}`;
  };

  return (
    <div className="orders">
      <h1>My Orders</h1>

      {orders.map((order) => {
        const data = order;
        const isCOD = data.orderStatus === "COD";
        const paymentId = data.paymentId || "Missing";
        const total = data.totalAmount || 0;

        return (
          <div className="order-card" key={data.id}>
            <div className="order-header">
              <div className="order-info">
                <p>
                  <strong>Order ID</strong>
                  <span>{generateOrderId(data)}</span>
                </p>
                <p>
                  <strong>Payment ID</strong>
                  <span>{paymentId}</span>
                </p>
                <p>
                  <strong>Status</strong>
                  <span className={isCOD ? "cod" : "paid"}>
                    {isCOD ? "Cash on Delivery" : "Paid"}
                  </span>
                </p>
                <p>
                  <strong>Date</strong>
                  <span>
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="products">
              {data.products?.map((item, idx) => {
                const productId = item.documentId || item.id;
                const productLink = productId ? `/product/${productId}` : "#";

                return (
                  <Link
                    key={idx}
                    to={productLink}
                    className="product"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="image-wrapper">
                      <img
                        src={getImageUrl(item.img) || getImageUrl(item.image)}
                        alt={item.title}
                      />
                      <span
                        className={`badge ${data.orderStatus?.toLowerCase()}`}
                      >
                        {data.orderStatus === "OUT_FOR_DELIVERY"
                          ? "Out for Delivery"
                          : data.orderStatus || "Processing"}
                      </span>
                    </div>
                    <div className="product-details">
                      <h4>{item.title}</h4>
                      <p>
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="product-price">
                      ₹{item.quantity * item.price}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="order-footer">
              <strong>Total: ₹{total}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;