import React from "react";
import "./List.scss";
import Card from "../Cards/Cards.jsx";
import useFetch from "../../Hooks/useFetch";

const List = ({ catId, subCatIds, maxPrice, sort }) => {
  // Filter by selected sub‑categories (if any)
  const subCatFilter = subCatIds.length
  ? subCatIds
      .map((id, index) => `&filters[sub_categories][id][$in][${index}]=${id}`)
      .join("")
  : "";
  // Sort only if 'asc' or 'desc' is provided
  const sortParam = sort ? `&sort=price:${sort}` : "";

  // Build the complete URL
  const url = `/products?populate=*&filters[categories][id][$eq]=${catId}&filters[price][$lte]=${maxPrice}${subCatFilter}${sortParam}`;

  const { data, loading, error } = useFetch(url);

  if (loading) return <div className="list-loading">Loading products...</div>;
  if (error) return <div className="list-error">Failed to load products.</div>;
  if (!data || data.length === 0) return <p>No products found</p>;

  return (
    <div className="list">
      {data.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </div>
  );
};

export default List;
