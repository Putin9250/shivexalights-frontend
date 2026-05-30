import "./About.scss";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaHome,
  FaAward,
  FaShippingFast,
  FaStore,
  FaUsers,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      <div className="light light1"></div>
      <div className="light light2"></div>
      <div className="light light3"></div>

      {/* HERO */}

      <section className="hero">
        <motion.span
          className="tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          SHIVEXA LIGHTS
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Lighting Spaces,
          <span> Creating Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          At Shivexa Lights, we believe lighting is more than illumination.
          It defines mood, enhances design, and transforms everyday spaces
          into beautiful experiences.
        </motion.p>
      </section>

      {/* STORY */}

      <section className="story">
        <div className="left">
          <h2>Who We Are</h2>

          <p>
            Shivexa Lights is dedicated to bringing modern, stylish and
            high-quality lighting solutions to homes, offices and commercial
            spaces.
          </p>

          <p>
            From elegant chandeliers and decorative wall lights to contemporary
            ceiling fixtures and LED solutions, our collection is curated to
            combine functionality with aesthetics.
          </p>

          <p>
            Every product is selected with a focus on quality, durability,
            innovation and timeless design.
          </p>
        </div>

        <div className="right">
          <div className="glass-card">
            <FaLightbulb />
            <h3>Premium Lighting</h3>
          </div>

          <div className="glass-card">
            <FaHome />
            <h3>Modern Interiors</h3>
          </div>

          <div className="glass-card">
            <FaAward />
            <h3>Quality Products</h3>
          </div>

          <div className="glass-card">
            <FaShippingFast />
            <h3>Reliable Delivery</h3>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="stats">
        <div className="stat">
          <h2>500+</h2>
          <p>Lighting Designs</p>
        </div>

        <div className="stat">
          <h2>1000+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat">
          <h2>100%</h2>
          <p>Quality Focused</p>
        </div>

        <div className="stat">
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>
      </section>

      {/* MISSION */}

      <section className="vision">
        <div className="card">
          <FaStore />

          <h2>Our Mission</h2>

          <p>
            To provide elegant and reliable lighting solutions that enhance
            living spaces while delivering exceptional value and customer
            satisfaction.
          </p>
        </div>

        <div className="card">
          <FaUsers />

          <h2>Our Vision</h2>

          <p>
            To become a trusted destination for innovative lighting products,
            helping people create brighter, more inspiring spaces across India.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE */}

      <section className="why-us">
        <h2>Why Choose Shivexa Lights?</h2>

        <div className="grid">
          <div className="box">
            <h3>Modern Collection</h3>
            <p>
              Carefully curated products designed for contemporary interiors.
            </p>
          </div>

          <div className="box">
            <h3>Trusted Quality</h3>
            <p>
              Every product undergoes strict quality standards before reaching customers.
            </p>
          </div>

          <div className="box">
            <h3>Affordable Luxury</h3>
            <p>
              Premium aesthetics without premium pricing.
            </p>
          </div>

          <div className="box">
            <h3>Customer First</h3>
            <p>
              Dedicated support to ensure a smooth shopping experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 