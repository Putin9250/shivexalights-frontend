import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import makeRequest from "../../makeRequest";
import List from "../../Components/List/List";
import "./Products.scss";

import SlidersIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const LIMIT = 12;
const INITIAL_VISIBLE = 5;

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams       = new URLSearchParams(location.search);
  const initialCategories = queryParams.get("categories")?.split(",").filter(Boolean) || [];
  const initialMinPrice   = parseInt(queryParams.get("minPrice")) || 0;
  const initialMaxPrice   = parseInt(queryParams.get("maxPrice")) || 500000;
  const initialSort       = queryParams.get("sort") || "";

  // ── filter state ──────────────────────────────────────────────────────────
  const [priceRange,         setPriceRange]         = useState({ min: initialMinPrice, max: initialMaxPrice });
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [sortOption,         setSortOption]         = useState(initialSort);
  const [showAllCategories,  setShowAllCategories]  = useState(false);
  const [showMobileFilter,   setShowMobileFilter]   = useState(false);

  // ── data state ────────────────────────────────────────────────────────────
  const [products,      setProducts]      = useState([]);
  const [total,         setTotal]         = useState(0);
  const [hasMore,       setHasMore]       = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [page,          setPage]          = useState(1);
  const [allCategories, setAllCategories] = useState([]);

  // keep page in a ref so loadMore can read it without stale closure
  const pageRef = useRef(1);

  // ── fetch sidebar categories once ─────────────────────────────────────────
  useEffect(() => {
    makeRequest.get("/products?limit=100")
      .then(res => {
        const cats = new Set();
        (res.data?.products || []).forEach(p =>
          p.categories?.forEach(c => cats.add(c))
        );
        setAllCategories(Array.from(cats));
      })
      .catch(() => {});
  }, []);

  // ── re-fetch from page 1 whenever filters change ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedCategories.length === 1) {
          params.set("category", selectedCategories[0]);
        }
        params.set("limit", LIMIT);
        params.set("page", 1);

        const res  = await makeRequest.get(`/products?${params.toString()}`);
        if (cancelled) return;

        const data = res.data;
        let incoming = data.products || [];

        // multi-category: filter client-side
        if (selectedCategories.length > 1) {
          incoming = incoming.filter(p =>
            p.categories?.some(c => selectedCategories.includes(c))
          );
        }

        // price filter
        incoming = incoming.filter(
          p => p.price >= priceRange.min && p.price <= priceRange.max
        );

        // sort
        if (sortOption === "asc")  incoming.sort((a, b) => a.price - b.price);
        if (sortOption === "desc") incoming.sort((a, b) => b.price - a.price);

        setProducts(incoming);
        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(1);
        pageRef.current = 1;
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [selectedCategories, priceRange, sortOption]);

  // ── load more (next page) ─────────────────────────────────────────────────
  const handleLoadMore = async () => {
    const nextPage = pageRef.current + 1;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (selectedCategories.length === 1) {
        params.set("category", selectedCategories[0]);
      }
      params.set("limit", LIMIT);
      params.set("page", nextPage);

      const res  = await makeRequest.get(`/products?${params.toString()}`);
      const data = res.data;
      let incoming = data.products || [];

      if (selectedCategories.length > 1) {
        incoming = incoming.filter(p =>
          p.categories?.some(c => selectedCategories.includes(c))
        );
      }
      incoming = incoming.filter(
        p => p.price >= priceRange.min && p.price <= priceRange.max
      );
      if (sortOption === "asc")  incoming.sort((a, b) => a.price - b.price);
      if (sortOption === "desc") incoming.sort((a, b) => b.price - a.price);

      setProducts(prev => [...prev, ...incoming]);
      setHasMore(data.hasMore);
      setPage(nextPage);
      pageRef.current = nextPage;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ── URL sync ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (priceRange.min > 0)        params.set("minPrice", priceRange.min);
    if (priceRange.max < 500000)   params.set("maxPrice", priceRange.max);
    if (sortOption)                params.set("sort", sortOption);
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCategories, priceRange, sortOption, navigate]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 500000 });
    setSortOption("");
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, INITIAL_VISIBLE);

  // ── active filter chips ───────────────────────────────────────────────────
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
      {(selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 500000 || sortOption) && (
        <button className="clear-all" onClick={clearAllFilters}>Clear all</button>
      )}
    </div>
  );

  if (error) return <div className="products-error">Failed to load products.</div>;

  return (
    <div className="products-page">

      {/* ── Desktop Filter Sidebar ── */}
      <aside className="filter-sidebar">
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="clear-all-desktop" onClick={clearAllFilters}>Clear all</button>
        </div>

        <div className="filter-group">
          <h4>Categories</h4>
          <div className="filter-options">
            {visibleCategories.map(cat => (
              <label key={cat} className={selectedCategories.includes(cat) ? "active" : ""}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
          {allCategories.length > INITIAL_VISIBLE && (
            <button className="expand-btn" onClick={() => setShowAllCategories(v => !v)}>
              {showAllCategories
                ? <><ExpandLessIcon /> Show less</>
                : <><ExpandMoreIcon /> Show {allCategories.length - INITIAL_VISIBLE} more</>}
            </button>
          )}
        </div>

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-range-row">
            <div className="price-slider">
              <span>Min: ₹{priceRange.min.toLocaleString()}</span>
              <input
                type="range" min={0} max={500000} step={5000}
                value={priceRange.min}
                onChange={e => setPriceRange(prev => ({ ...prev, min: +e.target.value }))}
              />
            </div>
            <div className="price-slider">
              <span>Max: ₹{priceRange.max.toLocaleString()}</span>
              <input
                type="range" min={0} max={500000} step={5000}
                value={priceRange.max}
                onChange={e => setPriceRange(prev => ({ ...prev, max: +e.target.value }))}
              />
            </div>
          </div>
        </div>

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

      {/* ── Main Content ── */}
      <main className="products-main">
        <div className="products-header">
          <div className="header-left">
            <h1>Our Collection</h1>
            <p className="product-count">{total} products found</p>
          </div>
          <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
            <SlidersIcon /> <span>Filter</span>
          </button>
        </div>

        <ActiveFilters />

        {loading && products.length === 0 ? (
          <div className="products-loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found. Try adjusting your filters.</div>
        ) : (
          <>
            <List products={products} />
            {loading && <div className="products-loading">Loading more...</div>}
            {hasMore && !loading && (
              <div className="load-more">
                <button onClick={handleLoadMore}>Load more products</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Mobile Bottom Sheet ── */}
      {showMobileFilter && (
        <>
          <div className="mobile-overlay" onClick={() => setShowMobileFilter(false)} />
          <div className="mobile-filter-sheet">
            <div className="sheet-header">
              <h3>Filter & Sort</h3>
              <button onClick={() => setShowMobileFilter(false)}><CloseIcon /></button>
            </div>
            <div className="sheet-content">

              <div className="filter-group">
                <h4>Categories</h4>
                <div className="filter-options">
                  {visibleCategories.map(cat => (
                    <label key={cat}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
                {allCategories.length > INITIAL_VISIBLE && (
                  <button className="expand-btn" onClick={() => setShowAllCategories(v => !v)}>
                    {showAllCategories ? "Show less" : `Show ${allCategories.length - INITIAL_VISIBLE} more`}
                  </button>
                )}
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <label>Min: ₹{priceRange.min.toLocaleString()}</label>
                  <input
                    type="range" min={0} max={500000} step={5000}
                    value={priceRange.min}
                    onChange={e => setPriceRange(prev => ({ ...prev, min: +e.target.value }))}
                  />
                  <label>Max: ₹{priceRange.max.toLocaleString()}</label>
                  <input
                    type="range" min={0} max={500000} step={5000}
                    value={priceRange.max}
                    onChange={e => setPriceRange(prev => ({ ...prev, max: +e.target.value }))}
                  />
                </div>
              </div>

              <div className="filter-group">
                <h4>Sort by price</h4>
                <div className="filter-options">
                  <label>
                    <input type="radio" name="mobile-sort" checked={sortOption === "asc"} onChange={() => setSortOption("asc")} />
                    <span>Low to High</span>
                  </label>
                  <label>
                    <input type="radio" name="mobile-sort" checked={sortOption === "desc"} onChange={() => setSortOption("desc")} />
                    <span>High to Low</span>
                  </label>
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