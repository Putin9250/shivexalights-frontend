import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.scss";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ─────────────────────────────────────────────────────────────────
  // ORDERS
  // ─────────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load orders" });
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, { status: newStatus });
      setMessage({ type: "success", text: "Order status updated" });
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${orderId}`);
      setMessage({ type: "success", text: "Order deleted" });
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete order" });
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // PRODUCTS
  // ─────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products?limit=1000`);
      const productList = res.data?.products || res.data || [];
      setProducts(productList);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load products" });
    }
    setLoading(false);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`);
      setMessage({ type: "success", text: "Product deleted" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete product" });
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // ADD PRODUCT
  // ─────────────────────────────────────────────────────────────────
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    img: "",
    img2: "",
    img3: "",
    img4: "",
    categories: "",
    isNew: false,
    isFeatured: false,
    isTrending: false,
    stock: "",
    sizes: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      setMessage({ type: "error", text: "Title and price are required" });
      return;
    }
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        stock: Number(newProduct.stock) || 0,
        categories: newProduct.categories.split(",").map((c) => c.trim()),
        sizes: newProduct.sizes ? JSON.parse(newProduct.sizes) : [],
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload);
      setMessage({ type: "success", text: "Product added" });
      setNewProduct({
        title: "",
        description: "",
        price: "",
        oldPrice: "",
        img: "",
        img2: "",
        img3: "",
        img4: "",
        categories: "",
        isNew: false,
        isFeatured: false,
        isTrending: false,
        stock: "",
        sizes: "",
      });
      fetchProducts();
      setActiveTab("products");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to add product" });
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatOrderId = (order) => {
    const date = new Date(order.createdAt);
    const shortDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    return `ORD-${order._id.slice(-6)}-${shortDate}`;
  };

  const formatSizes = (sizes) => {
    if (!sizes || sizes.length === 0) return "—";
    return sizes.map(s => `${s.name} (₹${s.price})`).join(", ");
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: "", text: "" })}>×</button>
        </div>
      )}

      <div className="tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Orders
        </button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Products
        </button>
        <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>
          Add Product
        </button>
      </div>

      {/* ========== ORDERS SECTION ========== */}
      {activeTab === "orders" && (
        <div className="orders-section">
          {loading && <p>Loading orders...</p>}
          {!loading && orders.length === 0 && <p>No orders found.</p>}
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <strong>Order ID:</strong> {formatOrderId(order)}
                  <strong>Customer:</strong> {order.name || order.email}
                </div>
                <div className="order-details">
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Payment:</strong> {order.paymentId || "N/A"}</p>
                  <p><strong>Address:</strong> {order.address}, {order.pin}</p>
                </div>
                <div className="order-actions">
                  <select
                    value={order.orderStatus || "Paid"}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button className="delete-btn" onClick={() => deleteOrder(order._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== PRODUCTS SECTION ========== */}
      {activeTab === "products" && (
        <div className="products-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading && <p>Loading products...</p>}
          {!loading && filteredProducts.length === 0 && <p>No products found.</p>}
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Categories</th>
                  <th>Sizes</th>
                  <th>First Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p._id.slice(-6)}</td>
                    <td>{p.title}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock ?? 0}</td>
                    <td>{p.categories?.join(", ") || "—"}</td>
                    <td>{formatSizes(p.sizes)}</td>
                    <td>
                      {p.img ? (
                        <a href={p.img} target="_blank" rel="noopener noreferrer">
                          View Image
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== ADD PRODUCT SECTION ========== */}
      {activeTab === "add" && (
        <div className="add-product-section">
          <form onSubmit={handleAddProduct}>
            <div className="form-row">
              <input
                placeholder="Title *"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Price *"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Old Price"
                value={newProduct.oldPrice}
                onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                placeholder="Image URL (img)"
                value={newProduct.img}
                onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
              />
              <input
                placeholder="Image URL (img2)"
                value={newProduct.img2}
                onChange={(e) => setNewProduct({ ...newProduct, img2: e.target.value })}
              />
              <input
                placeholder="Image URL (img3)"
                value={newProduct.img3}
                onChange={(e) => setNewProduct({ ...newProduct, img3: e.target.value })}
              />
              <input
                placeholder="Image URL (img4)"
                value={newProduct.img4}
                onChange={(e) => setNewProduct({ ...newProduct, img4: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                placeholder="Categories (comma separated)"
                value={newProduct.categories}
                onChange={(e) => setNewProduct({ ...newProduct, categories: e.target.value })}
              />
              <textarea
                placeholder='Sizes JSON e.g. [{"name":"Small","price":18900}]'
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
              />
            </div>
            <div className="form-row checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                />{" "}
                New
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.isFeatured}
                  onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                />{" "}
                Featured
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.isTrending}
                  onChange={(e) => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                />{" "}
                Trending
              </label>
            </div>
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;