import React, { lazy, Suspense, useEffect } from "react";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Hooks/useScrollToTop";
import FloatingActions from "./Components/FloatingActions/FloatingActions";
import SEO from "./Components/SEO/SEO";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import "./App.scss";

// ── Lazy‑load all pages ──────────────────────────────────────────────────
const Home = lazy(() => import("./Pages/Home/Home"));
const Product = lazy(() => import("./Pages/Product/Product"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Checkout = lazy(() => import("./Components/Checkout/Checkout"));
const Orders = lazy(() => import("./Components/Order/Order"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const About = lazy(() => import("./Pages/About/About"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogDetail = lazy(() => import("./Pages/Blog/BlogDetail"));

// ── Loading skeleton ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh",
      fontFamily: "'Josefin Sans', sans-serif",
      color: "#c9a96e",
      fontSize: "14px",
      letterSpacing: "3px",
      textTransform: "uppercase",
    }}
  >
    <span>Loading…</span>
  </div>
);

// ── Backend warm-up ping to prevent Render cold-start delay ──────────────
const warmUpBackend = () => {
  const API = import.meta.env.VITE_API_URL;
  if (!API) return;
  const cachePrefix = "shivexa_cache_";
  const endpoints = [
    "/products?category=chandelier&limit=12",
    "/products?featured=true&limit=8",
    "/products?trending=true&limit=12",
    "/products?category=Duplex%20Hanging%20Light&limit=12",
    "/products?category=LED%20Mirror%20Lights&limit=12",
    "/testimonials",
  ];
  fetch(`${API}/health`, { method: "GET" }).catch(() => {});
  endpoints.forEach((endpoint) => {
    const cacheKey = cachePrefix + endpoint;
    if (sessionStorage.getItem(cacheKey)) return;
    fetch(`${API}${endpoint}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data)); })
      .catch(() => {});
  });
};

// ── Public layout (Navbar + Footer) ──────────────────────────────────────
const Layout = () => {
  ScrollToTop();
  useEffect(() => {
    warmUpBackend();
  }, []);
  return (
    <div className="app">
      <SEO />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
      <FloatingActions />
    </div>
  );
};

// ── Admin layout (NO Navbar, NO Footer) ──────────────────────────────────
const AdminLayout = () => {
  ScrollToTop();
  return (
    <Suspense fallback={<PageLoader />}>
      <SEO noIndex />
      <Outlet />
    </Suspense>
  );
};

// ── Router definition ────────────────────────────────────────────────────
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <Products /> },
      { path: "product/:id", element: <Product /> },
      { path: "checkout", element: <Checkout /> },
      { path: "contact", element: <Contact /> },
      { path: "Contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: "About", element: <About /> },
      { path: "order", element: <Orders /> },
      { path: "blogs", element: <Blog /> },
      { path: "blog/:id", element: <BlogDetail /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPanel /> },
    ],
  },
]);

// ── App entry ────────────────────────────────────────────────────────────
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
