import BlogCard from "@/components/BlogCard";
import { getEnv } from "@/helpers/getEnv";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; 

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async () => {
    if (!query) return; 

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog/search?q=${encodeURIComponent(
          query
        )}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setBlogData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  if (!query) return <div>Please enter a search query.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blogData?.blogs?.length) return <div>Data Not Found.</div>;

  return (
    <>
      <div className="flex items-center gap-3 text-2xl font-bold text-blue-500 border-b pb-3 mb-5">
        <h4>Search Result For: {query} </h4>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {blogData.blogs.map((blog) => (
          <BlogCard key={blog._id} props={blog} />
        ))}
      </div>
    </>
  );
};

export default SearchResult;
