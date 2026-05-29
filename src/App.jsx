import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Product from "./Pages/Product/Product";
import Products from "./Pages/Products/Products";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Hooks/useScrollToTop";
import Checkout from "./Components/Checkout/Checkout";
import Orders from "./Components/Order/Order";

import "./App.scss";

const Layout = () => {
  ScrollToTop();
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/products",
        element: <Products />, // ✅ THIS FIXES YOUR ERROR
      },
      {
        path: "/products/:id",
        element: <Products />,
      },
      {
        path: "/product/:id",
        element: <Product key={window.location.pathname} />,
      },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order", element: <Orders /> },
    ],
  },
  {
    path: "/products/:id",
    element: <Products />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
