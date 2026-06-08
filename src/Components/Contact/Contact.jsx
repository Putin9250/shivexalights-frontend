import React, { useState } from "react";
import axios from "axios";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import "./Contact.scss";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/subscribe`, { email });
      setStatus({ type: "success", message: "Thanks for subscribing!" });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="wrapper">
        <span>BE IN TOUCH WITH US:</span>
        <form className="mail" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "JOIN US"}
          </button>
        </form>
        {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
        <div className="icons">
          <FacebookIcon />
          <InstagramIcon />
          <TwitterIcon />
          <GoogleIcon />
        </div>
      </div>
    </div>
  );
};

export default Contact;