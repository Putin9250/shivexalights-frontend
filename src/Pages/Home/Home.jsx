import React, { lazy } from "react";
import "./Home.scss";
import Slider from "../../Components/Slider/Slider";
import Chandelier from "../../Components/Chandelier/Chandelier";
import Consultation from "../../Components/Consultation/Consultation";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import BrandStory from "../../Components/BrandStory/BrandStory";
import QuoteDivider from "../../Components/QuoteDivider/QuoteDivider";
import FAQ from "../../Components/FAQ's/FAQ's";
import LocateUs from "../../Components/Locate Us/LocateUs";
import LazySection from "../../Components/LazySection/LazySection";
import Testimonials from "../../Components/Testimonials/Testimonials";

// Lazy‑loaded components (code‑split automatically)
const FeaturedProducts = lazy(
  () => import("../../Components/FeaturedProducts/FeaturedProducts"),
);
const Categories = lazy(() => import("../../Components/Categories/Categories"));
const TrendingProducts = lazy(
  () => import("../../Components/TrandingProducts/TrendingProducts"),
);
const Contact = lazy(() => import("../../Components/Contact/Contact"));

const Home = () => {
  return (
    <div className="home">
      {/* Above‑the‑fold – loads immediately */}
      <Slider />
      <Chandelier />

      <LazySection fallback={<div className="loading-skeleton">Loading...</div>}>
          <FeaturedProducts type="featured" />
          <Categories />
          <TrendingProducts />
          <Consultation />

          <CategorySlider
            category="Duplex Hanging Light"
            title="Duplex Hanging Lights"
            description="Two‑tier elegance for modern interiors. Adjustable height, timeless design."
            randomize={true}
          />
          <BrandStory />
          <CategorySlider
            category="LED Mirror Lights" // use EXACT category string as stored
            title="LED Mirror Lights"
            description="Illuminate your reflection with energy‑efficient brilliance."
            randomize={true}
          />
          <QuoteDivider />
          <Testimonials />
          <FAQ />
          <LocateUs />
          <Contact />
      </LazySection>
    </div>
  );
};

export default Home;
