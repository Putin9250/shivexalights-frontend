import React from "react";
import "./Footer.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Link } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h3 className="footer-title">Category</h3>
          <ul className="footer-links">
            <li>
              {" "}
              <Link className="link" to={`/products/2`}>
                Women
              </Link>
            </li>
            <li>
              <Link className="link" to={`/products/4`}>Men</Link>
            </li>
            <li>
              <Link className="link" to={`/products/10`}>Children</Link>
            </li>
            <li>
              <Link className="link" to={`/products/6`}>Accessories</Link>
            </li>
            <li>
              <Link className="link" to={`/products/12`}>New Arrivals</Link>
            </li>
            <li>
              <Link className="link" to={`/products/14`}>Sale</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/pages">Pages</a>
            </li>
            <li>
              <a href="/stores">Store Locator</a>
            </li>
            <li>
              <a href="/compare">Compare</a>
            </li>
            <li>
              <a href="/cookies">Cookie Policy</a>
            </li>
            <li>
              <a href="/returns">Returns & Exchanges</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">About Us</h3>
          <p className="footer-text">
            ShivExa Lights is your premier destination for high-quality fashion
            and accessories. We're committed to providing exceptional customer
            service and bringing you the latest trends at competitive prices.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <LocationOnOutlinedIcon className="contact-icon" />
              <span>123 Fashion Street, Style City, SC 12345</span>
            </div>
            <div className="contact-item">
              <PhoneOutlinedIcon className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <EmailOutlinedIcon className="contact-icon" />
              <span>support@shivexalights.com</span>
            </div>
          </div>
          <div className="payment-methods">
            <img src="/Images/payment.png" alt="Accepted payment methods" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright-section">
            <span className="logo">ShivExa Lights</span>
            <span className="copyright">
              © {currentYear} ShivExa Lights. All rights reserved.
            </span>
            <div className="legal-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
