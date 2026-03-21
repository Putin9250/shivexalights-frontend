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

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const categoriesData = [
    {
      id: 14,
      title: "Sale",
      img: "https://images.pexels.com/photos/818992/pexels-photo-818992.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 2,
      title: "Women",
      img: "https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 12,
      title: "New Season",
      img: "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 4,
      title: "Men",
      img: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 6,
      title: "Accessories",
      img: "https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 10,
      title: "Children",
      img: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20684253a.webp",
    },
  ];

  // Mobile layout: Simple vertical list
  if (isMobile) {
    return (
      <div className="categories-mobile">
        {categoriesData.map((category) => (
          <div className="category-card" key={category.id}>
            <img src={category.img} alt={category.title} />
            <button>
              <Link to={`/products/${category.id}`} className="link">
                {category.title}
              </Link>
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Desktop layout: Original complex grid
  return (
    <div className="categories">
      <div className="col">
        <div className="row">
          <img src={categoriesData[0].img} alt="" />
          <button>
            <Link className="link" to={`/products/${categoriesData[0].id}`}>
              {categoriesData[0].title}
            </Link>
          </button>
        </div>
        <div className="row">
          <img src={categoriesData[1].img} alt="" />
          <button>
            <Link to={`/products/${categoriesData[1].id}`} className="link">
              {categoriesData[1].title}
            </Link>
          </button>
        </div>
      </div>
      <div className="col">
        <div className="row">
          <img src={categoriesData[2].img} alt="" />
          <button>
            <Link to={`/products/${categoriesData[2].id}`} className="link">
              {categoriesData[2].title}
            </Link>
          </button>
        </div>
      </div>
      <div className="col col-l">
        <div className="row">
          <div className="col">
            <div className="row">
              <img src={categoriesData[3].img} alt="" />
              <button>
                <Link to={`/products/${categoriesData[3].id}`} className="link">
                  {categoriesData[3].title}
                </Link>
              </button>
            </div>
          </div>
          <div className="col">
            <div className="row">
              <img src={categoriesData[4].img} alt="" />
              <button>
                <Link to={`/products/${categoriesData[4].id}`} className="link">
                  {categoriesData[4].title}
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <img src={categoriesData[5].img} alt="" />
          <button>
            <Link to={`/products/${categoriesData[5].id}`} className="link">
              {categoriesData[5].title}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
