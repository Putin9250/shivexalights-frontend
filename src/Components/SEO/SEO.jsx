import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMeta = {
  "/": { title: "Shivexa Lighting – Premium Lighting in Delhi", description: "Shivexa Lighting offers premium chandeliers, hanging lights, LED mirror lights, wall lights, and decorative lighting in Delhi." },
  "/products": { title: "Lighting Collection | Shivexa Lighting", description: "Explore chandeliers, hanging lights, ceiling lights, mirror lights, wall lights, and floor lamps." },
  "/about": { title: "About Shivexa Lighting", description: "Learn about Shivexa Lighting and our curated collection of decorative lighting." },
  "/contact": { title: "Contact Shivexa Lighting", description: "Contact Shivexa Lighting for product enquiries, support, and lighting assistance." },
  "/blogs": { title: "Lighting Journal | Shivexa Lighting", description: "Lighting inspiration, styling ideas, and guides from Shivexa Lighting." },
  "/order": { title: "My Orders | Shivexa Lighting", description: "Review your Shivexa Lighting orders." },
  "/checkout": { title: "Checkout | Shivexa Lighting", description: "Complete your Shivexa Lighting order securely." },
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
    const isProductsPage = location.pathname.startsWith("/products/");
    const isBlog = location.pathname.startsWith("/blog/");
    const meta = pageMeta[location.pathname] || (isProductsPage
      ? pageMeta["/products"]
      : isProduct
      ? { title: "Product | Shivexa Lighting", description: "Explore premium lighting from Shivexa Lighting." }
      : isBlog
        ? { title: "Lighting Article | Shivexa Lighting", description: "Read the latest lighting inspiration from Shivexa Lighting." }
        : pageMeta["/"]);
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}/#${location.pathname}${location.search}`;
    const keywords = "Shivexa Lighting, chandeliers in Delhi, decorative lighting, hanging lights, LED mirror lights";

    document.title = meta.title;
    setMeta('meta[name="description"]', ["name", "description"], meta.description);
    setMeta('meta[property="og:title"]', ["property", "og:title"], meta.title);
    setMeta('meta[property="og:description"]', ["property", "og:description"], meta.description);
    setMeta('meta[property="og:url"]', ["property", "og:url"], canonicalUrl);
    setMeta('meta[name="twitter:card"]', ["name", "twitter:card"], "summary");
    setMeta('meta[name="twitter:title"]', ["name", "twitter:title"], meta.title);
    setMeta('meta[name="twitter:description"]', ["name", "twitter:description"], meta.description);
    setMeta('meta[name="keywords"]', ["name", "keywords"], keywords);
    setMeta('meta[name="robots"]', ["name", "robots"], noIndex ? "noindex, nofollow" : "index, follow");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const structuredDataId = "shivexa-local-business-schema";
    document.getElementById(structuredDataId)?.remove();
    if (!noIndex) {
      const structuredData = document.createElement("script");
      structuredData.id = structuredDataId;
      structuredData.type = "application/ld+json";
      structuredData.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        name: "Shivexa Lighting",
        url: siteUrl,
        logo: `${siteUrl}/shivexa-lighting-logo.png`,
        image: `${siteUrl}/shivexa-lighting-logo.png`,
        email: "roysakshi037@gmail.com",
        telephone: "+91-7428-277-019",
        address: {
          "@type": "PostalAddress",
          streetAddress: "4A, 21, Tilak Nagar",
          addressLocality: "Delhi",
          postalCode: "110018",
          addressCountry: "IN",
        },
        hasMap: "https://maps.app.goo.gl/PC8B2rEH3dyBRkf29",
        description: "Premium chandeliers, hanging lights, LED mirror lights, wall lights, and decorative lighting in Delhi.",
      });
      document.head.appendChild(structuredData);
    }
  }, [location.pathname, location.search, noIndex]);

  return null;
};

export default SEO;
