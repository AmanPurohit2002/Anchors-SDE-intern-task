import React, { useState } from "react";
import API_URL from "../API/api";

const PostForm = ({userId}) => {
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostSubmit=async ()=>{
    try {
      const response=await fetch(API_URL+"/user/post",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,userId})
      })
      
      await response.json();

      if(response.ok){
        // console.log("data send successfully");

        setFormData({ title: "", description: "" });
      }
      

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="bg-black p-8 rounded-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Create post</h1>
      <div className="mb-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          type="text"
          placeholder="Post Title.."
          className="w-60 rounded-lg p-2 text-white bg-black border border-gray-800"
        />
      </div>
      <div className="mb-4">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your post..."
          className="w-[50vw] h-40 rounded border border-gray-800 p-2 text-white bg-black"
        ></textarea>
      </div>
      <div className="ml-60">
        <button onClick={handlePostSubmit} className="bg-black w-[20vw] hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-lg border border-gray-800">
          Post Submit
        </button>

      </div>
    </div>
  );
};

export default PostForm;
