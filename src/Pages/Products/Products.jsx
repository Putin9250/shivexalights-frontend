import React, { useState, useEffect } from "react";
import "./Products.scss";
import List from "../../Components/List/List";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";

const Products = () => {
  const { id } = useParams();
  const catId = id ? parseInt(id) : null;

  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState(null);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch sub‑categories for this main category – adjust relation field name if needed
  const { data, loading, error } = useFetch(
    catId ? `/sub-categories?filters[categories][id][$eq]=${catId}` : null,
  );

  console.log("SubCategories:", data); // check structure in console

  const handleSubCatChange = (subCatId) => {
    setSelectedSubCats((prev) =>
      prev.includes(subCatId)
        ? prev.filter((id) => id !== subCatId)
        : [...prev, subCatId],
    );
  };

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFilters = () => setShowFilters((prev) => !prev);
  const closeFilters = () => setShowFilters(false);

  // Close filters when clicking outside on mobile
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

  return (
    <div className="products">
      {isMobile && (
        <button className="mobile-filters-toggle" onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      )}

      <div className={`left ${isMobile && !showFilters ? "collapsed" : ""}`}>
        {isMobile && showFilters && (
          <button
            className="close-filters-btn"
            onClick={closeFilters}
            aria-label="Close filters"
          />
        )}

        {/* Sub‑categories filter */}
        <div className="filterItem">
          <h2>Product Categories</h2>
          {loading && <p>Loading categories...</p>}
          {error && <p>Error loading categories</p>}
          {data?.map((item) => {
            // Determine title based on API response structure
            const title = item.attributes?.title || item.title || "Unnamed";
            return (
              <div className="inputItem" key={item.id}>
                <input
                  type="checkbox"
                  id={`subcat-${item.id}`}
                  checked={selectedSubCats.includes(item.id)}
                  onChange={() => handleSubCatChange(item.id)}
                />
                <label htmlFor={`subcat-${item.id}`}>{item.title}</label>
              </div>
            );
          })}
        </div>

        {/* Price range filter */}
        <div className="filterItem">
          <h2>Filter by price</h2>
          <div className="inputItem">
            <div className="price-labels">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Sort options */}
        <div className="filterItem">
          <h2>Sort by</h2>
          <div className="inputItem">
            <input
              type="radio"
              name="price"
              id="asc"
              checked={sort === "asc"}
              onChange={() => setSort("asc")}
            />
            <label htmlFor="asc">Price (Lowest First)</label>
          </div>
          <div className="inputItem">
            <input
              type="radio"
              name="price"
              id="desc"
              checked={sort === "desc"}
              onChange={() => setSort("desc")}
            />
            <label htmlFor="desc">Price (Highest First)</label>
          </div>
          <div className="inputItem">
            <input
              type="radio"
              name="price"
              id="none"
              checked={sort === null}
              onChange={() => setSort(null)}
            />
            <label htmlFor="none">Default</label>
          </div>
        </div>

        {isMobile && showFilters && (
          <button className="apply-filters-btn" onClick={closeFilters}>
            Apply Filters
          </button>
        )}
      </div>

      <div className="right">
        <img
          className="catImg"
          src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Category"
          loading="lazy"
        />
        {catId ? (
          <List
            catId={catId}
            subCatIds={selectedSubCats}
            maxPrice={maxPrice}
            sort={sort}
          />
        ) : (
          <p>Invalid category</p>
        )}
      </div>
    </div>
  );
};

export default Products;
