import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as API from "../Endpoint/Endpoint";
import logo from "./logo.jpeg"
import loginimg from "./loginimg.png";
import { SocialIcon } from 'react-social-icons';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null); // Initial state is null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Define navigate
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('isAdmin',data.isAdmin.toString())
        console.log('Stored Email:', localStorage.getItem('userEmail'));
        setIsAdmin(data.isAdmin); // Set isAdmin based on response
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Use useEffect to navigate based on admin status
  useEffect(() => {
    if (isAdmin !== null) {
      if (isAdmin) {
        navigate("/Adminmain"); // Navigate to admin route
      } else {
        navigate("/Home"); // Navigate to user route
      }
    }
  }, [isAdmin, navigate]);

  return (
<>
<div className="w-full flex justify-end p-3 bg-gray-100">
        <LanguageSwitcher />
      </div>
<div className="flex flex-col lg:flex-row md:flex-row sm:flex-row h-full lg:h-screen">
        {/* Text and Image Section */}
        <div className="flex-1 bg-gray-200 p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
            {/* Text Content */}
            <div className="flex-1">
              <h1 className="text-center text-2xl lg:text-2xl font-bold text-blue-800 mb-6">
                {t("login.welcome")}
              </h1>
              <div className="lg:flex lg:space-x-5">
                <div className="flex-1 mb-8 lg:mb-0">
                  <p className="mb-4">
                    {t("login.description1")}
                  </p>
                  <p className="mb-4">
                    {t("login.description2")}
                  </p>
                  

                  
                </div>

                {/* Image */}
                <div className="flex-1 mt-4 lg:mt-0 lg:w-1/2">
                  <img
                    src={loginimg}
                    alt="Welcome"
                    className="w-full max-w-xs lg:max-w-md h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full">
                    <p className="mb-4">
                     {t("login.description3")}
                    </p>
                  </div>
          {/* Vision Section */}
          <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4">{t("login.vision")}</h2>
            <p className="mb-4">
              {t("login.visiond")}
            </p>
          </div>
        </div>

    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{t("login.login_title")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{t("login.email")}:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{t("login.password")}:</label>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
      <div className="mt-2">
        <label className="text-gray-700 text-sm">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          {t("login.show_password")}
        </label>
      </div>
    </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Loading...' : 'Login'} {/* Show loading text */}
          </button>
        </form>
        <p className="mt-4 text-sm">
          {t("login.no_account")} <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
        <p className="mt-4 text-sm">
          <Link to="/forgetPassword" className="text-blue-500">{t("login.forgot_password")}</Link>
        </p>
      </div>
    </div>
    </div>

{/* Full-length Section */}
<div className="w-full bg-gray-100 p-9">
        <h2 className="text-xl font-semibold mb-4">{t("login.mission")}</h2>
        <p className="mb-4">
          {t("login.missiond")}
        </p>

        <div className="flex justify-center mt-4">
          <SocialIcon network="linkedin" url="https://www.linkedin.com/in/dr-prakash-sharma-330743a3/" />
        </div>
      </div>
</>
  );
}

export default Login;
