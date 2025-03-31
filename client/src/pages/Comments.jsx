import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/get-all-comment`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchComments();
  }, []);


  const handleDelete = async (id) => {
    const response = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/comment/delete/${id}`
    );
    if (response) {
      showToast("success", "Comment deleted.");
      fetchComments(); 
    } else {
      showToast("error", "Failed to delete comment.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Card>
        <CardContent>
          {comments.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Blog</th>
                  <th className="p-2">Commented By</th>
                  <th className="p-2">Comment</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className="border-b">
                    <td className="p-2">{comment?.blogid?.title || "N/A"}</td>
                    <td className="p-2">{comment?.user?.name || "Anonymous"}</td>
                    <td className="p-2">{comment?.comment}</td>
                    <td className="p-2">
                      <Button
                        onClick={() => handleDelete(comment._id)}
                        variant="outline"
                        className="hover:bg-yellow-500 hover:text-white"
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4">No comments found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Comments;
