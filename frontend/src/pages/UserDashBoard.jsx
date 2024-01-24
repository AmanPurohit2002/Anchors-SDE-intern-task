import React, { useState } from "react";
import LeftSidebar from "../components/LeftSideBar";

const UserDashBoard = () => {
  const [selectedLink, setSelectedLink] = useState("all");

  const handleSelectLink = (link) => {
    setSelectedLink(link);
    
  };

  return (
    <div className="flex">
      <LeftSidebar onSelectLink={handleSelectLink} />
      <div className="flex-1 p-8">
        {/* Right side content based on the selected link */}
        {selectedLink === "all" && <h2>All Posts Content</h2>}
        {selectedLink === "commented" && <h2>Commented Posts Content</h2>}
        {selectedLink === "replied" && <h2>Replied Posts Content</h2>}
        {selectedLink === "create" && <h2>Create Post Form</h2>}
      </div>
    </div>
  );
};

export default UserDashBoard;
