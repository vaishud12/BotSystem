import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Incident/Admin.css'; // Ensure this CSS file is created for styling
import IncidentCategoryedit from './IncidentCategoryedit';

const IncidentCategory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const itemsPerPage = 5;
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Load data from the server
    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/agroincidentcategoryget");
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching data");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Delete an item
    const deleteObject = async (incidentcategoryid) => {
        if (window.confirm("Are you sure you want to delete this object?")) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/incidentcategorydelete/${incidentcategoryid}`);
                if (response.status === 200) {
                    setSuccessMessage('Incident category deleted successfully');
                    // Manually update the state by filtering out the deleted item
                    setData(prevData => prevData.filter(item => item.incidentcategoryid !== incidentcategoryid));
                }
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            } catch (error) {
                console.error("Error deleting object:", error);
            }
        }
    };

    // Group data by category
    const groupByCategory = (data) => {
        console.log('Grouping Data:', data); // Debugging line
        return data.reduce((acc, item) => {
            if (!acc[item.incidentcategory]) {
                acc[item.incidentcategory] = [];
            }
            acc[item.incidentcategory].push(item);
            return acc;
        }, {});
    };

    const groupedData = groupByCategory(data);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Object.entries(groupedData).slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle editing item
    const handleEditUserClick = (item) => {
        setEditItem(item);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="admin-container">
                <button 
                    className="btn btn-add" 
                    style={{
                        backgroundColor: '#3385ffdf',
                        color: 'white',
                        padding: '8px 17px',
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                    onClick={openModal}
                >
                    Add IncidentCategory
                </button>

                {chatbotVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="modal-close" onClick={closeModal}>&times;</span>
                            <IncidentCategoryedit onClose={closeModal} editItem={editItem} loadData={loadData} />
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                {data.length === 0 ? (
                    <p>No incidents found.</p>
                ) : (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Incident Category</th>
                                <th>Incident Name</th>
                                <th>Incident Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(([category, incidents], index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={incidents.length}>{category}</td>
                                        <td>{incidents[0].incidentname}</td>
                                        <td>{incidents[0].incidentdescription}</td>
                                        <td>
                                            <button className="btn btn-edit" onClick={() => handleEditUserClick(incidents[0])}>Edit</button>
                                            <button className="btn btn-delete" onClick={() => deleteObject(incidents[0].incidentcategoryid)}>Delete</button>
                                        </td>
                                    </tr>
                                    {incidents.slice(1).map((incident, subIndex) => (
                                        <tr key={subIndex}>
                                            <td>{incident.incidentname}</td>
                                            <td>{incident.incidentdescription}</td>
                                            <td>
                                                <button className="btn btn-edit" onClick={() => handleEditUserClick(incident)}>Edit</button>
                                                <button className="btn btn-delete" onClick={() => deleteObject(incident.incidentcategoryid)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}

                <center>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(Object.keys(groupedData).length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </center>
            </div>
        </>
    );
};

export default IncidentCategory;