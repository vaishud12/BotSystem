import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Ensure this CSS file is created for styling
import FAddEdit from './FAddEdit';
import { useTranslation } from 'react-i18next';
import * as API from "../Endpoint/Endpoint";
import FView from './FView';
const Admin = () => {
   
    const [incidentsByUser, setIncidentsByUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const { t } = useTranslation();
    const [selectedTag, setSelectedTag] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    
    const [fViewVisible, setFViewVisible] = useState(false);
    const openFViewModal = (incident) => {
        setSelectedIncident(incident);
        setFViewVisible(true);
    };

    const closeFViewModal = () => {
        setFViewVisible(false);
    };
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
   
    const [priorityTimes, setPriorityTimes] = useState({
        critical: '',
        veryhigh: '',
        high: '',
        medium: '',
        low: ''
    });
    
   
  // Function to handle viewing an incident in the modal
  
    
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get(API.GET_INCIDENT);
                const incidents = response.data;

                // Group incidents by user email
                const groupedIncidents = incidents.reduce((acc, incident) => {
                    if (!acc[incident.email]) {
                        acc[incident.email] = [];
                    }
                    acc[incident.email].push(incident);
                    return acc;
                }, {});

                setIncidentsByUser(Object.entries(groupedIncidents).map(([email, incidents]) => ({
                    email,
                    incidents,
                })));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching incidents:', err);
                setError('Failed to fetch incidents.');
                setLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    const loadData = async () => {
        try {
            const response = await axios.get(API.GET_INCIDENT);
            const incidents = response.data;
    
            // Group incidents by user email
            const groupedIncidents = incidents.reduce((acc, incident) => {
                if (!acc[incident.name]) {
                    acc[incident.name] = [];
                }
                acc[incident.name].push(incident);
                return acc;
            }, {});
    
            setIncidentsByUser(Object.entries(groupedIncidents).map(([name, incidents]) => ({
                name,
                incidents,
            })));
            setLoading(false);

            // Check resolved status for each incident
            await Promise.all(
                incidentsByUser.flatMap(user =>
                    user.incidents.map(incident => checkResolvedStatus(incident.incidentid))
                )
            ); // Update resolved status if needed
        } catch (err) {
            console.error('Error fetching incidents:', err);
            setError('Failed to fetch incidents.');
            setLoading(false);
        }
    };
    const loadTags = async () => {
        try {
            const response = await axios.get(API.GET_TAGS);
            console.log("Fetched tags:", response.data); // Debugging line
            setTags(response.data.map(tagObj => tagObj.tagss)); // Ensure `tagss` is correct
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    
    // Fetch data on component mount
    useEffect(() => {
        loadData();
        loadTags();
    }, []);
    
    const checkResolvedStatus = async (incidentId) => {
        try {
            const response = await axios.get(`${API.CHECK_RESOLUTION_STATUS}/${incidentId}`);
            const isResolved = response.data.resolved; // Assuming the API returns { resolved: true/false }
    
            // Update the state if resolved
            setIncidentsByUser((prev) => prev.map(user => ({
                email: user.email,
                incidents: user.incidents.map(incident => ({
                    ...incident,
                    resolved: incident.incidentid === incidentId ? isResolved : incident.resolved,
                }))
            })));
        } catch (err) {
            console.error('Error checking resolved status:', err);
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter incidents based on search query
    const filterIncidents = (incidentsByUser) => {
        console.log("Search Query:", searchQuery);
        console.log("Selected Tag:", selectedTag);
        console.log("Incidents By User:", incidentsByUser);
    
        return incidentsByUser.filter(user => {
            const hasMatchingIncident = user.incidents.some(incident => {
                const matchesSearchQuery = (
                    (incident.incidentname && incident.incidentname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.description && incident.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.sector && incident.sector.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.category && incident.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.priority && incident.priority.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.status && incident.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (Array.isArray(incident.tagss) && incident.tagss.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                    (incident.date && incident.date.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (incident.gps && incident.gps.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
                );
    
                return matchesSearchQuery;
            });
    
            // Check for selected tag if it is not empty
            const matchesSelectedTag = selectedTag === '' || user.incidents.some(incident =>
                Array.isArray(incident.tagss) && incident.tagss.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
            );
    
            return hasMatchingIncident && matchesSelectedTag;
        });
    };
    
    
    const handlePriorityTimesSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API.SET_PRIORITY_TIMES, priorityTimes);
            alert('Priority times updated successfully.');
        } catch (err) {
            console.error('Error updating priority times:', err);
            alert('Failed to update priority times.');
        }
    };

    const handlePriorityTimeChange = (e) => {
        const { name, value } = e.target;
        setPriorityTimes(prevTimes => ({
            ...prevTimes,
            [name]: value
        }));
    };

    
    
    

    const filteredIncidents = filterIncidents(incidentsByUser);
    const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEditUserClick = (incidentid) => {
        setEditItem(incidentid);
        openModal();
    };
   
    
    const openModal = () => {
        setChatbotVisible(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling on the body
    };

    const closeModal = () => {
        setChatbotVisible(false);
        document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };

    const deleteObject = async (incidentid) => {
        if (window.confirm("Are you sure you want to delete this object?")) {
          try {
            await axios.delete(API.DELETE_INCIDENT(incidentid), {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log('Success: Object deleted successfully');
            loadData(); 
          } catch (error) {
            console.error("Error deleting object:", error);
          }
        }
      };
      
      
    //   const imageUrl = `http://localhost:5014/uploads/${incident.photo}`; // Adjust the URL based on your server configuration

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="admin-container">
                <button 
                    className="btn btn-add" 
                    style={{
                        backgroundColor: '#3385ffdf',  // Blue background
                        color: 'white',              // White text
                        padding: '8px 17px',        // Padding for spacing
                        fontSize: '14px',            // Font size
                        border: 'none',              // No border
                        borderRadius: '5px',         // Rounded corners
                        cursor: 'pointer',           // Pointer cursor on hover
                        transition: 'background-color 0.3s',  // Smooth background-color transition
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Light shadow for depth
                    }} 
                    onClick={openModal}
                >
                    {t("incidentd.add_incident")}
                </button>
                <div className="priority-container">
                    <form onSubmit={handlePriorityTimesSubmit} className="priority-form">
                        <h3 className="priority-heading">{t("incidentd.set_priority_times")}</h3>
                        <div className="priority-inputs">
                            {Object.keys(priorityTimes).map(priority => (
                                <div key={priority} className="priority-input-wrapper">
                                    <label className="priority-label">
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}:
                                        <input
                                            type="text"
                                            name={priority}
                                            value={priorityTimes[priority]}
                                            onChange={handlePriorityTimeChange}
                                            placeholder="Time in hours"
                                            min="0"
                                            className="priority-input"
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="priority-button">{t("incidentd.save_priority_times")}</button>
                    </form>
                </div>

<div style={{
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    marginBottom: '12px' // Space below the input field
}}>
    <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        style={{
            width: '300px',  // Fixed width for smaller size
            maxWidth: '100%', // Responsive width
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc', // Light border
            borderRadius: '4px', // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
            fontFamily: 'Poppins'
        }}
    />
</div>

<select 
                    value={selectedTag} 
                    onChange={(e) => setSelectedTag(e.target.value)} 
                    className="tag-select"
                >
                    <option value="">{t("incidentd.all_tags")}</option>
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <option key={index} value={tag}>{tag}</option>
                        ))
                    ) : (
                        <option value="">Loading Tags...</option>
                    )}
                </select>

                


                {chatbotVisible && (
                    < div className="modal-overlay" >
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <FAddEdit onClose={closeModal} editItem={editItem} loadData={loadData} />
                         </div>   
                        
                   
                )}

                {incidentsByUser.length === 0 ? (
                    <p>No incidents found.</p>
                ) : (
                    
                    <div div className="table-wrapperrr">
                    <table className="styled-table">
                        <thead>
                            <tr>
                            <th>{t("incidentd.s_no")}</th>
                                <th>{t("incidentd.user_email")}</th>
                                <th>{t("incidentd.incident_id")}</th>
                                <th>{t("incidentd.sector")}</th>
                                <th>{t("incidentd.category")}</th>
                                <th>{t("incidentd.incident_name")}</th>
                                <th>{t("incidentd.description")}</th>
                                <th>{t("incidentd.date")}</th>
                                <th>{t("incidentd.gps")}</th>
                                <th>{t("incidentd.current_address")}</th>
                                <th>{t("incidentd.incident_owner")}</th>
                                <th>{t("incidentd.raised_to_user")}</th>
                                <th>{t("incidentd.tags")}</th>
                                <th>{t("incidentd.priority")}</th>
                                <th>{t("incidentd.status")}</th>
                                <th>{t("incidentd.remark")}</th>
                                <th>{t("incidentd.image")}</th>
                                <th>Resolved</th>
                                <th>{t("incidentd.action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((user, userIndex) => (
        user.incidents.map((incident, incidentIndex) => (
            <tr key={`${userIndex}-${incidentIndex}`}>
                <td>{(currentPage - 1) * itemsPerPage + incidentIndex + 1}</td> {/* Serial number */}
                {incidentIndex === 0 && (
                    <td rowSpan={user.incidents.length}><b>{user.name}</b></td>
                )}
                <td>{incident.incidentid || 'N/A'}</td>
                <td>{incident.sector || 'N/A'}</td>
                <td>{incident.incidentcategory || 'N/A'}</td>
                <td>{incident.incidentname || 'N/A'}</td>
                <td>{incident.incidentdescription || 'N/A'}</td>
                <td>{incident.date || 'N/A'}</td>
                <td>{incident.gps || 'N/A'}</td>
                <td>{incident.currentaddress || 'N/A'}</td>
                <td>{incident.incidentowner || 'N/A'}</td>
                <td>{incident.raisedtouser || 'N/A'}</td>
                <td>{incident.tagss.length > 0 ? incident.tagss.join(', ') : 'N/A'}</td>

                <td>{incident.priority || 'N/A'}</td>
                <td>{incident.status || 'N/A'}</td>
                <td>{incident.remark || 'N/A'}</td>
                <td>
                {incident.photo ? (
                                <img
                                    src={API.GET_IMAGE_URL(incident.photo)} // Update this based on your image path
                                    alt={incident.incidentname}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            ) : (
                                <p>No Image</p>
                            )}
                           
            </td>
            <td style={{ color: incident.resolved ? 'red' : 'green', fontWeight: 'bold' }}>
            {incident.resolved ? 'Inactive (Resolved)' : 'Active (Unresolved)'}
        </td>
                      
                <td>
                
                <button 
                                                onClick={() => openFViewModal(incident)}
                                                className="btn btn-view"
                                            >
                                                {t("incidentd.view")}
                                            </button>
                {fViewVisible && selectedIncident && (
    <div className="backdrop">
        <div className="modal-body">
            <FView 
                isOpen={fViewVisible} 
                closeModal={closeFViewModal} 
                incident={selectedIncident} 
            />
        </div>
    </div>
)}
     
                    <button className="btn btn-edit" onClick={() => handleEditUserClick(incident.incidentid)}>{t("incidentd.edit")}</button>
                    <button className="btn btn-delete" onClick={() => deleteObject(incident.incidentid)}>{t("incidentd.delete")}</button>
                </td>
            </tr>
        ))
    ))}
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
            
           
        </>
    );
};

export default Admin;
