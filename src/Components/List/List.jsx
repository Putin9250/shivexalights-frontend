import React from "react";
import "./List.scss";
import Card from "../Cards/Cards.jsx";

const List = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <div className="list">
      {products.map((item) => (
        <Card item={item} key={item._id} />
      ))}
    </div>
  );
};

export default List;