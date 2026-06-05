import React, { lazy } from "react";
import "./Home.scss";
import Slider from "../../Components/Slider/Slider";
import Chandelier from "../../Components/Chandelier/Chandelier";
import LazySection from "../../Components/LazySection/LazySection"
import useIntersectionObserver from "../../Hooks/useIntersectionObserver";

// Lazy‑loaded components (code‑split automatically)
const FeaturedProducts = lazy(() => import("../../Components/FeaturedProducts/FeaturedProducts"));
const Categories = lazy(() => import("../../Components/Categories/Categories"));
const TrendingProducts = lazy(() => import("../../Components/TrandingProducts/TrendingProducts"));
const Contact = lazy(() => import("../../Components/Contact/Contact"));

const Home = () => {
  const [lazyRef, isLazyVisible] = useIntersectionObserver();

  return (
    <div className="home">
      {/* Above‑the‑fold – loads immediately */}
      <Slider />
      <Chandelier />

      {/* Sentinel – triggers lazy loading when scrolled into view */}
      <div ref={lazyRef} style={{ height: "1px" }} />

      {isLazyVisible && (
        <LazySection fallback={<div className="loading-skeleton">Loading...</div>}>
          <FeaturedProducts type="featured" />
          <Categories />
          <TrendingProducts />
          <Contact />
        </LazySection>
      )}
    </div>
  );
};

export default Home;