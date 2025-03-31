import { getEnv } from "@/helpers/getEnv";
import { RouteBlogDetails } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Link } from "react-router-dom";

const RelatedBlog = ({ category, currentBlog }) => {
  const shouldFetch = category && currentBlog;

  const { data, loading, error } = useFetch(
    shouldFetch
      ? `${getEnv(
          "VITE_API_BASE_URL"
        )}/blog/get-related-blog/${category}/${currentBlog}`
      : null,
    {
      method: "get",
      credentials: "include",
    }
  );

  if (loading) return <div>Loading....</div>;
  if (error)
    return <div className="text-red-500">Error fetching related blogs.</div>;

  const relatedBlogs = data?.relatedBlogs || data?.blogs || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Related Blogs</h2>
      <div>
        {relatedBlogs.length > 0 ? (
          relatedBlogs.map((blog) => (
            <Link key={blog._id} to={RouteBlogDetails(category, blog.slug)}>
              <div className="flex items-center gap-3 mb-3">
                <img
                  className="w-[100px] h-[70px] object-cover rounded-md"
                  src={blog.featuredImage || "/placeholder.jpg"} 
                  alt={blog.title}
                />
                <h4 className="line-clamp-2 text-lg font-semibold">
                  {blog.title}
                </h4>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No Related Blogs Found.</div>
        )}
      </div>
    </div>
  );
};

export default RelatedBlog;
