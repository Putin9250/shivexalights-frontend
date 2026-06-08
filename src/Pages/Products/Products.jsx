import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import List from "../../Components/List/List";
import "./Products.scss";

import SlidersIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialCategories = queryParams.get("categories")?.split(",").filter(Boolean) || [];
  const initialMinPrice = parseInt(queryParams.get("minPrice")) || 0;
  const initialMaxPrice = parseInt(queryParams.get("maxPrice")) || 500000;
  const initialSort = queryParams.get("sort") || "";

  const { data: allProducts = [], loading, error } = useFetch("/products");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [priceRange, setPriceRange] = useState({ min: initialMinPrice, max: initialMaxPrice });
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [sortOption, setSortOption] = useState(initialSort);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_VISIBLE = 5;

  const categories = useMemo(() => {
    const cats = new Set();
    allProducts.forEach(p => p.categories?.forEach(c => cats.add(c)));
    return Array.from(cats);
  }, [allProducts]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, INITIAL_VISIBLE);

  // Filtering
  useEffect(() => {
    let filtered = [...allProducts];
    if (selectedCategories.length) {
      filtered = filtered.filter(p => p.categories?.some(cat => selectedCategories.includes(cat)));
    }
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (sortOption === "asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "desc") filtered.sort((a, b) => b.price - a.price);
    setFilteredProducts(filtered);
    setVisibleCount(12);
  }, [allProducts, selectedCategories, priceRange, sortOption]);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (priceRange.min > 0) params.set("minPrice", priceRange.min);
    if (priceRange.max < 500000) params.set("maxPrice", priceRange.max);
    if (sortOption) params.set("sort", sortOption);
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCategories, priceRange, sortOption, navigate]);

  const handleLoadMore = () => setVisibleCount(prev => prev + 12);
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 500000 });
    setSortOption("");
  };

  const ActiveFilters = () => (
    <div className="active-filters">
      {selectedCategories.map(cat => (
        <span key={cat} className="chip">
          {cat}
          <button onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}>
            <CloseIcon />
          </button>
        </span>
      ))}
      {(priceRange.min > 0 || priceRange.max < 500000) && (
        <span className="chip">
          ₹{priceRange.min.toLocaleString()} – ₹{priceRange.max.toLocaleString()}
          <button onClick={() => setPriceRange({ min: 0, max: 500000 })}><CloseIcon /></button>
        </span>
      )}
      {sortOption && (
        <span className="chip">
          {sortOption === "asc" ? "Low → High" : "High → Low"}
          <button onClick={() => setSortOption("")}><CloseIcon /></button>
        </span>
      )}
      {(selectedCategories.length || priceRange.min > 0 || priceRange.max < 500000 || sortOption) && (
        <button className="clear-all" onClick={clearAllFilters}>Clear all</button>
      )}
    </div>
  );

  if (loading) return <div className="products-loading">Loading products...</div>;
  if (error) return <div className="products-error">Failed to load products.</div>;

  return (
    <div className="products-page">
      {/* Desktop Filter Sidebar */}
      <aside className="filter-sidebar">
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="clear-all-desktop" onClick={clearAllFilters}>Clear all</button>
        </div>

        {/* Categories */}
        <div className="filter-group">
          <h4>Categories</h4>
          <div className="filter-options">
            {visibleCategories.map(cat => (
              <label key={cat} className={selectedCategories.includes(cat) ? "active" : ""}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => {
                    if (selectedCategories.includes(cat))
                      setSelectedCategories(prev => prev.filter(c => c !== cat));
                    else
                      setSelectedCategories(prev => [...prev, cat]);
                  }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
          {categories.length > INITIAL_VISIBLE && (
            <button className="expand-btn" onClick={() => setShowAllCategories(!showAllCategories)}>
              {showAllCategories ? <><ExpandLessIcon /> Show less</> : <><ExpandMoreIcon /> Show {categories.length - INITIAL_VISIBLE} more</>}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-range-row">
            <div className="price-slider">
              <span>Min: ₹{priceRange.min.toLocaleString()}</span>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={priceRange.min}
                onChange={e => setPriceRange(prev => ({ ...prev, min: +e.target.value }))}
              />
            </div>
            <div className="price-slider">
              <span>Max: ₹{priceRange.max.toLocaleString()}</span>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={priceRange.max}
                onChange={e => setPriceRange(prev => ({ ...prev, max: +e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <h4>Sort by price</h4>
          <div className="filter-options">
            <label>
              <input type="radio" name="sort" checked={sortOption === "asc"} onChange={() => setSortOption("asc")} />
              <span>Low to High</span>
            </label>
            <label>
              <input type="radio" name="sort" checked={sortOption === "desc"} onChange={() => setSortOption("desc")} />
              <span>High to Low</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="products-main">
        <div className="products-header">
          <div className="header-left">
            <h1>Our Collection</h1>
            <p className="product-count">{filteredProducts.length} products found</p>
          </div>
          <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
            <SlidersIcon /> <span>Filter</span>
          </button>
        </div>

        <ActiveFilters />

        {filteredProducts.length === 0 ? (
          <div className="no-products">No products found. Try adjusting your filters.</div>
        ) : (
          <>
            <List products={visibleProducts} />
            {hasMore && (
              <div className="load-more">
                <button onClick={handleLoadMore}>Load more products</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Sheet */}
      {showMobileFilter && (
        <>
          <div className="mobile-overlay" onClick={() => setShowMobileFilter(false)} />
          <div className="mobile-filter-sheet">
            <div className="sheet-header">
              <h3>Filter & Sort</h3>
              <button onClick={() => setShowMobileFilter(false)}><CloseIcon /></button>
            </div>
            <div className="sheet-content">
              {/* Categories */}
              <div className="filter-group">
                <h4>Categories</h4>
                <div className="filter-options">
                  {visibleCategories.map(cat => (
                    <label key={cat}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => {
                          if (selectedCategories.includes(cat))
                            setSelectedCategories(prev => prev.filter(c => c !== cat));
                          else
                            setSelectedCategories(prev => [...prev, cat]);
                        }}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
                {categories.length > INITIAL_VISIBLE && (
                  <button className="expand-btn" onClick={() => setShowAllCategories(!showAllCategories)}>
                    {showAllCategories ? "Show less" : `Show ${categories.length - INITIAL_VISIBLE} more`}
                  </button>
                )}
              </div>
              {/* Price Range */}
              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <label>Min: ₹{priceRange.min.toLocaleString()}</label>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={5000}
                    value={priceRange.min}
                    onChange={e => setPriceRange(prev => ({ ...prev, min: +e.target.value }))}
                  />
                  <label>Max: ₹{priceRange.max.toLocaleString()}</label>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={5000}
                    value={priceRange.max}
                    onChange={e => setPriceRange(prev => ({ ...prev, max: +e.target.value }))}
                  />
                </div>
              </div>
              {/* Sort */}
              <div className="filter-group">
                <h4>Sort by price</h4>
                <div className="filter-options">
                  <label><input type="radio" name="mobile-sort" checked={sortOption === "asc"} onChange={() => setSortOption("asc")} /><span>Low to High</span></label>
                  <label><input type="radio" name="mobile-sort" checked={sortOption === "desc"} onChange={() => setSortOption("desc")} /><span>High to Low</span></label>
                </div>
              </div>
            </div>
            <div className="sheet-footer">
              <button className="clear-filters" onClick={clearAllFilters}>Clear all</button>
              <button className="apply-filters" onClick={() => setShowMobileFilter(false)}>Apply</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;