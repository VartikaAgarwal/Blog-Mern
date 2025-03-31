import Comment from "@/components/Comment";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import Loading from "@/components/Loading";
import RelatedBlog from "@/components/RelatedBlog";
import { Avatar } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { AvatarImage } from "@radix-ui/react-avatar";
import { decode } from "entities";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";

const SingleBlogDetails = () => {
  const { blog: blogSlug, category } = useParams();

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blogSlug}`,
    {
      method: "get",
      credentials: "include",
    },
    [blogSlug] 
  );

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">Failed to load the blog. Please try again.</div>;
  if (!data?.blog) return <div className="text-center text-gray-500">Blog not found.</div>;

  const { title, author, createdAt, featuredImage, blogContent, _id, category: blogCategory } = data.blog;

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      <div className="border rounded md:w-[70%] w-full p-5">
        <h1 className="text-2xl font-bold mb-5">{title}</h1>
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-5">
            <Avatar>
              <AvatarImage src={author?.avatar || "/default-avatar.png"} />
            </Avatar>
            <div>
              <p className="font-bold">{author?.name || "Unknown Author"}</p>
              <p>Date: {moment(createdAt).format("DD-MM-YYYY")}</p>
            </div>
          </div>
          <div className="flex justify-between items-center gap-5">
            <LikeCount blogid={_id} />
            <CommentCount blogid={_id} />
          </div>
        </div>

        {featuredImage && (
          <div className="my-5">
            <img src={featuredImage} className="rounded w-full" alt={title} />
          </div>
        )}

        <div
          dangerouslySetInnerHTML={{
            __html: decode(blogContent) || "",
          }}
        ></div>

        <div className="border-t mt-5 pt-5">
          <Comment blogid={_id} />
        </div>
      </div>


      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog category={blogCategory?.slug || category} currentBlog={blogSlug} />
      </div>
    </div>
  );
};

export default SingleBlogDetails;
