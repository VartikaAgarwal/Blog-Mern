import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react';

const Index = () => {
  const {
      data: blogData,
      loading,
      error,
    } = useFetch(
      `${getEnv("VITE_API_BASE_URL")}/blog/blogs`,
      {
        method: "get",
        credentials: "include",
      });

  if (loading) return <Loading />;
  
  if (error) return <div>Error loading blogs: {error.message}</div>;

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-10'>
      {blogData?.blogs?.length > 0 
        ? blogData.blogs.map((blog) => <BlogCard key={blog._id} props={blog} />)
        : <div>Data Not Found</div>
      }
    </div>
  );
};

export default Index;
