import React, { useEffect, useRef, useState } from "react";
import "./QuoteDivider.scss";

const QuoteDivider = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`quote-divider ${isVisible ? "visible" : ""}`} ref={ref}>
      <div className="quote-line"></div>
      <div className="quote-text">
        <p>“It's okay to feel broken;</p>
        <p>that's how the light gets in.”</p>
      </div>
      <div className="quote-brand">
        <span>@shivexalights</span>
        <div className="underscore"></div>
      </div>
    </div>
  );
};

export default QuoteDivider;