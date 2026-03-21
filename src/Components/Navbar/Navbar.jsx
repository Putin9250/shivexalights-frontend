import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import India from "../../../Images/India.svg";
import {
  SignInButton,
  useClerk,
  useUser,
  UserButton,
} from "@clerk/clerk-react";
import "./Navbar.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import Wishlist from "../Wishlist/Wishlist";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  const { openSignIn } = useClerk();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      const timer = setTimeout(() => {
        openSignIn();
      }, 1000); // slight delay feels natural

      return () => clearTimeout(timer);
    }
  }, [isSignedIn, openSignIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const products = useSelector((state) => state.cart.products);
  const wishlist = useSelector((state) => state.wishlist.products);
  const count = products.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div className="navbar">
        <div className="wrapper">
          {/* Hamburger */}
          <div className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </div>

          <div className="left">
            <div className="item">
              <img src={India} alt="India Flag" className="indi" />
              <KeyboardArrowDownIcon />
            </div>
            <div className="item">
              <span>IND</span>
              <KeyboardArrowDownIcon />
            </div>
            <div className="item">
              <Link className="link" to="/products/2" onClick={closeMenu}>
                Women
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/products/4" onClick={closeMenu}>
                Men
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/products/10" onClick={closeMenu}>
                Children
              </Link>
            </div>
          </div>

          <div className="center">
            <Link className="link" to="/" onClick={closeMenu}>
              ShivExa Lights
            </Link>
          </div>

          <div className="right">
            <div className="item">
              <Link className="link" to="/" onClick={closeMenu}>
                HomePage
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/about" onClick={closeMenu}>
                About
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/products/21" onClick={closeMenu}>
                Store
              </Link>
            </div>
            <div className="item">
              <Link className="link" to="/order" onClick={closeMenu}>
                Orders
              </Link>
            </div>

            {/* 🌕 Icons */}
            <div className="icons">
              {isSignedIn ? (
                <div className="profile-wrapper">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="profile-wrapper" onClick={() => openSignIn()}>
                  <PersonOutlineOutlinedIcon className="profile-icon" />
                </div>
              )}

              <div
                className="wishlistIcon"
                onClick={() => setOpenWishlist(!openWishlist)}
              >
                <FavoriteBorderOutlinedIcon />
                {wishlist.length > 0 && <span className="dot"></span>}
              </div>

              <div className="cartIcon" onClick={() => setOpenCart(!openCart)}>
                <ShoppingCartOutlinedIcon />
                <span>{count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-user">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div onClick={() => openSignIn()}>
                <PersonOutlineOutlinedIcon />
              </div>
            )}

            {/* 🌕 Step 6: Hello Name */}
            <span>
              {isSignedIn
                ? `Hello, ${user?.firstName || "User"}`
                : "Hello, Sign In"}
            </span>
          </div>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            <h3>Shop by Category</h3>
            <div className="mobile-menu-item">
              <Link to="/products/2" onClick={closeMenu}>
                Women
              </Link>
            </div>
            <div className="mobile-menu-item">
              <Link to="/products/4" onClick={closeMenu}>
                Men
              </Link>
            </div>
            <div className="mobile-menu-item">
              <Link to="/products/10" onClick={closeMenu}>
                Children
              </Link>
            </div>
          </div>

          <div className="mobile-menu-section">
            <h3>Navigation</h3>
            <div className="mobile-menu-item">
              <Link to="/" onClick={closeMenu}>
                HomePage
              </Link>
            </div>
            <div className="mobile-menu-item">
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </div>
            <div className="mobile-menu-item">
              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </div>
            <div className="mobile-menu-item">
              <Link to="/products/21" onClick={closeMenu}>
                Stores
              </Link>
            </div>
          </div>

          <div className="mobile-menu-section">
            <h3>Account</h3>
            <div className="mobile-menu-item">
              <div
                className="mobile-wishlist-trigger"
                onClick={() => {
                  setOpenWishlist(true);
                  closeMenu();
                }}
              >
                <span>My Wishlist</span>
              </div>
            </div>
            <div className="mobile-menu-item">
              <Link to="/order" onClick={closeMenu}>
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {openCart && <Cart onClose={() => setOpenCart(false)} />}
      {openWishlist && <Wishlist onClose={() => setOpenWishlist(false)} />}
    </>
  );
};

export default Navbar;
