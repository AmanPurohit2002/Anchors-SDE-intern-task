import React, { useState } from "react";
import LeftSidebar from "../components/LeftSideBar";
import PostForm from "../components/PostForm";
import { useParams } from "react-router-dom";
import AllPosts from "../components/AllPosts";
import CommentedPosts from "../components/CommentedPosts";
import RepliedPosts from "../components/RepliedPosts";

const UserDashBoard = () => {
  const [selectedLink, setSelectedLink] = useState("all");
  const {userId}=useParams(); 

  const handleSelectLink = (link) => {
    setSelectedLink(link);    
  };

  return (
    <div className="flex">
      <LeftSidebar onSelectLink={handleSelectLink} />
      <div className="flex-1 p-8">
        {/* Right side content based on the selected link */}
        {selectedLink === "all" && <AllPosts userId={userId}/>}
        {selectedLink === "commented" && <CommentedPosts userId={userId}/>}
        {selectedLink === "replied" && <RepliedPosts userId={userId}/>}
        {selectedLink === "create" && <PostForm userId={userId}/>}
      </div>
    </div>
  );
};

export default UserDashBoard;
