import React, { useEffect, useState } from "react";
import "./FeaturedProducts.scss";
import Cards from "../Cards/Cards";
import useFetch from "../../Hooks/useFetch";

const FeaturedProducts = ({ type }) => {
    const { data, loading, error } = useFetch(
      `/products?populate=*&[filters][type][$eq]=${type}`,
    );

  return (
    <div className="featuredProducts">
      <div className="container">
        <div className="top">
          <h1>{type} Products</h1>
          <p>
            Discover our handpicked collection of premium products. From trendy
            fashion to must-have accessories, find exactly what you need for any
            occasion.
          </p>
        </div>
        <div className="bottom">
          {data.map((item) => (
            <Cards item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
