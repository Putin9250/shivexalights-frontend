import React, { useEffect, useState } from "react";
import "./Categories.scss";
import { Link } from "react-router-dom";

const Categories = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categoriesData = [
    { id: 14, title: "Sale", img: "https://images.pexels.com/photos/818992/pexels-photo-818992.jpeg" },
    { id: 2, title: "Women", img: "https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg" },
    { id: 12, title: "New Season", img: "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg" },
    { id: 4, title: "Men", img: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg" },
    { id: 6, title: "Accessories", img: "https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg" },
    { id: 10, title: "Children", img: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20684253a.webp" },
  ];

  if (isMobile) {
    return (
      <div className="categories-mobile">
        {categoriesData.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.img} alt={cat.title} />
            <button>
              <Link
                to={`/products?category=${encodeURIComponent(cat.title)}`}
                className="link"
              >
                {cat.title}
              </Link>
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="categories">
      {categoriesData.map((cat) => (
        <div className="col" key={cat.id}>
          <div className="row">
            <img src={cat.img} alt={cat.title} />
            <button>
              <Link
                to={`/products?category=${encodeURIComponent(cat.title)}`}
                className="link"
              >
                {cat.title}
              </Link>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;