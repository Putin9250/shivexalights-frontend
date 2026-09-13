import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import "./Blog.scss";

const BlogDetail = () => {
  const { id } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${id}`);

  if (loading) return <div className="blog-loading">Loading article...</div>;

  const article = blog && blog.title ? blog : {
    title: "Lighting Design Trends for Modern Homes in 2026",
    content: "Lighting is no longer an afterthought in interior architecture — it is the cornerstone of atmosphere. In 2026, statement chandeliers, layered ambient glows, and warm dimming LEDs take center stage.\n\nKey trends include:\n• Sculptural Pendant Lights: Bold silhouettes that double as art installations when turned off.\n• Warm Temperature Dimming: Seamless adjustment from 3000K crisp warmth down to 2200K sunset ambient glow.\n• Integrated Architectural Lighting: Cove lights and recessed mirror lights that highlight texture and space.",
    coverImg: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
    author: "ShivExa Editorial",
    createdAt: new Date().toISOString(),
    tags: ["Design", "Lighting"]
  };

  return (
    <div className="blog-detail-page">
      <div className="detail-container">
        <Link to="/blogs" className="back-link">← Back to Articles</Link>

        <header className="article-header">
          {article.tags?.[0] && <span className="detail-tag">{article.tags[0]}</span>}
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span>By {article.author || "ShivExa Editorial"}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </header>

        {article.coverImg && (
          <div className="detail-cover">
            <img src={article.coverImg} alt={article.title} />
          </div>
        )}

        <div className="article-body">
          {article.content?.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
