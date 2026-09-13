import React, { useEffect, useRef, useState } from "react";
import "./LocateUs.scss";

const LocateUs = () => {
  const mapLink = "https://maps.app.goo.gl/PC8B2rEH3dyBRkf29";
  const address = "4A, 21, Tilak Nagar, Delhi, 110018";
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
                <p><a href={mapLink} target="_blank" rel="noopener noreferrer">{address}</a></p>
              </div>
              <div className="detail">
                <span className="detail-label">Phone</span>
                <p><a href="tel:+917428277019">+91 7428 277 019</a></p>
              </div>
              <div className="detail">
                <span className="detail-label">Email</span>
                <p><a href="mailto:roysakshi037@gmail.com">roysakshi037@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side – Google Map embed */}
        <div className={`locate-map ${isVisible ? "animate" : ""}`}>
          <div className="map-wrapper">
            <iframe
              title="Shivexa Lighting Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6950531416805!2d77.09881820000001!3d28.6389003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05700119385f%3A0x3e9588d681367092!2sShivexa%20Lighting!5e0!3m2!1sen!2sin!4v1789295831402!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocateUs;
