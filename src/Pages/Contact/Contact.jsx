import "./Contact.scss";

import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("Sending message...");

    emailjs
      .sendForm(
        "service_xj74ggc",
        "template_pvfbomn",
        form.current,
        "p6OR3xZ0afJ3-rpu1"
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          form.current.reset();
          setMobile("");
          setIsSending(false);

          setTimeout(() => {
            setStatus("");
          }, 5000);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("❌ Failed to send message. Please try again.");
          setIsSending(false);

          setTimeout(() => {
            setStatus("");
          }, 5000);
        }
      );
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="contact-page">
      <div className="light light1"></div>
      <div className="light light2"></div>
      <div className="light light3"></div>

      <svg className="blob blob1" viewBox="0 0 200 200">
        <path
          fill="#00d4ff"
          d="M46.7,-63.3C59.6,-54.2,68.4,-39.9,72.9,-24.2C77.4,-8.5,77.7,8.6,72.4,24.4C67.1,40.3,56.2,54.9,42.3,64.6C28.3,74.2,11.3,78.9,-4.4,75.4C-20.1,71.9,-40.2,60.2,-54.7,45.1C-69.2,30,-78.2,11.4,-76.8,-6.1C-75.4,-23.6,-63.5,-40,-49,-49.4C-34.4,-58.9,-17.2,-61.5,0.1,-61.7C17.4,-61.9,34.9,-72.4,46.7,-63.3Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="container">
        <motion.div
          className="left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerVariants}
        >
          <motion.span className="subtitle" variants={fadeInUpVariants}>
            CONTACT US
          </motion.span>

          <motion.h1 variants={fadeInUpVariants}>
            Let's Build Something
            <span> Extraordinary</span>
          </motion.h1>

          <motion.p variants={fadeInUpVariants}>
            Have a project in mind? Need a modern website,
            ecommerce platform, portfolio, landing page,
            business solution or web application?
            Uttam Web Solution is ready to help.
          </motion.p>

          <motion.div className="info" variants={fadeInUpVariants}>
            <div className="item">
              <FaEnvelope />
              <span>uttamwebsolution@gmail.com</span>
            </div>

            <div className="item">
              <FaPhoneAlt />
              <span>+91 95825 86200</span>
            </div>

            <div className="item">
              <FaMapMarkerAlt />
              <span>
                Uttam Nagar,
                New Delhi,
                Delhi 110059,
                India
              </span>
            </div>
          </motion.div>

          <motion.div className="socials" variants={fadeInUpVariants}>
            <a
              href="https://www.linkedin.com/company/uttam-web-solution/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://x.com/uWs_offical"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaXTwitter />
            </a>
          </motion.div>
        </motion.div>

        <motion.form
          ref={form}
          onSubmit={sendEmail}
          className="form"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            required
            aria-label="Full Name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            required
            aria-label="Email Address"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10)
              )
            }
            aria-label="Mobile Number"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject *"
            required
            aria-label="Subject"
          />

          <textarea
            name="message"
            placeholder="Write your message... *"
            rows="6"
            required
            aria-label="Message"
          />

          <button type="submit" disabled={isSending} className={isSending ? "loading" : ""}>
            {isSending ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <motion.p
              className="status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {status}
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;