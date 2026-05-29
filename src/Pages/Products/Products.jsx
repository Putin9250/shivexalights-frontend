import React, { useState, useEffect } from "react";
import "./Products.scss";
import List from "../../Components/List/List";
import { useLocation } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";

const Products = () => {
  const location = useLocation();

  // ✅ Works for both hash & normal routing
  const queryString = location.hash.includes("?")
    ? location.hash.split("?")[1]
    : location.search;

  const params = new URLSearchParams(queryString);

  const category = params.get("category")
    ? decodeURIComponent(params.get("category")).toLowerCase().trim()
    : null;

  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState(null);
  const [selectedSubCats, setSelectedSubCats] = useState([]);

  // 🌿 MOBILE STATES
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data = [] } = useFetch("/products");

  // 🌿 RESPONSIVE CHECK
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerWidth >= 768) {
        setShowFilters(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFilters = () => setShowFilters((prev) => !prev);
  const closeFilters = () => setShowFilters(false);

  // 🌿 CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMobile &&
        showFilters &&
        !e.target.closest(".left") &&
        !e.target.closest(".mobile-filters-toggle")
      ) {
        closeFilters();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobile, showFilters]);

  // 🌿 FILTER LOGIC
  let filteredProducts = data.filter((item) => {
    const productCategories = Array.isArray(item.categories)
      ? item.categories.map((c) => c.toLowerCase().trim())
      : [];

    const productSubCategories = item.subCategories || [];
    const productPrice = item.price || 0;

    const matchCategory = category
      ? productCategories.includes(category)
      : true;

    const matchSubCategory =
      selectedSubCats.length > 0
        ? selectedSubCats.some((sub) =>
            productSubCategories.includes(sub)
          )
        : true;

    const matchPrice = productPrice <= maxPrice;

    return matchCategory && matchSubCategory && matchPrice;
  });

  // 🌿 SORT
  if (sort === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const subCategories = [
    ...new Set(data.flatMap((item) => item.subCategories || [])),
  ];

  return (
    <div className="products">
      {/* 🌿 MOBILE TOGGLE BUTTON */}
      {isMobile && (
        <button className="mobile-filters-toggle" onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      )}

      {/* 🌿 FILTER SIDEBAR */}
      <div className={`left ${isMobile && !showFilters ? "collapsed" : ""}`}>
        {/* ❌ CLOSE BUTTON */}
        {isMobile && showFilters && (
          <button
            className="close-filters-btn"
            onClick={closeFilters}
          />
        )}

        <div className="filterItem">
          <h2>Sub Categories</h2>

          {subCategories.map((sub, i) => (
            <div key={i} className="inputItem">
              <input
                type="checkbox"
                id={sub}
                checked={selectedSubCats.includes(sub)}
                onChange={() =>
                  setSelectedSubCats((prev) =>
                    prev.includes(sub)
                      ? prev.filter((s) => s !== sub)
                      : [...prev, sub]
                  )
                }
              />
              <label htmlFor={sub}>{sub}</label>
            </div>
          ))}
        </div>

        <div className="filterItem">
          <h2>Price</h2>
          0
          <input
            type="range"
            min={0}
            max={5000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />5000
        </div>

        <div className="filterItem">
          <h2>Sort</h2>

          <div>
            <input
              type="radio"
              name="price"
              onChange={() => setSort("asc")}
            />
            <label>Low → High</label>
          </div>

          <div>
            <input
              type="radio"
              name="price"
              onChange={() => setSort("desc")}
            />
            <label>High → Low</label>
          </div>
        </div>

        {/* ✅ APPLY BUTTON (MOBILE) */}
        {isMobile && showFilters && (
          <button className="apply-filters-btn" onClick={closeFilters}>
            Apply Filters
          </button>
        )}
      </div>

      {/* 🌿 PRODUCTS SECTION */}
      <div className="right">
        <img
          className="catImg"
          src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg"
          alt=""
        />

        <List products={filteredProducts} />
      </div>
    </div>
  );
};

export default Products;