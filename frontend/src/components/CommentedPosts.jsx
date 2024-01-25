import React, { useState, useEffect } from "react";
import API_URL from "../API/api";

const CommentedPosts = ({ userId }) => {
  const [commentedPosts, setCommentedPosts] = useState([]);

  useEffect(() => {
    const fetchCommentedPosts = async () => {
      try {
        const response = await fetch(
          API_URL + `/user/commented-posts/${userId}`
        );
        const data = await response.json();
        setCommentedPosts(data);
      } catch (error) {
        console.error("Error fetching commented posts:", error);
      }
    };

    fetchCommentedPosts();
  }, [userId]);

  return (
    <div className="flex-grow bg-black-900 p-6 mb-4 w-[40vw] ">
      <h2 className="mb-4">Commented Posts ({commentedPosts.length})</h2>
      <div className="space-y-4">
        {commentedPosts.map((commentedPost) => (
          <div
            key={commentedPost.postId}
            className="hover:bg-gray-800 p-4 rounded-md border border-gray-800"
          >
            <p className="text-white">"{commentedPost.comment}"</p>
            <p className="text-gray-500">Post Author Name: {commentedPost.postOwnerName}</p>
            <p className="text-gray-500">Post Title: {commentedPost.postTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentedPosts;
