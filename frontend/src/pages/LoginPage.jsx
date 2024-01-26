import React, { useContext, useState } from "react";
import Emoji from "../components/Emoji";
import { useNavigate } from "react-router-dom";
import API_URL from "../API/api";
import { AuthContext } from "../ContextApi/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: "" });
  const [getUserId, setUserId] = useState("");
  const {handleLogin}=useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => e.preventDefault();

  const handleContinue = async () => {
    if (formData.email.trim() === "") {
      setFormErrors({
        email: formData.email.trim() === "" ? "Email is required" : "",
      });
    } else {
      setFormErrors({});
    }
    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      await response.json();

      if (response.ok) {
        setShowOtpField(true);
      } else {
        alert("Email does not exists")
        console.log("fill all values");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    // setSuccessMessage("Welcome User !");
    // setAccountCreated(true);
    try {
      const response = await fetch(API_URL + "/auth/newLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const result = await response.json();
      setUserId(result._id);

      if (response.ok) {
        setSuccessMessage("Welcome User !");
        setAccountCreated(true);
      } else {
        console.log("Error verifying OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreatePost = () => {
    handleLogin();
    navigate("/dashboard/" + getUserId);
  };

  return (
    <div className="flex items-center justify-center flex-col mt-40">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 h-[50vh] "
      >
        {!showOtpField ? (
          <>
            <div className="mb-4 flex justify-center flex-col items-center">
              <Emoji symbol="🚀" label="rocket" />
              <h1>Login Your Account</h1>
            </div>
            <div className="mb-6">
              <input
                className={`shadow bg-black focus:bg-slate-900 appearance-none border rounded-2xl w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline
                ${formErrors.email && "border-red-500"}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter Email ID"
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs italic">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white w-full font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={handleContinue}
              >
                Continue
                <Emoji symbol="→" label="right-arrow" />
              </button>
            </div>
          </>
        ) : (
          <>
            {!accountCreated ? (
              <>
                <div className="mb-4 flex justify-center flex-col items-center">
                  <Emoji symbol="🚀" label="rocket" />
                  <h1>Login Your Account</h1>
                </div>
                <div className="mb-4 flex flex-col justify-center items-center">
                  <label className="text-gray-500">
                    Please verify your email ID to continue
                  </label>
                  <label className="text-gray-500">
                    We have send an OTP to this {formData.email}
                  </label>
                </div>
                <div className="mb-4">
                  <input
                    className="shadow bg-black focus:bg-slate-900 appearance-none border rounded-2xl w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white w-full font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline"
                    type="submit"
                    onClick={handleVerifyOtp}
                  >
                    Continue
                    <Emoji symbol="→" label="right-arrow" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-12 flex justify-center flex-col items-center">
                  <Emoji symbol="✅" label="rocket" />
                  <h1>{successMessage}</h1>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white w-full font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline"
                    type="submit"
                    onClick={handleCreatePost}
                  >
                    Create your post
                    <Emoji symbol="→" label="right-arrow" />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
