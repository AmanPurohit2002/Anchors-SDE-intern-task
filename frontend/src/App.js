import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Emoji from "./components/Emoji";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashBoard from "./pages/UserDashBoard";

function App() {
  return (
    <div className="text-white ">
      <header className="flex sticky top-0 items-center justify-between p-4 bg-black shadow-md z-10">
        <div className="flex items-center">
          <Emoji symbol="☰" label="menu" className="text-2xl" />
          <span className="px-2">ANONYMOUS</span>
        </div>
        <div className="ml-2">
          <Emoji symbol="🧑🏻‍💻" label="user" className="text-2xl" />
        </div>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<UserDashBoard/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
