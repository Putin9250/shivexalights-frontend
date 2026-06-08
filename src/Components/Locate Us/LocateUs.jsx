import React, { useEffect, useRef, useState } from "react";
import "./LocateUs.scss";

const LocateUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="locate-us" ref={sectionRef}>
      <div className="locate-container">
        {/* Left side – editorial text */}
        <div className={`locate-text ${isVisible ? "animate" : ""}`}>
          <div className="text-inner">
            <span className="label">Visit Our Studio</span>
            <h2 className="title">Find Our Space</h2>
            <p className="description">
              Experience the interplay of light and shadow in person. Our doors are open
              for design consultations, private viewings, and immersive installations.
            </p>
            <div className="contact-details">
              <div className="detail">
                <span className="detail-label">Address</span>
                <p>27, Lavender Lane, New Delhi – 110016, India</p>
              </div>
              <div className="detail">
                <span className="detail-label">Phone</span>
                <p>+91 11 4663 8200</p>
              </div>
              <div className="detail">
                <span className="detail-label">Email</span>
                <p>studio@shivexalights.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side – Google Map embed */}
        <div className={`locate-map ${isVisible ? "animate" : ""}`}>
          <div className="map-wrapper">
            <iframe
              title="ShivExa Lights Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.744188375844!2d77.21637131508224!3d28.613589782421673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9b2b8b7%3A0x7e4e8b1b7b2b8b7!2sConnaught%20Place%2C%20New%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocateUs;