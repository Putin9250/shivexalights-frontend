
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFound.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found-content">

        {/* Editorial label */}
        <span className="not-found-eyebrow">
          SHIVEXA LIGHTING EDITORIAL
        </span>

        {/* Error number */}
        <div className="not-found-number">
          <span>4</span>
          <span className="not-found-zero">0</span>
          <span>4</span>
        </div>

        {/* Main message */}
        <div className="not-found-message">
          <span className="not-found-line"></span>

          <h1>
            A Little Detour in Your Journey.
          </h1>

          <p>
            It seems the page you're looking for has slipped
            out of sight. Perhaps it's been moved, or the
            address isn't quite right.
          </p>
        </div>

        {/* Action buttons */}
        <div className="not-found-actions">
          <Link to="/" className="not-found-home">
            <span>Back to Home</span>
            {/* <span className="not-found-arrow">↗</span> */}
          </Link>

          <Link to="/collection" className="not-found-collection">
            Explore Collections
          </Link>
        </div>

        {/* Footer note */}
        <div className="not-found-footer">
          <span>GOOD LIGHTING. BEAUTIFUL LIVING.</span>
        </div>

      </div>
    </main>
  );
};

export default NotFound;
