import React, { useState, useEffect } from "react";
import API_URL from "../API/api";

const AllPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL + `/user/posts/${userId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="flex-grow bg-black-900 p-6 mb-4 w-[40vw]">
      <h2 className="mb-4">All Post ({posts.length})</h2>
      <div className="space-y-4 hover:cursor-pointer">
        {posts.map((post) => (
          <div
            key={post._id}
            className="hover:bg-gray-800 p-4 rounded-md border border-gray-800"
          >
            <h3 className="text-white font-semibold">{post.title}</h3>
            <p className="text-gray-500">
              <span>{post.totalComments} comment</span>
              <span className="mx-2"></span>
              <span>{post.totalReplies} reply</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
