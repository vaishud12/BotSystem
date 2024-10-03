import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import ProfileModal from './components/ProfileModal';
import { FaUserCircle } from 'react-icons/fa';
import logo from './Signup-Login/logo.jpeg'; 
import * as API from "./Endpoint/Endpoint";
import LanguageSwitcher from './components/LanguageSwitcher';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(API.GET_USERID, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params: { email }
          });
  
          if (response.data) {
            const data = response.data;
            setUserDetails(data);
            setIsAdmin(data.isadmin);
          } else {
            // User does not exist in the database, clear the local storage
            localStorage.removeItem('userEmail');
            setUserEmail('');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          // Handle error by clearing user info from localStorage if needed
          localStorage.removeItem('userEmail');
          setUserEmail('');
          setError('Failed to fetch user details.');
        }
      };
  
      fetchUserDetails();
    }
  }, []);

  // Handle the logout process
  const handleLogout = () => {
    // Clear the localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user_id');

    // Reset the state
    setUserEmail('');
    setIsAdmin(false);
    setUserDetails(null);

    // Optionally redirect the user to the homepage
    window.location.href = '/'; // Redirect to login page or home
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <nav className="bg-blue-500 p-4 flex justify-between items-center fixed top-0 left-0 right-0" style={{ height: '50px', zIndex: 1000 }}>
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-26 mr-2" />
        </div>
        
        <ul className="flex items-center space-x-4">
          {/* LanguageSwitcher component */}
          <li>
            <LanguageSwitcher />
          </li>

          {/* Conditional rendering based on whether user is logged in */}
          {userEmail ? (
            <li className="relative flex items-center space-x-4">
              <button onClick={toggleDropdown} className="flex items-center space-x-2 text-white focus:outline-none">
                <FaUserCircle className="h-8 w-8" />
                <div className="flex flex-col ml-2 text-left">
                  <span className="text-white">{userEmail}</span>
                  <span className="text-sm text-gray-300">{isAdmin ? 'Admin' : 'User'}</span>
                </div>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                  style={{ transform: "translateY(0)" }} // ensures no overlap with the navbar
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal();
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout(); // Call the logout function
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </a>
                </div>
              )}
            </li>
          ) : (
            <li>
              <a href="/" className="text-white font-semibold hover:underline">
                Join Now
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Profile modal */}
      <ProfileModal
        isOpen={modalOpen}
        onClose={closeModal}
        email={userEmail}
      />
    </>
  );
};

export default Navbar;
