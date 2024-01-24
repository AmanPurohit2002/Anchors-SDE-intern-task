import React, { useState } from "react";
import Emoji from "../components/Emoji";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => e.preventDefault();

  const handleContinue = async () => {

    setShowOtpField(true);
    // if (formData.name.trim() === "" || formData.email.trim() === "") {
    //   setFormErrors({
    //     name: formData.name.trim() === "" ? "Name is required" : "",
    //     email: formData.email.trim() === "" ? "Email is required" : "",
    //   });
    // } else {
    //   // Clear any previous form errors
    //   setFormErrors({});
    // }

    // try {
    //   const response = await fetch("http://127.0.0.1:8080/auth/signUp", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   await response.json();

    //   if (response.ok) {
    //     setShowOtpField(true);
    //   } else {
    //     console.log("fill all values");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const handleVerifyOtp = async () => {
        setSuccessMessage("Account created successfully!");
        setAccountCreated(true);
    // try {
    //   const response = await fetch("http://127.0.0.1:8080/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email: formData.email, otp }),
    //   });

    //   await response.json();

    //   if (response.ok) {
    //     setSuccessMessage("Account created successfully!");
    //     setAccountCreated(true);
    //   } else {
    //     console.log("Error verifying OTP");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const handleCreatePost = () => {
    navigate("/dashboard");
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
              <h1>Create Your Account</h1>
            </div>
            <div className="mb-4">
              <input
                className={`shadow appearance-none focus:bg-slate-900 bg-black border rounded-2xl w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline
                ${formErrors.name && "border-red-500"}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                type="text"
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs italic">{formErrors.name}</p>
              )}
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
                <p className="text-red-500 text-xs italic">{formErrors.email}</p>
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
                  <h1>Create Your Account</h1>
                </div>
                <div className="mb-4 flex flex-col justify-center items-center">
                    <label className="text-gray-500">Please verify your email ID to continue</label>
                    <label className="text-gray-500">We have send an OTP to this {formData.email}</label>
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
                  <Emoji symbol="✅" label="rocket"/>
                  <h1>{successMessage}</h1>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white w-full font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline"
                    type="submit"
                    onClick={handleCreatePost}
                  >
                    Create your first post
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
}

export default SignupPage;
