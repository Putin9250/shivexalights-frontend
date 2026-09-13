import React from "react";
import "./Footer.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentMethodPhoto from "../../../Images/payment.png"
import { Link } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h3 className="footer-title">Shop lighting</h3>
          <ul className="footer-links">
            <li><Link className="link" to="/products?categories=chandelier">Chandeliers</Link></li>
            <li><Link className="link" to="/products?categories=Hanging%20Light">Hanging Lights</Link></li>
            <li><Link className="link" to="/products?categories=Ceiling%20Light">Ceiling Lights</Link></li>
            <li><Link className="link" to="/products?categories=LED%20Mirror%20Lights">Mirror Lights</Link></li>
            <li><Link className="link" to="/products?categories=Wall%20Light">Wall Lights</Link></li>
            <li><Link className="link" to="/products?categories=Floor%20Lamp">Floor Lamps</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All products</Link></li>
            <li><Link to="/blogs">Lighting journal</Link></li>
            <li><Link to="/about">About ShivExa</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/order">My orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">About Us</h3>
          <p className="footer-text">
            Shivexa Lighting brings together statement chandeliers, elegant hanging
            lights, mirror lights, and ambient lighting for distinctive interiors.
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
              <Link to="/contact">Contact Shivexa Lighting</Link>
            </div>
            <div className="contact-item">
              <PhoneOutlinedIcon className="contact-icon" />
              <Link to="/contact">Request a call back</Link>
            </div>
            <div className="contact-item">
              <EmailOutlinedIcon className="contact-icon" />
              <Link to="/contact">Send an enquiry</Link>
            </div>
          </div>
          <div className="payment-methods">
            <img src={ PaymentMethodPhoto} alt="Accepted payment methods" loading="lazy"/>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright-section">
            <span className="logo">Shivexa Lighting</span>
            <span className="copyright">
              © {currentYear} Shivexa Lighting. All rights reserved.
            </span>
            <div className="legal-links"><Link to="/about">About</Link><Link to="/contact">Support</Link></div>
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
