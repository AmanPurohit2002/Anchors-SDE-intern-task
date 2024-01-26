import { createContext,useState } from "react";

const AuthContext=createContext();

const AuthContextProvider=({children})=>{
    const[isLoggedIn,setIsLoggedIn]=useState(false);

    const handleLogin=()=> setIsLoggedIn(true);

    const handleLogout=()=>setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{isLoggedIn,handleLogin,handleLogout}}>
            {children}
        </AuthContext.Provider>
    )

}

export {AuthContextProvider,AuthContext};