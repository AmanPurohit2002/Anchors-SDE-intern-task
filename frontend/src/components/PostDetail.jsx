import React, { useState, useEffect } from "react";
import API_URL from "../API/api";

const PostDetail = ({ postId, totalComments, totalReplies, userId }) => {
  const [postDetails, setPostDetails] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          API_URL + `/user/activity/${userId}/post/${postId}`
        );
        const data = await response.json();

        console.log(data);

        if (response.ok) {
          setPostDetails(data);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postId, userId]);

  if (!postDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-4">
        {postDetails.title}
      </h2>
      <p className="text-white mb-4">{postDetails.description}</p>
      <p className="text-gray-500">
        <span>{totalComments} comment</span>
        <span className="mx-2"></span>
        <span>{totalReplies} reply</span>
      </p>
      <div className="mt-4">
        <h3 className="text-white text-xl font-bold mb-2">Comments:</h3>
        {postDetails.comments.map((comment) => (
          <div key={comment._id} className="mb-4">
            <p className="text-white">{comment.commenterName} {":"} {" "} {comment.text}</p>
            {comment.replies.length > 0 && (
              <div className="ml-4">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="mb-2">
                    <p className="text-white ml-8 my-2">
                      {reply.replierName} {":"} {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
