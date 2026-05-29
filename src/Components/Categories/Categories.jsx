import React, { useEffect, useState } from "react";
import "./Categories.scss";
import { Link } from "react-router-dom";
import SaleCat from "../../../AssetsPhotos/Sale_Cat.jpeg";
import WomenCat from "../../../AssetsPhotos/Women_Cat.jpeg";
import NewSeasonCat from "../../../AssetsPhotos/NewSeason_Cat.jpeg";
import ManCat from "../../../AssetsPhotos/Man_Cat.jpeg";
import AccessCat from "../../../AssetsPhotos/Access_Cat.jpeg";
import ChildCat from "../../../AssetsPhotos/Child_Cat.webp";

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
      { id: 14, title: "Sale", img: SaleCat },
      { id: 2, title: "Women", img: WomenCat },
      { id: 12, title: "New Season", img: NewSeasonCat },
      { id: 4, title: "Men", img: ManCat },
      { id: 6, title: "Accessories", img: AccessCat },
      { id: 10, title: "Children", img: ChildCat },
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