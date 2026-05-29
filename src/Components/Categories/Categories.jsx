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
      { id: 14, title: "Sale", img: "../../AssetsPhotos/Sale_Cat.jpeg" },
      { id: 2, title: "Women", img: "../../AssetsPhotos/Women_Cat.jpeg" },
      { id: 12, title: "New Season", img: "../../AssetsPhotos/NewSeason_Cat.jpeg" },
      { id: 4, title: "Men", img: "../../AssetsPhotos/Man_Cat.jpeg" },
      { id: 6, title: "Accessories", img: "../../AssetsPhotos/Access_Cat.jpeg" },
      { id: 10, title: "Children", img: "../../AssetsPhotos/Child_Cat.webp" },
    ];

  if (isMobile) {
    return (
      <div className="categories-mobile">
        {categoriesData.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.img} alt={cat.title} loading="lazy"/>
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