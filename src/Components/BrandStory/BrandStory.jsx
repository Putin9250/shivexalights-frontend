// ShivexaLightsBrandStory.jsx
import React from "react";
import { motion } from "framer-motion";
import "./BrandStory.scss";

// Animation variants for fade-up effect
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const ShivexaLightsBrandStory = () => {
  return (
    <section className="brand-story">
      <div className="brand-story__grid">
        {/* LEFT COLUMN - MEDIA */}
        <motion.div
          className="brand-story__media"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="brand-story__media-inner">
            {/* Decorative overlapping black rounded rectangles */}
            <div className="brand-story__decor-shape brand-story__decor-shape--1"></div>
            <div className="brand-story__decor-shape brand-story__decor-shape--2"></div>
            <div className="brand-story__decor-shape brand-story__decor-shape--3"></div>

            {/* Floating glow effect behind image */}
            <div className="brand-story__floating-glow"></div>

            {/* Main image with zoom hover effect */}
            <div className="brand-story__image-wrapper">
              <img
                src="https://images.openai.com/static-rsc-4/f5jGO3On0xA9zJUes4vngTNAgSIM5gN0i82LngzcjzBS0OALpygQ3GBLic0bvk_Qc_0-JalWKBJTyW92INsZUIeKvUqUDsoJ2EVjU2YCHzT1Y27pLAZyKgzEVjRPSIqGQAZirUWt-IZAP0TNJf98jiQVxE6QSwS3ZYp4MnBqAeU6tRkYNLQQbi8T2FO9aP94?purpose=fullsize"
                alt="Luxury interior with elegant Shivexa pendant lighting and warm ambiance"
                className="brand-story__image"
              />
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - CONTENT */}
        <motion.div
          className="brand-story__content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUpVariants} className="brand-story__label">
            <span className="brand-story__label-text">BRAND STORY</span>
            <div className="brand-story__label-line"></div>
          </motion.div>

          <motion.h2
            variants={fadeUpVariants}
            className="brand-story__headline"
          >
            Illuminating Spaces.
            <br />
            Inspiring Experiences.
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className="brand-story__paragraph"
          >
            At Shivexa Lights, we believe lighting is more than illumination—it
            is atmosphere, emotion, and design working together to transform a
            space.
          </motion.p>

          <motion.p
            variants={fadeUpVariants}
            className="brand-story__paragraph"
          >
            Born from a passion for craftsmanship and innovation, Shivexa Lights
            creates lighting solutions that blend timeless elegance with
            contemporary aesthetics. Every fixture is carefully designed to
            enhance homes, hospitality spaces, offices, and architectural
            environments.
          </motion.p>

          <motion.p
            variants={fadeUpVariants}
            className="brand-story__paragraph"
          >
            From statement chandeliers to minimalist pendant lights and
            decorative wall fixtures, our collections combine premium materials,
            modern technology, and artistic excellence.
          </motion.p>

          <motion.p
            variants={fadeUpVariants}
            className="brand-story__paragraph brand-story__paragraph--last"
          >
            We are committed to creating lighting that not only brightens spaces
            but elevates everyday living through warmth, beauty, and
            sophistication.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="brand-story__signature"
          >
            <div className="brand-story__signature-line"></div>
            <span>Shivexa Lights</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShivexaLightsBrandStory;
