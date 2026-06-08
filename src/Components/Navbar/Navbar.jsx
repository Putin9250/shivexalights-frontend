import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import "./Navbar.scss";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      const timer = setTimeout(() => openSignIn(), 1200);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, openSignIn]);

  const cartProducts = useSelector((state) => state.cart.products);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const cartCount = cartProducts.reduce((total, item) => total + item.quantity, 0);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleSearchClick = () => {
    if (window.innerWidth <= 768) {
      setSearchPanelOpen(true);
    } else {
      setSearchActive(!searchActive);
    }
  };

  const shopCategories = [
    { name: "Ceiling Lights", path: "/products?category=ceiling" },
    { name: "Hanging Lights", path: "/products?category=hanging" },
    { name: "Floor Lamps", path: "/products?category=floor" },
    { name: "Outdoor Lighting", path: "/products?category=outdoor" },
    { name: "Humanoid Sculptures", path: "/products?category=sculpture" },
    { name: "Office & Gym", path: "/products?category=office-gym" },
    { name: "Italian Chandeliers", path: "/products?category=chandelier" },
  ];

  // ===== Tagline Carousel =====
  const taglines = [
    "Lighting that feels like poetry — soft, romantic, and utterly you.",
    "Illuminating your world with elegance and grace.",
    "Where every light tells a story.",
    "Crafted for those who adore the glow.",
  ];
  const [currentTagIndex, setCurrentTagIndex] = useState(0);
  const [tagAnimation, setTagAnimation] = useState(""); // 'out' or 'in'

  useEffect(() => {
    const interval = setInterval(() => {
      setTagAnimation("out");
      setTimeout(() => {
        setCurrentTagIndex((prev) => (prev + 1) % taglines.length);
        setTagAnimation("in");
        setTimeout(() => setTagAnimation(""), 800);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <>
      {/* ===== Top Bar ===== */}
      <div className={`top-bar ${taglineVisible ? "visible" : "hidden"}`}>
        <div className="wrapper">
          <div className="tagline-carousel">
            <span
              key={currentTagIndex}
              className={`tagline ${
                tagAnimation === "out" ? "slide-out-left" : ""
              } ${tagAnimation === "in" ? "slide-in-right" : ""}`}
            >
              {taglines[currentTagIndex]}
            </span>
          </div>
          <button
            className="close-tagline"
            onClick={() => setTaglineVisible(false)}
            aria-label="Close tagline"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* ===== Main Navbar ===== */}
      <header className="navbar">
        <div className="wrapper">
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link to="/" className="brand" onClick={closeMobileMenu}>
            <span className="brand-text">ShivExa Lights</span>
          </Link>

          <nav className="nav-links">
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
            <div
              className="shop-dropdown"
              onMouseEnter={() => setShopDropdown(true)}
              onMouseLeave={() => setShopDropdown(false)}
            >
              <span className="shop-trigger">
                Shop <span className="arrow">▾</span>
              </span>
              <div className={`dropdown-menu ${shopDropdown ? "visible" : ""}`}>
                {shopCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => {
                      setShopDropdown(false);
                      closeMobileMenu();
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/order" onClick={closeMobileMenu}>Orders</Link>
            <Link to="/products/collection" onClick={closeMobileMenu}>Collection</Link>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
          </nav>

          <div className="nav-actions">
            <div className={`search-box ${searchActive ? "active" : ""}`}>
              <input
                type="text"
                placeholder="Find your glow..."
                className="search-input"
                onBlur={() => setSearchActive(false)}
              />
              <button
                className="search-icon"
                onClick={handleSearchClick}
              >
                <SearchIcon />
              </button>
            </div>

            <button
              className="icon-btn hide-mobile"
              onClick={() => setOpenWishlist(!openWishlist)}
            >
              <FavoriteBorderOutlinedIcon />
              {wishlistProducts.length > 0 && <span className="wishlist-dot"></span>}
            </button>

            <button
              className="icon-btn cart-btn"
              onClick={() => setOpenCart(!openCart)}
            >
              <ShoppingCartOutlinedIcon />
              <span className="cart-badge">{cartCount}</span>
            </button>

            {isSignedIn ? (
              <div className="user-avatar hide-mobile">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button
                className="icon-btn hide-mobile"
                onClick={() => openSignIn()}
              >
                <PersonOutlineOutlinedIcon />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===== Mobile Menu ===== */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <span className="mobile-brand-text">ShivExa Lights</span>
          <button className="close-btn" onClick={closeMobileMenu}>
            <CloseIcon />
          </button>
        </div>
        <div className="mobile-body">
          <div className="mobile-section">
            <h4>Shop by Category</h4>
            {shopCategories.map((cat) => (
              <Link key={cat.name} to={cat.path} onClick={closeMobileMenu}>
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="mobile-section">
            <h4>Navigate</h4>
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
            <Link to="/order" onClick={closeMobileMenu}>Orders</Link>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
            <Link to="/products/Collection" onClick={closeMobileMenu}>Collection</Link>
          </div>
          <div className="mobile-section">
            <h4>Account</h4>
            <button
              className="mobile-link-btn"
              onClick={() => {
                setOpenWishlist(true);
                closeMobileMenu();
              }}
            >
              My Wishlist
            </button>
            <button
              className="mobile-link-btn"
              onClick={() => {
                setOpenCart(true);
                closeMobileMenu();
              }}
            >
              My Cart
            </button>
          </div>
        </div>
      </div>

      {/* ===== Search Panel ===== */}
      {searchPanelOpen && (
        <div className="mobile-overlay" onClick={() => setSearchPanelOpen(false)}></div>
      )}
      <div className={`search-panel ${searchPanelOpen ? "open" : ""}`}>
        <div className="search-panel-header">
          <h3>Search</h3>
          <button className="close-btn" onClick={() => setSearchPanelOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="search-panel-body">
          <input
            type="text"
            placeholder="Find your glow..."
            className="search-panel-input"
            autoFocus
          />
        </div>
      </div>

      {openCart && <Cart onClose={() => setOpenCart(false)} />}
      {openWishlist && <Wishlist onClose={() => setOpenWishlist(false)} />}
    </>
  );
};

export default Navbar;