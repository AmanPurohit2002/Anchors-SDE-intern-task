import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashBoard from "./pages/UserDashBoard";
import Header from "./components/Header";

function App() {
  return (
    <div className="text-white ">
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/:userId" element={<UserDashBoard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
