import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './BotAnalysis/Chatbot';
import Signup from './Signup-Login/Signup';
import Login from './Signup-Login/Login';
import ForgetPassword from './Signup-Login/ForgetPassword';
import ResetPassword from './Signup-Login/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import AdminMain from './BotAnalysis/AdminMain';
import Home from './Home';
import "./App.css"


import LanguageSwitcher from './components/LanguageSwitcher';


const App = () => {
  // const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists in localStorage

  return (
    <div>
       <div className="LanguageSwitcher">
    {/* <LanguageSwitcher /> */}
  </div>
  <Router>
    

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/Adminmain" element={<PrivateRoute><AdminMain /></PrivateRoute>} />

      {/* Additional Routes */}
      <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
    </Routes>
  </Router>
</div>

  );
};

export default App;
