import React, { lazy, Suspense } from "react";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Hooks/useScrollToTop";
import "./App.scss";

// ── Lazy‑load all pages ──────────────────────────────────────────────────
const Home = lazy(() => import("./Pages/Home/Home"));
const Product = lazy(() => import("./Pages/Product/Product"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Checkout = lazy(() => import("./Components/Checkout/Checkout"));
const Orders = lazy(() => import("./Components/Order/Order"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const About = lazy(() => import("./Pages/About/About"));

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

// ── Layout wrapper ───────────────────────────────────────────────────────
const Layout = () => {
  ScrollToTop();
  return (
    <div className="app">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
};

// ── Router definition ────────────────────────────────────────────────────
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <Product />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "Contact",
        element: <Contact />,
      },
      {
        path: "About",
        element: <About />,
      },
      {
        path: "order",
        element: <Orders />,
      },
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