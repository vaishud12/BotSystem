import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResolutionTable.css';
import ResolutionAddEdit from './ResolutionAddEdit';
import { useTranslation } from 'react-i18next';
import * as API from "../Endpoint/Endpoint";

const ResolutionTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const { t } = useTranslation();
  const [resolutionsByUser, setResolutionsByUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const response = await axios.get(API.GET_ADMIN_RESOLUTION);
        const resolutions = response.data;

        // Group resolutions by user name instead of email
        const groupedResolutions = resolutions.reduce((acc, resolution) => {
            // Assuming resolution.user contains the email and resolution.name contains the user's name
            const userName = resolution.name || resolution.user; // Fallback to email if name is not available

            if (!acc[userName]) {
                acc[userName] = [];
            }
            acc[userName].push(resolution);
            return acc;
        }, {});

        // Set state with user names
        setResolutionsByUser(Object.entries(groupedResolutions).map(([user, resolutions]) => ({
            user, // This is now the user name
            resolutions,
        })));

        setLoading(false);
    } catch (err) {
        console.error('Error fetching resolutions:', err);
        setError('Failed to fetch resolutions.');
        setLoading(false);
    }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resolutionsByUser.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (item) => {
    setEditItem(item);
    setModalVisible(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setModalVisible(false);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    loadData(); // Refresh data when modal is closed
  };

  const deleteObject = async (resolutionid) => {
    if (window.confirm("Are you sure you want to delete this resolution?")) {
      try {
        await axios.delete(API.DELETE_RESOLUTION(resolutionid), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Success: Resolution deleted successfully');
        loadData(); // Refresh data after deletion
      } catch (error) {
        console.error("Error deleting resolution:", error);
        setError('Failed to delete resolution.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ marginTop: '30px', position: 'relative' }}>
  <button className="btn btn-contact" onClick={() => setModalVisible(true)}>{t("resolutiond.add_resolution")}</button>

  {/* {modalVisible && (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={closeModal}>&times;</span>
        <ResolutionAddEdit onClose={closeModal}   />
      </div>
    </div>
  )} */}

  {resolutionsByUser.length === 0 ? (
    <p>No resolutions found.</p>
  ) : (
    <div className="table-wrappera" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', marginTop: '50px' }}>
      <table className="styled-table" style={{ width: '100%', height:'100%'  }} >
        <thead>
          <tr>
            <th>{t("resolutiond.sr_no")}</th> {/* Added serial number column */}
            <th>{t("resolutiond.user")}</th>
            <th>{t("resolutiond.resolution_id")}</th>
            <th>{t("resolutiond.incident_id")}</th>
            <th>{t("resolutiond.sector")}</th>
            <th>{t("resolutiond.incident_category")}</th>
            <th>{t("resolutiond.incident_name")}</th>
            <th>{t("resolutiond.incident_owner")}</th>
            <th>{t("resolutiond.resolution_date")}</th>
            <th>{t("resolutiond.resolution_remark")}</th>
            <th>{t("resolutiond.resolved_by")}</th>
            <th>{t("resolutiond.action")}</th>
          </tr>
        </thead>
        <tbody>
          {resolutionsByUser.flatMap((userGroup, userIndex) =>
            userGroup.resolutions.map((resolution, index) => (
              <tr key={`${userIndex}-${index}`}>
                <td>
                  {(currentPage - 1) * itemsPerPage + userIndex * itemsPerPage + index + 1}
                </td> {/* Serial number */}
                {index === 0 && (
                  <td rowSpan={userGroup.resolutions.length}><b>{userGroup.user}</b></td>
                )}
                <td>{resolution.resolutionid }</td>
                <td>{resolution.incidentid || 'N/A'}</td>
                <td>{resolution.sector || 'N/A'}</td>
                <td>{resolution.incidentcategory || 'N/A'}</td>
                <td>{resolution.incidentname || 'N/A'}</td>
                <td>{resolution.incidentowner || 'N/A'}</td>
                <td>{resolution.resolutiondate || 'N/A'}</td>
                <td>{resolution.resolutionremark || 'N/A'}</td>
                <td>{resolution.resolvedby || 'N/A'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(resolution)}>{t("resolutiond.edit")}</button>
                  <button className="btn btn-delete" onClick={() => deleteObject(resolution.resolutionid)}>{t("resolutiond.delete")}</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )}

<center>
  <div className="pagination">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &#x2039; {/* Left arrow */}
    </button>

    {Array.from(
      { length: Math.ceil(filteredData.length / itemsPerPage) },
      (_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={currentPage === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      )
    )}

    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={
        currentPage === Math.ceil(filteredData.length / itemsPerPage)
      }
    >
      &#x203A; {/* Right arrow */}
    </button>
  </div>
</center>

</div>
  );
};

export default ResolutionTable;
