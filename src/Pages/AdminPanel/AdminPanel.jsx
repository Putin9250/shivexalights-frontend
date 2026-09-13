import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { downloadProductImportTemplate, exportRowsToExcel, readProductImportFile } from "../../utils/exportExcel";
import "./AdminPanel.scss";

const API = import.meta.env.VITE_API_URL;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    dashboard: "📊", orders: "📦", products: "💡", add: "➕",
    blog: "✍️", testimonials: "⭐", newsletter: "✉️", logout: "🚪", menu: "☰",
    close: "✕", trash: "🗑", edit: "✏️", eye: "👁", check: "✅",
  };
  return <span className="nav-icon">{icons[name] || "•"}</span>;
};

// ─── Stats Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ "--accent": color }}>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Auth
  const [isAuthorized, setIsAuthorized] = useState(
    () => sessionStorage.getItem("shivexa_admin_authorized") === "true"
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // Layout
  const [activeTab, setActiveTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDraft, setProductDraft] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // Product form
  const emptyProduct = {
    title: "", description: "", price: "", oldPrice: "",
    img: "", img2: "", img3: "", img4: "",
    categories: "", isNew: false, isFeatured: false, isTrending: false, stock: "",
  };
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [sizeRows, setSizeRows] = useState([{ name: "", price: "", stock: "" }]);
  const [newProductRecommendations, setNewProductRecommendations] = useState([]);
  const [editRecommendationSearch, setEditRecommendationSearch] = useState("");
  const [addRecommendationSearch, setAddRecommendationSearch] = useState("");
  const [importingProducts, setImportingProducts] = useState(false);

  // Blog form
  const emptyBlog = {
    title: "", excerpt: "", content: "", coverImg: "",
    author: "Shiv exa Editorial", tags: "", isPublished: true,
  };
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [editingBlog, setEditingBlog] = useState(null);

  // Testimonial form
  const emptyTestimonial = { name: "", role: "Verified Customer", rating: 5, comment: "", avatar: "", isFeatured: true };
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);

  useEffect(() => {
    setActiveTab(new URLSearchParams(location.search).get("tab") || "dashboard");
  }, [location.search]);

  const goToTab = (tab) => {
    navigate({ pathname: "/admin", search: tab === "dashboard" ? "" : `?tab=${tab}` });
  };

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem("shivexa_admin_authorized", "true");
      setIsAuthorized(true);
      setPasswordError(false);
    }
    else { setPasswordError(true); setPassword(""); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("shivexa_admin_authorized");
    setIsAuthorized(false);
  };

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ─── Fetch helpers ────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const r = await axios.get(`${API}/orders`); setOrders(r.data || []); }
    catch { notify("error", "Failed to load orders"); }
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/products?limit=1000`);
      setProducts(r.data?.products || r.data || []);
    } catch { notify("error", "Failed to load products"); }
    setLoading(false);
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try { const r = await axios.get(`${API}/blogs`); setBlogs(r.data || []); }
    catch { notify("error", "Failed to load blogs"); }
    setLoading(false);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try { const r = await axios.get(`${API}/testimonials`); setTestimonials(r.data || []); }
    catch { notify("error", "Failed to load testimonials"); }
    setLoading(false);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try { const r = await axios.get(`${API}/subscribers`); setSubscribers(r.data || []); }
    catch { notify("error", "Failed to load newsletter subscribers"); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    if (activeTab === "dashboard") { fetchOrders(); fetchProducts(); fetchBlogs(); fetchTestimonials(); fetchSubscribers(); }
    if (activeTab === "orders") fetchOrders();
    if (["products", "add", "product-detail"].includes(activeTab)) fetchProducts();
    if (activeTab === "blog") fetchBlogs();
    if (activeTab === "testimonials") fetchTestimonials();
    if (activeTab === "newsletter") fetchSubscribers();
  }, [activeTab, isAuthorized]);

  // ─── Orders ───────────────────────────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${API}/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      setSelectedOrder(prev => prev?._id === id ? data : prev);
      notify("success", "Order status updated");
    } catch { notify("error", "Failed to update order"); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`${API}/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      notify("success", "Order deleted");
    } catch { notify("error", "Failed to delete order"); }
  };

  // ─── Products ─────────────────────────────────────────────────────────────
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      notify("success", "Product deleted");
    } catch { notify("error", "Failed to delete product"); }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setProductDraft({
      ...product,
      categoriesText: (product.categories || []).join(", "),
      sizesText: (product.sizes || []).map(size => `${size.name}:${size.price}${size.stock !== undefined ? `:${size.stock}` : ""}`).join(", "),
    });
    setActiveTab("product-detail");
  };

  const saveProductChanges = async (e) => {
    e.preventDefault();
    if (!productDraft?.title || productDraft.price === "") {
      notify("error", "Product title and price are required");
      return;
    }
    const sizes = (productDraft.sizesText || "").split(",").map(entry => {
      const [name, price, stock] = entry.trim().split(":");
      return name && price !== undefined ? { name: name.trim(), price: Number(price), ...(stock !== undefined && stock !== "" ? { stock: Number(stock) } : {}) } : null;
    }).filter(Boolean);
    const payload = {
      title: productDraft.title,
      description: productDraft.description || "",
      price: Number(productDraft.price),
      oldPrice: productDraft.oldPrice ? Number(productDraft.oldPrice) : undefined,
      stock: Number(productDraft.stock) || 0,
      categories: (productDraft.categoriesText || "").split(",").map(category => category.trim()).filter(Boolean),
      img: productDraft.img || "",
      img2: productDraft.img2 || "",
      img3: productDraft.img3 || "",
      img4: productDraft.img4 || "",
      isNew: Boolean(productDraft.isNew),
      isFeatured: Boolean(productDraft.isFeatured),
      isTrending: Boolean(productDraft.isTrending),
      sizes,
      recommendedProducts: (productDraft.recommendedProducts || []).map((item) => item._id || item).filter((item) => item && item !== selectedProduct._id).slice(0, 8),
    };
    try {
      const { data } = await axios.put(`${API}/products/${selectedProduct._id}`, payload);
      setProducts(prev => prev.map(product => product._id === data._id ? data : product));
      setSelectedProduct(data);
      setProductDraft({ ...data, categoriesText: (data.categories || []).join(", "), sizesText: (data.sizes || []).map(size => `${size.name}:${size.price}${size.stock !== undefined ? `:${size.stock}` : ""}`).join(", ") });
      notify("success", "Product updated");
    } catch { notify("error", "Failed to update product"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) { notify("error", "Title and price are required"); return; }
    const sizes = sizeRows.filter(r => r.name.trim() && r.price !== "").map(r => ({ name: r.name.trim(), price: Number(r.price), ...(r.stock !== "" ? { stock: Number(r.stock) } : {}) }));
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        stock: Number(newProduct.stock) || 0,
        categories: newProduct.categories.split(",").map(c => c.trim()),
        sizes,
        recommendedProducts: newProductRecommendations.slice(0, 8),
      };
      const r = await axios.post(`${API}/products`, payload);
      setProducts(prev => [r.data, ...prev]);
      setNewProduct(emptyProduct);
      setSizeRows([{ name: "", price: "", stock: "" }]);
      setNewProductRecommendations([]);
      notify("success", "Product added successfully!");
      setActiveTab("products");
    } catch { notify("error", "Failed to add product"); }
  };

  const handleProductImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImportingProducts(true);
    try {
      const importedRows = await readProductImportFile(file);
      const created = [];
      const failures = [];
      for (const row of importedRows) {
        try {
          const response = await axios.post(`${API}/products`, row.payload);
          created.push({ ...row, product: response.data });
        } catch {
          failures.push(`Row ${row.rowNumber}`);
        }
      }
      const referenceProducts = [...products, ...created.map(item => item.product)];
      const byId = new Map(referenceProducts.map(product => [String(product._id), product._id]));
      const byTitle = new Map(referenceProducts.map(product => [String(product.title || "").trim().toLowerCase(), product._id]));
      const finalized = [];
      for (const item of created) {
        const recommendedProducts = item.recommendations.map(reference => byId.get(reference) || byTitle.get(reference.toLowerCase())).filter(Boolean).slice(0, 8);
        const response = await axios.put(`${API}/products/${item.product._id}`, { ...item.payload, recommendedProducts });
        finalized.push(response.data);
      }
      setProducts(prev => [...finalized, ...prev]);
      const status = `${finalized.length} product${finalized.length === 1 ? "" : "s"} imported${failures.length ? `; ${failures.join(", ")} could not be added` : ""}`;
      notify(finalized.length ? "success" : "error", status);
    } catch (error) {
      notify("error", error.message || "Could not import this Excel file");
    } finally {
      setImportingProducts(false);
    }
  };

  // ─── Blogs ────────────────────────────────────────────────────────────────
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) { notify("error", "Title and content are required"); return; }
    const payload = { ...blogForm, tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (editingBlog) {
        const r = await axios.put(`${API}/blogs/${editingBlog}`, payload);
        setBlogs(prev => prev.map(b => b._id === editingBlog ? r.data : b));
        notify("success", "Blog updated!");
        setEditingBlog(null);
      } else {
        const r = await axios.post(`${API}/blogs`, payload);
        setBlogs(prev => [r.data, ...prev]);
        notify("success", "Blog published!");
      }
      setBlogForm(emptyBlog);
    } catch { notify("error", "Failed to save blog"); }
  };

  const editBlog = (blog) => {
    setEditingBlog(blog._id);
    setBlogForm({ ...blog, tags: (blog.tags || []).join(", ") });
    setActiveTab("blog-editor");
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await axios.delete(`${API}/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
      notify("success", "Blog deleted");
    } catch { notify("error", "Failed to delete blog"); }
  };

  // ─── Testimonials ─────────────────────────────────────────────────────────
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.comment) { notify("error", "Name and comment required"); return; }
    try {
      const r = await axios.post(`${API}/testimonials`, testimonialForm);
      setTestimonials(prev => [r.data, ...prev]);
      setTestimonialForm(emptyTestimonial);
      notify("success", "Testimonial added!");
    } catch { notify("error", "Failed to add testimonial"); }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await axios.delete(`${API}/testimonials/${id}`);
      setTestimonials(prev => prev.filter(t => t._id !== id));
      notify("success", "Testimonial deleted");
    } catch { notify("error", "Failed to delete testimonial"); }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm("Remove this newsletter subscriber?")) return;
    try {
      await axios.delete(`${API}/subscribers/${id}`);
      setSubscribers(prev => prev.filter(s => s._id !== id));
      notify("success", "Subscriber removed");
    } catch { notify("error", "Failed to remove subscriber"); }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter((order) => {
    const needle = orderSearch.toLowerCase();
    const matchesSearch = !needle || [order.name, order.email, order.userEmail, order._id]
      .some((value) => value?.toLowerCase().includes(needle));
    const matchesStatus = orderStatusFilter === "all" || (order.orderStatus || "Paid") === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email?.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const exportOrders = () => {
    const didExport = exportRowsToExcel({
      fileName: "shivexa-orders",
      sheetName: "Orders",
      rows: filteredOrders.map((order) => ({
        "Order ID": `ORD-${order._id?.slice(-6) || ""}`,
        "Placed on": formatDate(order.createdAt),
        Status: order.orderStatus || "Paid",
        Customer: order.name || "",
        Email: order.email || order.userEmail || "",
        Phone: order.phoneNumber || "",
        Address: [order.address, order.pin].filter(Boolean).join(", "),
        "Payment method": order.orderStatus === "COD" ? "Cash on Delivery" : "Online payment",
        "Payment ID": order.paymentId || "",
        Items: (order.products || []).map((item) => `${item.title || "Product"}${item.size ? ` (${item.size})` : ""} × ${item.quantity || 1} @ ₹${item.price || 0}`).join(" | "),
        "Order total": Number(order.totalAmount || 0),
      })),
    });
    if (!didExport) notify("error", "There are no matching orders to export");
  };

  const exportProducts = () => {
    const didExport = exportRowsToExcel({
      fileName: "shivexa-products",
      sheetName: "Products",
      rows: filteredProducts.map((product) => ({
        Title: product.title || "",
        Description: product.description || "",
        Price: Number(product.price || 0),
        "Old price": Number(product.oldPrice || 0),
        Stock: product.stock ?? "",
        Categories: (product.categories || []).join(", "),
        "Image 1 URL": product.img || "",
        "Image 2 URL": product.img2 || "",
        "Image 3 URL": product.img3 || "",
        "Image 4 URL": product.img4 || "",
        Sizes: (product.sizes || []).map((size) => `${size.name || "Size"}:${size.price ?? ""}${size.stock !== undefined && size.stock !== "" ? `:${size.stock}` : ""}`).join(", "),
        "New Arrival": product.isNew ? "TRUE" : "FALSE",
        Featured: product.isFeatured ? "TRUE" : "FALSE",
        Trending: product.isTrending ? "TRUE" : "FALSE",
        "Recommended Products (IDs or titles)": (product.recommendedProducts || []).map(item => item._id || item).join(" | "),
      })),
    });
    if (!didExport) notify("error", "There are no matching products to export");
  };

  const exportTestimonials = () => {
    const didExport = exportRowsToExcel({
      fileName: "shivexa-client-feedback",
      sheetName: "Client Feedback",
      rows: testimonials.map((testimonial) => ({
        Name: testimonial.name || "",
        Role: testimonial.role || "",
        Rating: testimonial.rating || "",
        Featured: testimonial.isFeatured === false ? "No" : "Yes",
        Review: testimonial.comment || "",
        "Avatar URL": testimonial.avatar || "",
      })),
    });
    if (!didExport) notify("error", "There are no testimonials to export");
  };

  const exportSubscribers = () => {
    const didExport = exportRowsToExcel({
      fileName: "shivexa-newsletter-subscribers",
      sheetName: "Subscribers",
      rows: filteredSubscribers.map((subscriber) => ({
        Email: subscriber.email || "",
        "Subscribed on": formatDate(subscriber.subscribedAt || subscriber.createdAt),
      })),
    });
    if (!didExport) notify("error", "There are no matching subscribers to export");
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setActiveTab("order-detail");
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // ─── Login Screen ─────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="login-brand">
            <span className="login-logo">✦</span>
            <h1>Shiv exa Admin</h1>
            <p>Control Panel — Restricted Access</p>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="input-wrap">
              <input
                type="password" placeholder="Enter admin password"
                value={password} onChange={e => setPassword(e.target.value)} autoFocus
              />
            </div>
            {passwordError && <p className="login-error">Incorrect password. Please try again.</p>}
            <button type="submit" className="login-btn">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Sidebar nav items ────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "products", label: "Products", icon: "products" },
    { id: "add", label: "Add Product", icon: "add" },
    { id: "blog", label: "Blog Manager", icon: "blog" },
    { id: "blog-editor", label: "Blog Editor", icon: "edit" },
    { id: "testimonials", label: "Testimonials", icon: "testimonials" },
    { id: "newsletter", label: "Newsletter", icon: "newsletter" },
  ];

  // ─── Dashboard render ─────────────────────────────────────────────────────
  return (
    <div className={`admin-dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="brand-mark">✦</span>
          {sidebarOpen && <span className="brand-name">Shiv exa</span>}
          <button className="toggle-btn" onClick={() => setSidebarOpen(p => !p)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => goToTab(item.id)}
              title={item.label}
            >
              <Icon name={item.icon} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <Icon name="logout" />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <h2>{activeTab === "order-detail" ? "Order details" : activeTab === "product-detail" ? "Product details" : navItems.find(n => n.id === activeTab)?.label || "Dashboard"}</h2>
          {message.text && (
            <div className={`toast toast-${message.type}`}>
              {message.text}
            </div>
          )}
        </header>

        <div className="admin-content">
          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              <div className="stats-row">
                <StatCard label="Total Orders" value={orders.length} color="#c9a86a" />
                <StatCard label="Total Products" value={products.length} color="#4caf50" />
                <StatCard label="Blog Posts" value={blogs.length} color="#2196f3" />
                <StatCard label="Testimonials" value={testimonials.length} color="#9c27b0" />
                <StatCard label="Newsletter" value={subscribers.length} color="#e67e22" />
              </div>

              <div className="recent-section">
                <h3>Recent Orders</h3>
                <div className="recent-table">
                  <table>
                    <thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id}>
                          <td>{o.name || o.email}</td>
                          <td>₹{o.totalAmount}</td>
                          <td><span className={`status-badge status-${(o.orderStatus || "paid").toLowerCase()}`}>{o.orderStatus || "Paid"}</span></td>
                          <td>{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan={4} className="empty-row">No orders yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="section-view">
              {loading && <div className="loading-bar">Loading...</div>}
              <div className="section-controls">
                <input className="search-input" placeholder="Search customer, email or order ID..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                <select className="filter-select" value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
                  {['all', 'Paid', 'COD', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => <option key={status} value={status}>{status === 'all' ? 'All statuses' : status}</option>)}
                </select>
                {(orderSearch || orderStatusFilter !== 'all') && <button className="btn-secondary" onClick={() => { setOrderSearch(""); setOrderStatusFilter("all"); }}>Reset</button>}
                <button className="btn-primary" onClick={exportOrders}>Export Excel</button>
              </div>
              {!loading && filteredOrders.length === 0 && <div className="empty-state">No orders match these filters.</div>}
              <div className="orders-grid">
                {filteredOrders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-top">
                      <div>
                        <span className="order-id">ORD-{order._id.slice(-6)}</span>
                        <p className="order-customer">{order.name || order.email}</p>
                      </div>
                      <span className={`status-badge status-${(order.orderStatus || "paid").toLowerCase()}`}>
                        {order.orderStatus || "Paid"}
                      </span>
                    </div>
                    <div className="order-info">
                      <p><strong>₹{order.totalAmount}</strong></p>
                      <p>{order.address}, {order.pin}</p>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-actions">
                      <select value={order.orderStatus || "Paid"} onChange={e => updateOrderStatus(order._id, e.target.value)}>
                        {["Paid","Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button className="btn-secondary" onClick={() => openOrderDetail(order)}>View details</button>
                      <button className="btn-danger" onClick={() => deleteOrder(order._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDER DETAILS ── */}
          {activeTab === "order-detail" && selectedOrder && (
            <div className="order-detail-view">
              <div className="order-detail-header">
                <button className="back-button" onClick={() => setActiveTab("orders")}>← Back to orders</button>
                <div>
                  <span className="order-id">ORD-{selectedOrder._id.slice(-6)}</span>
                  <h3>{selectedOrder.name || selectedOrder.email || "Customer order"}</h3>
                  <p>Placed {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="detail-status">
                  <span className={`status-badge status-${(selectedOrder.orderStatus || "paid").toLowerCase()}`}>{selectedOrder.orderStatus || "Paid"}</span>
                  <select value={selectedOrder.orderStatus || "Paid"} onChange={e => updateOrderStatus(selectedOrder._id, e.target.value)}>
                    {["Paid","COD","Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="order-detail-grid">
                <section className="detail-card customer-card">
                  <h4>Customer</h4>
                  <p><strong>{selectedOrder.name || "—"}</strong></p>
                  <p>{selectedOrder.email || selectedOrder.userEmail || "No email provided"}</p>
                  <p>{selectedOrder.phoneNumber || "No phone number provided"}</p>
                </section>
                <section className="detail-card">
                  <h4>Delivery address</h4>
                  <p>{selectedOrder.address || "No address provided"}</p>
                  <p>{selectedOrder.pin ? `PIN ${selectedOrder.pin}` : ""}</p>
                </section>
                <section className="detail-card">
                  <h4>Payment</h4>
                  <p><strong>{selectedOrder.orderStatus === "COD" ? "Cash on Delivery" : "Online payment"}</strong></p>
                  <p className="payment-id">{selectedOrder.paymentId || "Payment ID unavailable"}</p>
                </section>
              </div>

              <section className="detail-card order-items-card">
                <div className="items-heading"><h4>Items ordered</h4><strong>₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
                {(selectedOrder.products || []).length === 0 ? <p className="empty-row">No item details were saved for this order.</p> : (
                  <div className="order-items-list">
                    {selectedOrder.products.map((item, index) => (
                      <div className="order-line-item" key={`${item.documentId || item.id || item.title}-${index}`}>
                        {item.img ? <img src={item.img} alt={item.title || "Product"} /> : <div className="order-item-image">💡</div>}
                        <div className="order-item-name"><strong>{item.title || "Product"}</strong><span>{item.size ? `Size: ${item.size}` : "Standard size"}</span></div>
                        <span>Qty {item.quantity || 1}</span>
                        <strong>₹{Number(item.price || 0).toLocaleString("en-IN")}</strong>
                      </div>
                    ))}
                  </div>
                )}
                <div className="order-total-row"><span>Order total</span><strong>₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
              </section>
            </div>
          )}

          {/* ── PRODUCTS LIST ── */}
          {activeTab === "products" && (
            <div className="section-view">
              <div className="section-controls">
                <input
                  className="search-input" type="text"
                  placeholder="🔍 Search products by title or ID..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && <button className="btn-secondary" onClick={() => setSearchTerm("")}>Clear search</button>}
                <button className="btn-secondary" onClick={exportProducts}>Export Excel</button>
                <button className="btn-primary" onClick={() => setActiveTab("add")}>+ Add Product</button>
              </div>
              {loading && <div className="loading-bar">Loading...</div>}
              <div className="products-grid">
                {filteredProducts.map(p => (
                  <div key={p._id} className="product-card-admin">
                    {p.img && <img src={p.img} alt={p.title} className="product-thumb" />}
                    <div className="product-info">
                      <h4>{p.title}</h4>
                      <div className="product-meta">
                        <span className="price-tag">₹{p.price}</span>
                        {p.oldPrice && <span className="old-price">₹{p.oldPrice}</span>}
                        <span className="stock-tag">Stock: {p.stock ?? 0}</span>
                      </div>
                      <p className="categories">{p.categories?.join(", ") || "—"}</p>
                      <div className="product-flags">
                        {p.isNew && <span className="flag new">New</span>}
                        {p.isFeatured && <span className="flag featured">Featured</span>}
                        {p.isTrending && <span className="flag trending">Trending</span>}
                      </div>
                    </div>
                    <button className="btn-secondary product-view-btn" onClick={() => openProductDetail(p)}>View & edit</button>
                    <button className="btn-danger icon-btn" onClick={() => deleteProduct(p._id)}>🗑</button>
                  </div>
                ))}
                {filteredProducts.length === 0 && <div className="empty-state">No products found.</div>}
              </div>
            </div>
          )}

          {/* ── PRODUCT DETAILS / EDIT ── */}
          {activeTab === "product-detail" && selectedProduct && productDraft && (
            <div className="product-detail-view">
              <div className="product-detail-header">
                <button className="back-button" onClick={() => setActiveTab("products")}>← Back to products</button>
                <div>
                  <span className="order-id">PRODUCT-{selectedProduct._id.slice(-6)}</span>
                  <h3>{selectedProduct.title}</h3>
                </div>
                <span className="price-tag">₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}</span>
              </div>

              <form className="product-edit-layout" onSubmit={saveProductChanges}>
                <aside className="product-preview-panel">
                  {productDraft.img ? <img src={productDraft.img} alt={productDraft.title} /> : <div className="product-preview-empty">No image</div>}
                  <p>Changes are saved directly to MongoDB.</p>
                </aside>
                <div className="admin-form product-edit-form">
                  <div className="form-section">
                    <h3>Product information</h3>
                    <div className="form-grid">
                      <input className="form-input span-2" placeholder="Product title" value={productDraft.title} onChange={e => setProductDraft({ ...productDraft, title: e.target.value })} />
                      <textarea className="form-input span-2" rows={4} placeholder="Description" value={productDraft.description || ""} onChange={e => setProductDraft({ ...productDraft, description: e.target.value })} />
                      <input className="form-input" type="number" placeholder="Price" value={productDraft.price} onChange={e => setProductDraft({ ...productDraft, price: e.target.value })} />
                      <input className="form-input" type="number" placeholder="Old price" value={productDraft.oldPrice || ""} onChange={e => setProductDraft({ ...productDraft, oldPrice: e.target.value })} />
                      <input className="form-input" type="number" placeholder="Stock" value={productDraft.stock ?? ""} onChange={e => setProductDraft({ ...productDraft, stock: e.target.value })} />
                      <input className="form-input" placeholder="Categories (comma-separated)" value={productDraft.categoriesText} onChange={e => setProductDraft({ ...productDraft, categoriesText: e.target.value })} />
                      <input className="form-input span-2" placeholder="Sizes (for example: Small:1999:4, Large:2499:2)" value={productDraft.sizesText} onChange={e => setProductDraft({ ...productDraft, sizesText: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="recommendation-heading"><div><h3>You may also like</h3><p className="form-hint">Choose up to 8 products to show on this product page.</p></div><span className="recommendation-count">{(productDraft.recommendedProducts || []).length}/8 selected</span></div>
                    <input className="recommendation-search" placeholder="Search products to recommend..." value={editRecommendationSearch} onChange={e => setEditRecommendationSearch(e.target.value)} />
                    <div className="recommendation-picker">
                      {products.filter(item => item._id !== selectedProduct._id && item.title?.toLowerCase().includes(editRecommendationSearch.toLowerCase())).map(item => {
                        const checked = (productDraft.recommendedProducts || []).some(rec => (rec._id || rec) === item._id);
                        return <label key={item._id} className={`recommendation-option ${checked ? "selected" : ""}`}><input type="checkbox" checked={checked} disabled={!checked && (productDraft.recommendedProducts || []).length >= 8} onChange={() => setProductDraft({ ...productDraft, recommendedProducts: checked ? (productDraft.recommendedProducts || []).filter(rec => (rec._id || rec) !== item._id) : [...(productDraft.recommendedProducts || []), item._id].slice(0, 8) })} /><span>{item.title}</span></label>;
                      })}
                    </div>
                  </div>
                  <div className="form-section">
                    <h3>Images</h3>
                    <div className="form-grid">
                      {["img", "img2", "img3", "img4"].map((key, index) => <input key={key} className="form-input" placeholder={`Image ${index + 1} URL`} value={productDraft[key] || ""} onChange={e => setProductDraft({ ...productDraft, [key]: e.target.value })} />)}
                    </div>
                  </div>
                  <div className="form-section product-flags-editor">
                    <label><input type="checkbox" checked={Boolean(productDraft.isNew)} onChange={e => setProductDraft({ ...productDraft, isNew: e.target.checked })} /> New arrival</label>
                    <label><input type="checkbox" checked={Boolean(productDraft.isFeatured)} onChange={e => setProductDraft({ ...productDraft, isFeatured: e.target.checked })} /> Featured</label>
                    <label><input type="checkbox" checked={Boolean(productDraft.isTrending)} onChange={e => setProductDraft({ ...productDraft, isTrending: e.target.checked })} /> Trending</label>
                  </div>
                  <div className="form-actions"><button className="btn-primary" type="submit">Save changes</button><button className="btn-secondary" type="button" onClick={() => setActiveTab("products")}>Cancel</button></div>
                </div>
              </form>
            </div>
          )}

          {/* ── ADD PRODUCT ── */}
          {activeTab === "add" && (
            <div className="section-view">
              <form className="admin-form" onSubmit={handleAddProduct}>
                <div className="form-section product-import-panel">
                  <div>
                    <h3>Import products from Excel</h3>
                    <p className="form-hint">Download the sample first, fill the Products sheet, then upload it here. Product recommendations can use titles or product IDs.</p>
                  </div>
                  <div className="import-actions">
                    <button type="button" className="btn-secondary" onClick={downloadProductImportTemplate}>Download sample Excel</button>
                    <label className={`btn-primary import-file-button ${importingProducts ? "is-loading" : ""}`}>
                      {importingProducts ? "Importing..." : "Import Excel"}
                      <input type="file" accept=".xlsx,.xls" disabled={importingProducts} onChange={handleProductImport} />
                    </label>
                  </div>
                </div>
                <div className="form-section">
                  <h3>Basic Info</h3>
                  <div className="form-grid">
                    <input className="form-input span-2" placeholder="Product Title *" value={newProduct.title}
                      onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                    <textarea className="form-input span-2" placeholder="Description" rows={4} value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <input className="form-input" type="number" placeholder="Price (₹) *" value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                    <input className="form-input" type="number" placeholder="Old Price (₹)" value={newProduct.oldPrice}
                      onChange={e => setNewProduct({ ...newProduct, oldPrice: e.target.value })} />
                    <input className="form-input" type="number" placeholder="Stock" value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                      <input className="form-input" placeholder="Categories (comma-sep.)" value={newProduct.categories}
                      onChange={e => setNewProduct({ ...newProduct, categories: e.target.value })} />
                  </div>
                </div>

                <div className="form-section">
                  <div className="recommendation-heading"><div><h3>You may also like</h3><p className="form-hint">Choose up to 8 existing products to show on this product page.</p></div><span className="recommendation-count">{newProductRecommendations.length}/8 selected</span></div>
                  <input className="recommendation-search" placeholder="Search products to recommend..." value={addRecommendationSearch} onChange={e => setAddRecommendationSearch(e.target.value)} />
                  <div className="recommendation-picker">
                    {products.filter(item => item.title?.toLowerCase().includes(addRecommendationSearch.toLowerCase())).map(item => {
                      const checked = newProductRecommendations.includes(item._id);
                      return <label key={item._id} className={`recommendation-option ${checked ? "selected" : ""}`}><input type="checkbox" checked={checked} disabled={!checked && newProductRecommendations.length >= 8} onChange={() => setNewProductRecommendations(checked ? newProductRecommendations.filter(id => id !== item._id) : [...newProductRecommendations, item._id].slice(0, 8))} /><span>{item.title}</span></label>;
                    })}
                    {!products.length && <p className="form-hint">Load the Products section first to choose recommendations.</p>}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Images (paste URLs)</h3>
                  <div className="form-grid">
                    {["img","img2","img3","img4"].map((key, i) => (
                      <input key={key} className="form-input" placeholder={`Image ${i+1} URL`} value={newProduct[key]}
                        onChange={e => setNewProduct({ ...newProduct, [key]: e.target.value })} />
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Sizes</h3>
                  {sizeRows.map((row, i) => (
                    <div key={i} className="size-row">
                      <input className="form-input" placeholder="Size name (e.g. Small)" value={row.name}
                        onChange={e => { const u = [...sizeRows]; u[i].name = e.target.value; setSizeRows(u); }} />
                      <input className="form-input" type="number" placeholder="Price (₹)" value={row.price}
                        onChange={e => { const u = [...sizeRows]; u[i].price = e.target.value; setSizeRows(u); }} />
                      <input className="form-input" type="number" min="0" placeholder="Stock (optional)" value={row.stock}
                        onChange={e => { const u = [...sizeRows]; u[i].stock = e.target.value; setSizeRows(u); }} />
                      <button type="button" className="btn-danger icon-btn"
                        onClick={() => setSizeRows(sizeRows.filter((_, j) => j !== i))}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" onClick={() => setSizeRows([...sizeRows, { name: "", price: "", stock: "" }])}>
                    + Add Size
                  </button>
                </div>

                <div className="form-section">
                  <h3>Flags</h3>
                  <div className="checkbox-row">
                    {[["isNew","New Arrival"],["isFeatured","Featured"],["isTrending","Trending"]].map(([key, label]) => (
                      <label key={key} className="checkbox-label">
                        <input type="checkbox" checked={newProduct[key]}
                          onChange={e => setNewProduct({ ...newProduct, [key]: e.target.checked })} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">Add Product</button>
                  <button type="button" className="btn-secondary" onClick={() => setActiveTab("products")}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* ── BLOG MANAGER ── */}
          {activeTab === "blog" && (
            <div className="section-view">
              <div className="section-controls">
                <h3>{blogs.length} Published Posts</h3>
                <button className="btn-primary" onClick={() => { setEditingBlog(null); setBlogForm(emptyBlog); setActiveTab("blog-editor"); }}>
                  + New Post
                </button>
              </div>
              <div className="blogs-list">
                {blogs.map(blog => (
                  <div key={blog._id} className="blog-row">
                    {blog.coverImg && <img src={blog.coverImg} alt={blog.title} className="blog-thumb" />}
                    <div className="blog-row-info">
                      <h4>{blog.title}</h4>
                      <p>{blog.excerpt}</p>
                      <span className="blog-date">{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="blog-row-actions">
                      <button className="btn-secondary icon-btn" onClick={() => editBlog(blog)}>✏️</button>
                      <button className="btn-danger icon-btn" onClick={() => deleteBlog(blog._id)}>🗑</button>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && <div className="empty-state">No blog posts yet. Create your first post!</div>}
              </div>
            </div>
          )}

          {/* ── BLOG EDITOR ── */}
          {activeTab === "blog-editor" && (
            <div className="section-view">
              <form className="admin-form" onSubmit={handleBlogSubmit}>
                <div className="form-section">
                  <h3>{editingBlog ? "Edit Post" : "New Blog Post"}</h3>
                  <div className="form-grid">
                    <input className="form-input span-2" placeholder="Post Title *" value={blogForm.title}
                      onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} />
                    <input className="form-input span-2" placeholder="Short excerpt (shown in listing)" value={blogForm.excerpt}
                      onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} />
                    <input className="form-input" placeholder="Cover Image URL" value={blogForm.coverImg}
                      onChange={e => setBlogForm({ ...blogForm, coverImg: e.target.value })} />
                    <input className="form-input" placeholder="Author Name" value={blogForm.author}
                      onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} />
                    <input className="form-input span-2" placeholder="Tags (comma-separated)" value={blogForm.tags}
                      onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} />
                  </div>
                  {blogForm.coverImg && (
                    <div className="cover-preview">
                      <img src={blogForm.coverImg} alt="Cover Preview" />
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h3>Article Content</h3>
                  <p className="form-hint">Use blank lines to separate paragraphs. Plain text is fully supported.</p>
                  <textarea
                    className="form-input blog-textarea" rows={20} placeholder="Write your article content here..."
                    value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                  />
                </div>

                <div className="form-section">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={blogForm.isPublished}
                      onChange={e => setBlogForm({ ...blogForm, isPublished: e.target.checked })} />
                    Published (visible on website)
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">{editingBlog ? "Update Post" : "Publish Post"}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setActiveTab("blog"); setEditingBlog(null); }}>
                    Back to Blog Manager
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TESTIMONIALS ── */}
          {activeTab === "testimonials" && (
            <div className="section-view">
              <div className="testimonials-layout">
                <div className="testimonials-form-panel">
                  <form className="admin-form" onSubmit={handleTestimonialSubmit}>
                    <div className="form-section">
                      <h3>Add Testimonial</h3>
                      <div className="form-grid">
                        <input className="form-input span-2" placeholder="Customer Name *" value={testimonialForm.name}
                          onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                        <input className="form-input" placeholder="Role / Title" value={testimonialForm.role}
                          onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
                        <select className="form-input" value={testimonialForm.rating}
                          onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}>
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                        <input className="form-input span-2" placeholder="Avatar Image URL (optional)" value={testimonialForm.avatar}
                          onChange={e => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })} />
                        <textarea className="form-input span-2" rows={5} placeholder="Customer review *" value={testimonialForm.comment}
                          onChange={e => setTestimonialForm({ ...testimonialForm, comment: e.target.value })} />
                        <label className="checkbox-label span-2">
                          <input type="checkbox" checked={testimonialForm.isFeatured}
                            onChange={e => setTestimonialForm({ ...testimonialForm, isFeatured: e.target.checked })} />
                          Show this review in Client Feedback on the homepage
                        </label>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Add Testimonial</button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="testimonials-list-panel">
                  <div className="list-panel-heading"><h3>{testimonials.length} Reviews</h3><button className="btn-secondary" onClick={exportTestimonials}>Export Excel</button></div>
                  {testimonials.map(t => (
                    <div key={t._id} className="testimonial-admin-card">
                      <div className="t-header">
                        {t.avatar ? <img src={t.avatar} alt={t.name} className="t-avatar" /> : <div className="t-avatar-placeholder">{t.name.charAt(0)}</div>}
                        <div>
                          <strong>{t.name}</strong>
                          <p>{t.role}</p>
                          <span className="t-stars">{"⭐".repeat(t.rating)}</span>
                        </div>
                      </div>
                      <p className="t-comment">"{t.comment}"</p>
                      <button className="btn-danger icon-btn" onClick={() => deleteTestimonial(t._id)}>🗑 Delete</button>
                    </div>
                  ))}
                  {testimonials.length === 0 && <div className="empty-state">No testimonials yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ── NEWSLETTER ── */}
          {activeTab === "newsletter" && (
            <div className="section-view">
              {loading && <div className="loading-bar">Loading...</div>}
              <div className="newsletter-hero">
                <div>
                  <span className="newsletter-kicker">BE IN TOUCH WITH US</span>
                  <h3>Newsletter audience</h3>
                  <p>Emails collected from the homepage form, ready for your next update.</p>
                </div>
                <div className="subscriber-count">
                  <strong>{subscribers.length}</strong>
                  <span>Subscribers</span>
                </div>
              </div>
              <div className="section-controls newsletter-controls">
                <input className="search-input" placeholder="Search subscriber email..." value={subscriberSearch} onChange={e => setSubscriberSearch(e.target.value)} />
                {subscriberSearch && <button className="btn-secondary" onClick={() => setSubscriberSearch("")}>Clear search</button>}
                <button className="btn-primary" onClick={exportSubscribers}>Export Excel</button>
              </div>
              <div className="newsletter-table-card">
                <table>
                  <thead><tr><th>Subscriber</th><th>Joined</th><th></th></tr></thead>
                  <tbody>
                    {filteredSubscribers.map(subscriber => (
                      <tr key={subscriber._id}>
                        <td><span className="subscriber-avatar">{subscriber.email.charAt(0).toUpperCase()}</span>{subscriber.email}</td>
                        <td>{formatDate(subscriber.subscribedAt || subscriber.createdAt)}</td>
                        <td><button className="btn-danger icon-btn" onClick={() => deleteSubscriber(subscriber._id)}>Remove</button></td>
                      </tr>
                    ))}
                    {!loading && filteredSubscribers.length === 0 && <tr><td colSpan={3} className="empty-row">{subscribers.length ? "No subscribers match your search." : "No newsletter subscribers yet."}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
