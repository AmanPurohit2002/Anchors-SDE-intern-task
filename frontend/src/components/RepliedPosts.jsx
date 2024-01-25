import React, { useState, useEffect } from "react";
import API_URL from "../API/api";

const RepliedPosts = ({ userId }) => {
  const [repliedPosts, setRepliedPosts] = useState([]);

  useEffect(() => {
    const fetchRepliedPosts = async () => {
      try {
        const response = await fetch(
          API_URL + `/user/replied-posts/${userId}`
        );
        const data = await response.json();
        setRepliedPosts(data);
      } catch (error) {
        console.error("Error fetching replied posts:", error);
      }
    };

    fetchRepliedPosts();
  }, [userId]);

  return (
    <div className="flex-grow bg-black-900 p-6 mb-4 w-[40vw]">
      <h2 className="mb-4">Replied Posts ({repliedPosts.length})</h2>
      <div className="space-y-6">
        {repliedPosts.map((repliedPost) => (
          <div
            key={repliedPost.postId}
            className="hover:bg-gray-800 p-4 rounded-md border border-gray-800"
          >
            <p className="text-white">"{repliedPost.reply}"</p>
            <h3 className="text-gray-200 font-semibold mt-2">replied on "{repliedPost.comment}"</h3>
            {/* <p className="text-gray-500">Commented by: {repliedPost.commentAuthorName}</p> */}
            <p className="text-gray-500">Post title: {repliedPost.postTitle}</p>
            <p className="text-gray-500">Post Author: {repliedPost.postAuthorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepliedPosts;
