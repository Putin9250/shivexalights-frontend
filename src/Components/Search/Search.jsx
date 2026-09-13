import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import makeRequest from "../../makeRequest";
import "./Search.scss";

import SearchIcon          from "@mui/icons-material/Search";
import CloseIcon           from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Search = ({ onClose }) => {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [searched, setSearched] = useState(false);

  const panelRef    = useRef();
  const inputRef    = useRef();
  const cacheRef    = useRef({});
  const debounceRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const doSearch = useCallback(async (q) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      setResults([]); setSearched(false); setError(null);
      return;
    }
    if (cacheRef.current[trimmed]) {
      setResults(cacheRef.current[trimmed]); setSearched(true);
      return;
    }
    setLoading(true); setError(null);
    try {
      const res = await makeRequest.get("/products?limit=100");
      const raw = res.data;
      const all = Array.isArray(raw) ? raw : Array.isArray(raw?.products) ? raw.products : [];
      const filtered = all.filter((p) => {
        const inTitle  = p.title?.toLowerCase().includes(trimmed);
        const inCat    = p.categories?.some((c) => c.toLowerCase().includes(trimmed));
        const inSubCat = p.subCategories?.some((c) => c.toLowerCase().includes(trimmed));
        return inTitle || inCat || inSubCat;
      });
      cacheRef.current[trimmed] = filtered;
      setResults(filtered); setSearched(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  };

  const clearQuery = () => {
    setQuery(""); setResults([]); setSearched(false); setError(null);
    inputRef.current?.focus();
  };

  const grouped = results.reduce((acc, p) => {
    const cat = p.categories?.[0] || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    // NOTE: all classes prefixed with "srch__" to avoid collisions with Navbar.scss
    <div className="srch__backdrop">
      <div className="srch__panel" ref={panelRef}>

        <div className="srch__header">
          <div className="srch__input-row">
            <SearchIcon className="srch__icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search by name or category…"
              className="srch__input"
              autoComplete="off"
            />
            {query && (
              <button className="srch__clear" onClick={clearQuery} aria-label="Clear">
                <CloseIcon />
              </button>
            )}
          </div>
          <button className="srch__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="srch__body">
          {!query && !loading && (
            <div className="srch__hint">
              <SearchIcon className="srch__hint-icon" />
              <p>Type a product name or category to search</p>
            </div>
          )}

          {loading && (
            <div className="srch__skeletons">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="srch__skeleton-row">
                  <div className="srch__sk-img" />
                  <div className="srch__sk-lines">
                    <div className="srch__sk-line srch__sk-long"  />
                    <div className="srch__sk-line srch__sk-short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="srch__hint">
              <p className="srch__no-results">Failed to load products</p>
              <p className="srch__no-results-sub">{error}</p>
            </div>
          )}

          {searched && !loading && !error && results.length === 0 && (
            <div className="srch__hint">
              <p className="srch__no-results">No results for <strong>"{query}"</strong></p>
              <p className="srch__no-results-sub">Try a different name or category.</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="srch__results">
              <p className="srch__meta">
                {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                <strong>"{query}"</strong>
              </p>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="srch__group">
                  <div className="srch__group-label">{cat}</div>
                  {items.map((p) => (
                    <Link key={p._id} to={`/product/${p._id}`} className="srch__item" onClick={onClose}>
                      <div className="srch__item-img">
                        <img src={p.img} alt={p.title} loading="lazy" />
                      </div>
                      <div className="srch__item-info">
                        <span className="srch__item-title">{p.title}</span>
                        <span className="srch__item-cats">{p.categories?.join(" · ")}</span>
                        <span className="srch__item-price">
                          {p.oldPrice && <s className="srch__old-price">₹{p.oldPrice.toLocaleString()}</s>}
                          ₹{p.price?.toLocaleString()}
                        </span>
                      </div>
                      <ArrowForwardIosIcon className="srch__arrow" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Search;