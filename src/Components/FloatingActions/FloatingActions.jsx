import React, { useState, useEffect } from "react";
import "./FloatingActions.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WHATSAPP_NUMBER = "917428277019"; // ← replace with your number (country code + number, no + or spaces)
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about your lighting products.";

const FloatingActions = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="floating-actions">
        {/* Scroll to top — appears after scrolling 300px */}
      <button
        className={`fab fab--top ${showScroll ? "fab--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <KeyboardArrowUpIcon />
      </button>
      {/* WhatsApp — always visible */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab--whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>

    </div>
  );
};

export default FloatingActions;