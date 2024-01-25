import React, { useState, useEffect } from "react";
import API_URL from "../API/api";
import PostDetail from "./PostDetail";

const AllPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);

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

  const toggleExpandedPost = (postId) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  return (
    <div className="flex w-[60vw]">
      <div className="flex-grow bg-black-900 p-6 mb-4 ">
        <h2 className="mb-4">All Post ({posts.length})</h2>
        <div className="space-y-4 hover:cursor-pointer">
          {posts.map((post) => (
            <div
              key={post.postId}
              onClick={() => toggleExpandedPost(post.postId)}
              className="hover:bg-gray-800 p-4 rounded-md border border-gray-800"
            >
              <h3 className="text-white font-semibold">{post.title}</h3>
              <p className="text-gray-500">
                <span>{post.totalComments} comment</span>
                <span className="mx-2"></span>
                <span>{post.totalReplies} reply</span>
              </p>
              {expandedPostId === post.postId && (
                <PostDetail postId={post.postId} totalComments={post.totalComments} totalReplies={post.totalReplies} userId={userId}/>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
