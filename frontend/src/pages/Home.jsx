// HomePage.js
import React from "react";
import Emoji from "../components/Emoji";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-black text-white flex flex-col mt-40">
      <div className="flex-1 flex items-center justify-center flex-col">
        <p className="text-xs text-center p-4">
          <Emoji symbol="🚀" label="rocket" />
          For Indian Users Only
        </p>
        <h1 className="text-4xl font-bold text-center mb-8">
          Start posting anonymously <br></br>where no one will judge.
        </h1>
        <p className="py-4">Welcome to Stranger discussion forum</p>
        <Link
          to="/signup"
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4 inline-block"
        >
          Create Your Account
          <Emoji symbol="→" label="right-arrow" />
        </Link>
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
