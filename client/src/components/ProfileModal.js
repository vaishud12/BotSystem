import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as API from "../Endpoint/Endpoint";
const ProfileModal = ({ isOpen, onClose, email }) => {
  const [userDetails, setUserDetails] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (email) {
          const response = await axios.get(API.GET_USERID, {
            params: { email }
          });
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (isOpen && email) {
      fetchUserDetails();
    }
  }, [isOpen, email]);

  if (!isOpen || !userDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{t("profile.details")}</h2>
        <div className="mb-4">
          <strong>{t("profile.name")}:</strong> {userDetails.name}
        </div>
        <div className="mb-4">
          <strong>{t("profile.email")}:</strong> {userDetails.email}
        </div>
        <div className="mb-4">
          <strong>{t("profile.role")}:</strong> {userDetails.role}
        </div>

        <div className="mb-4">
          <strong>{t("profile.roletype")}:</strong> {userDetails.roletype}
        </div>
        <div className="mb-4">
          <strong>{t("profile.company_name")}:</strong> {userDetails.companyname}
        </div>
        
        <div className="mb-4">
          <strong>{t("profile.designation")}:</strong> {userDetails.designation}
        </div>
        <div className="mb-4">
          <strong>{t("profile.emp_code")}:</strong> {userDetails.empcode}
        </div>
        <button 
          onClick={onClose} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default ProfileModal;

























































































































































































































































































































































































































































































































































































































































































