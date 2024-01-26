import React, { useContext } from "react";
import Emoji from "./Emoji";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../ContextApi/AuthContext";

const Header = () => {
    const {isLoggedIn}=useContext(AuthContext);
    const navigate=useNavigate();

    const handleNavigate=()=>{
        navigate('/')
    }

  return (
    <div>
      <header className="flex sticky top-0 items-center justify-between p-4 bg-black shadow-md z-10">
        <div className="flex items-center hover:cursor-pointer" onClick={handleNavigate}>
          <Emoji symbol="☰" label="menu" className="text-2xl" />
          <span className="px-2">ANONYMOUS</span>
        </div>
        <div className="ml-2">
        {isLoggedIn ? <span className="mr-2">Welcome User</span>  : ""}
          <Emoji symbol="🧑🏻‍💻" label="user" className="text-2xl" />
        </div>
      </header>
    </div>
  );
};

export default Header;
