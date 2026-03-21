import React from "react";
import "./TrendingProducts.scss";
import Cards from "../Cards/Cards";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import useFetch from "../../Hooks/useFetch";
import { Link } from "react-router-dom";

const TrendingProducts = () => {
  const { data, loading, error } = useFetch(
    "/products?populate=*&[filters][type][$eq]=trending"
  );

  const handleViewAll = () => {
    window.location.href = "/products/trending";
  };

  return (
    <section className="trending-products-section">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <div className="section-badge">
              <LocalFireDepartmentIcon className="badge-icon" />
              <span>Hot & Trending</span>
            </div>
            <h2 className="section-title">
              Trending <span className="highlight">Now</span>
            </h2>
            <p className="section-description">
              Explore what's popular right now. These items are flying off the
              shelves and loved by our customers worldwide.
            </p>
          </div>
          <button className="view-all-btn" >
            <Link to={`/products/16`} className="link">
            View All Trending</Link>
            <EastOutlinedIcon className="arrow-icon" />
          </button>
        </div>

        <div className="products-grid">
          {loading && <p>Loading trending products...</p>}
          {error && <p>Failed to load trending products.</p>}
          {data?.map((item) => (
            <Cards item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;