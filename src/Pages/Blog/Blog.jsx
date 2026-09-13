import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import "./Blog.scss";

const Blog = () => {
  const { data: blogs, loading, error } = useFetch("/blogs");

  const sampleBlogs = [
    {
      _id: "sample-1",
      title: "Lighting Design Trends for Modern Homes in 2026",
      excerpt: "Explore the harmony between architectural minimalism and warm ambient illumination. Learn how statement chandeliers elevate luxury interiors.",
      coverImg: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
      createdAt: new Date().toISOString(),
      author: "ShivExa Editorial",
      tags: ["Interior Design", "Trends", "Chandeliers"]
    },
    {
      _id: "sample-2",
      title: "How to Choose the Right LED Color Temperature for Every Room",
      excerpt: "Warm white vs cool daylight: how lighting warmth affects mood, productivity, and aesthetics across living rooms and bedrooms.",
      coverImg: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
      createdAt: new Date().toISOString(),
      author: "ShivExa Lighting Guide",
      tags: ["Guide", "LED Lighting"]
    }
  ];

  const displayBlogs = Array.isArray(blogs) && blogs.length > 0 ? blogs : sampleBlogs;

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <span className="eyebrow">ShivExa Editorial</span>
        <h1>Illumination Insights & Stories</h1>
        <p>Discover expert guidance, interior styling tips, and the latest trends in luxury lighting.</p>
      </div>

      <div className="blog-container">
        {loading && <div className="blog-loading">Loading articles...</div>}
        {error && <div className="blog-error">Unable to load stories.</div>}

        <div className="blog-grid">
          {displayBlogs.map((article) => (
            <article key={article._id} className="blog-card">
              <div className="card-image">
                <img
                  src={article.coverImg || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800"}
                  alt={article.title}
                  loading="lazy"
                />
                {article.tags?.[0] && <span className="card-tag">{article.tags[0]}</span>}
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>•</span>
                  <span>{article.author || "ShivExa Team"}</span>
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <Link to={`/blog/${article._id}`} className="read-more">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
