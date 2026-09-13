import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMeta = {
  "/": { title: "Shivexa Lighting | Premium Lighting for Beautiful Spaces", description: "Shop premium chandeliers, hanging lights, LED mirror lights, wall lights, and more from Shivexa Lighting." },
  "/products": { title: "Lighting Collection | Shivexa Lighting", description: "Explore chandeliers, hanging lights, ceiling lights, mirror lights, wall lights, and floor lamps." },
  "/about": { title: "About Shivexa Lighting", description: "Learn about Shivexa Lighting and our curated collection of decorative lighting." },
  "/contact": { title: "Contact Shivexa Lighting", description: "Contact Shivexa Lighting for product enquiries, support, and lighting assistance." },
  "/blogs": { title: "Lighting Journal | Shivexa Lighting", description: "Lighting inspiration, styling ideas, and guides from Shivexa Lighting." },
  "/order": { title: "My Orders | Shivexa Lighting", description: "Review your Shivexa Lighting orders." },
};

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const [name, key] = attribute;
    element.setAttribute(name, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
};

const SEO = ({ noIndex = false }) => {
  const location = useLocation();

  useEffect(() => {
    const isProduct = location.pathname.startsWith("/product/");
    const isBlog = location.pathname.startsWith("/blog/");
    const meta = pageMeta[location.pathname] || (isProduct
      ? { title: "Product | Shivexa Lighting", description: "Explore premium lighting from Shivexa Lighting." }
      : isBlog
        ? { title: "Lighting Article | Shivexa Lighting", description: "Read the latest lighting inspiration from Shivexa Lighting." }
        : pageMeta["/"]);
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}/#${location.pathname}${location.search}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', ["name", "description"], meta.description);
    setMeta('meta[property="og:title"]', ["property", "og:title"], meta.title);
    setMeta('meta[property="og:description"]', ["property", "og:description"], meta.description);
    setMeta('meta[name="robots"]', ["name", "robots"], noIndex ? "noindex, nofollow" : "index, follow");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [location.pathname, location.search, noIndex]);

  return null;
};

export default SEO;
