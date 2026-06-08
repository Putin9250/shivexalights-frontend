import React, { useState } from "react";
import "./FAQ's.scss";

const faqData = [
  {
    q: "Do you offer custom lighting designs?",
    a: "Yes. We specialize in bespoke lighting solutions tailored to your space, style, and architectural needs.",
  },
  {
    q: "Can I request 3D visualization before purchase?",
    a: "Absolutely. Our design team provides realistic 3D previews to help you visualize lighting in your space.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we deliver across multiple countries with secure packaging and insured shipping.",
  },
  {
    q: "What materials are used in your lighting?",
    a: "We use premium materials including brass, hand-blown glass, stone, and sustainable metal finishes.",
  },
  {
    q: "Can I customize size and finish?",
    a: "Every piece can be tailored in size, finish, and tone to match your interior vision.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-label">SUPPORT</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Everything you need to know about our lighting experience.
          </p>
        </div>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {item.q}
                <span className="icon">{openIndex === index ? "−" : "+"}</span>
              </div>

              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;