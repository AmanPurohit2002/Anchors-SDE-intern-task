import React, { useState } from "react";
import LeftSidebar from "../components/LeftSideBar";
import PostForm from "../components/PostForm";
import { useParams } from "react-router-dom";
import AllPosts from "../components/AllPosts";

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
        {selectedLink === "commented" && <h2>Commented Posts Content</h2>}
        {selectedLink === "replied" && <h2>Replied Posts Content</h2>}
        {selectedLink === "create" && <PostForm userId={userId}/>}
      </div>
    </div>
  );
};

export default UserDashBoard;
