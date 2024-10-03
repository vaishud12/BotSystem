import React, { useCallback,  useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FAddEdit.css';
import MapComponent from '../components/MapComponent';
import * as API from "../Endpoint/Endpoint";
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles
import PlainTextQuillEditor from '../components/PlainTextQuillEditor';
// import AgroSuggestions from '../components/AgroSuggestions'
import { useTranslation } from 'react-i18next';
const initialState = {
    sector:'', 
    incidentcategory: '',
    incidentname: '',
    incidentowner: '',
    incidentdescription: '',
    date: '',
    currentaddress: '',
  
    raisedtouser: '',
    
    status: ''
};

const FAddEdit = ({ visible, onClose, editItem, loadData}) => {
    const [state, setState] = useState(initialState);
    const [emailSent, setEmailSent] = useState(false);
    const [message, setMessage] = useState(false);
    const { t } = useTranslation();
    const [sectors, setSectors] = useState([]);
    const [incidentCategories, setIncidentCategories] = useState([]);
    const [incidentNames, setIncidentNames] = useState([]);
    const [priority, setPriority] = useState('');
    const [incidentDescriptions, setIncidentDescriptions] = useState([]);
    const {sector, incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress,  raisedtouser, status} = state;
    const { incidentid } = useParams();
    const userId = localStorage.getItem("user_id");
    console.log(userId);
    const [tags, setTags] = useState([]);
    const [query, setQuery] = useState('');
    const [remark, setRemark] = useState('');
    const [emailValidation, setEmailValidation] = useState({ exists: true, message: '' });
    const [showConfirmInvite, setShowConfirmInvite] = useState(false);

    const [photo, setPhoto] = useState(null);

    const [gps, setGps] = useState("");
    const handlePlaceSelect = (coordinates) => {
        const { lat, lng } = coordinates; // Destructure latitude and longitude
        setGps(`${lat}, ${lng}`); // Update state with coordinates
      };
    // console.log(editItem.incidentid)
    // Constant variable for tag names
    const tagNames = tags.map(tag => tag.name);
  
    // Handle tag addition
    const onAddition = useCallback(
      (newTag) => {
        if (newTag && !tags.find((tag) => tag.name === newTag.name)) {
          setTags((prevTags) => [...prevTags, newTag]);
        }
      },
      [tags]
    );
  
    // Handle tag deletion
    const onDelete = useCallback((tagIndex) => {
      setTags((prevTags) => prevTags.filter((_, i) => i !== tagIndex));
    }, []);
  
    // Handle input changes
    const onInput = useCallback((query) => {
      setQuery(query);
    }, []);
  
    // Handle input key press to add tag
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault(); // Prevent default form submission or other behavior
        onAddition({ id: tags.length + 1, name: query.trim() });
        setQuery(''); // Clear input after adding
      }
    };
  
    // Handle input blur event to create tag if input is not empty
    const handleBlur = () => {
      if (query.trim()) {
        onAddition({ id: tags.length + 1, name: query.trim() });
        setQuery(''); // Clear input after adding
      }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(API.CHECK_EMAIL(email));
            setEmailValidation({
                exists: response.data.exists,
                message: response.data.exists ? '' : 'Email not found',
            });
    
            // If the email is not found, trigger the popup
            if (!response.data.exists) {
                setShowConfirmInvite(true);
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailValidation({
                exists: false,
                message: 'Error checking email',
            });
    
            // Optionally, you might want to show a popup if there's an error with the request
            setShowConfirmInvite(true);
        }
    };
    
    
    useEffect(() => {
        if (raisedtouser) {
            const debounceCheck = setTimeout(() => {
                checkEmailExists(raisedtouser);
            }, 500); // Debounce time to prevent excessive API calls
    
            return () => clearTimeout(debounceCheck);
        }
    }, [raisedtouser]);


    useEffect(() => {
        if (editItem && editItem.incidentid) {
            setState(editItem);
        } else if (incidentid) {
            axios.get(API.GET_SPECIFIC_INCIDENT(incidentid))
                .then(resp => {
                    console.log("Response:", resp.data);
                    setState(resp.data[0]);
                })
                .catch(error => console.error(error));
        }
    }, [editItem, incidentid]);

    useEffect(() => {
        axios.get(API.GET_DISTINCT_SECTOR)
            .then((resp) => {
                console.log("Incident sector data:", resp.data);
                setSectors(resp.data);
            })
            .catch(error => {
                console.error("Error fetching incident sector:", error);
            });
    }, []);

    useEffect(() => {
        if (sector) { // Fetch only if sector is selected
            axios.get(`${API.GET_DISTINCT_INCIDENT_CATEGORY}?sector=${sector}`)
                .then((resp) => {
                    console.log("Incident category data:", resp.data);
                    setIncidentCategories(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching incident category:", error);
                });
        }
    }, [sector]); // Dependency array includes sector

    useEffect(() => {
        if (incidentcategory) {
            axios.get(`${API.GET_INCIDENT_NAME_BASEDON_INCIDENTCATEGORY}?incidentcategory=${incidentcategory}`)
                .then((resp) => {
                    console.log("Incident names Data:", resp.data);
                    setIncidentNames(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching incident names:", error);
                });
        }
    }, [incidentcategory]);
    
    useEffect(() => {
        if (incidentname) {
            axios.get(`${API.GET_INCIDENT_DESCRIPTION_BASEDON_INCIDENTNAME}?incidentname=${incidentname}`)
                .then((resp) => {
                    console.log("Incident descriptions Data:", resp.data);
                    setIncidentDescriptions(resp.data);
                })
                .catch(error => {
                    console.error("Error fetching incident descriptions:", error);
                });
        }
    }, [incidentname]);
    

    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Form submitted");
        console.log("Form data:", { sector, incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser });
    
        if (!sector || !incidentcategory || !incidentname || !incidentowner || !incidentdescription || !date || !currentaddress || !gps || !raisedtouser) {
            alert("Please provide a value for each input field");
            return;
        }
    
        try {
            // Fetch priority times from the server
            const priorityResponse = await axios.get(API.GET_PRIORITY_TIME);
            const priorityTimes = priorityResponse.data;
    
            // Determine the appropriate priority time
            let timeFrame = '24 hours'; // Default value
            switch (priority) {
                case 'critical':
                    timeFrame = priorityTimes.critical;
                    break;
                case 'veryhigh':
                    timeFrame = priorityTimes.veryhigh;
                    break;
                case 'high':
                    timeFrame = priorityTimes.high;
                    break;
                case 'medium':
                    timeFrame = priorityTimes.medium;
                    break;
                case 'low':
                    timeFrame = priorityTimes.low;
                    break;
                default:
                    break;
            }
    
            // Fetch user data
            const userResponse = await axios.get(API.GET_USERBYID_API(raisedtouser));
            console.log("User response:", userResponse.data);
    
            if (userResponse.data && userResponse.data.userid) {
                const raisedToUserId = userResponse.data.userid;
                console.log('Raised to User ID:', raisedToUserId);
    
                // Create FormData object
                const formData = new FormData();
                formData.append('sector', sector);
                formData.append('incidentcategory', incidentcategory);
                formData.append('incidentname', incidentname);
                formData.append('incidentowner', incidentowner);
                formData.append('incidentdescription', incidentdescription);
                formData.append('date', date);
                formData.append('currentaddress', currentaddress);
                formData.append('gps', gps);
                formData.append('raisedtouser', raisedtouser);
                formData.append('status', status);
                formData.append('userid', raisedToUserId);
                formData.append('id', userId);
                formData.append('tagss', tagNames); // Assuming `tagNames` is defined elsewhere
                formData.append('priority', priority);
                formData.append('remark', remark);
                if (Array.isArray(tagNames)) {
                    tagNames.forEach(tag => {
                        formData.append('tagss[]', tag); // Add each tag separately
                    });
                }
                // Append photo if available
                if (photo) {
                    formData.append('photo', photo);
                }
    
                console.log("Form Data:", formData);
    
                // Submit data
                if (editItem && editItem.incidentid) {
                    // For updating an existing record
                    await axios.put(API.UPDATE_SPECIFIC_INCIDENT(editItem.incidentid), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    // For creating a new record
                    await axios.post(API.POST_INCIDENT, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
    
                setState(initialState);
                toast.success(`${editItem && editItem.incidentid ? 'Incident updated' : 'Incident added'} successfully`);
    
               // Prepare FormData object for email payload
            const emailFormData = new FormData();
            emailFormData.append('email1', raisedtouser);
            emailFormData.append('from', incidentowner);
            emailFormData.append('sector', sector);
            emailFormData.append('incidentcategory', incidentcategory);
            emailFormData.append('incidentname', incidentname);
            emailFormData.append('incidentowner', incidentowner);
            emailFormData.append('incidentdescription', incidentdescription);
            emailFormData.append('date', date);
            emailFormData.append('currentaddress', currentaddress);
            emailFormData.append('gps', gps);
            emailFormData.append('raisedtouser', raisedtouser);
            emailFormData.append('status', status);
            emailFormData.append('priority', priority);
            emailFormData.append('remark', remark);

            // Append photo if available
            if (photo) {
                emailFormData.append('photo', photo); // Attach the file for the email
            }

            console.log("Email FormData:", emailFormData);

            // Send email with incident details
            try {
                const emailResponse = await axios.post(API.SEND_INCIDENT_EMAIL, emailFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("Email response:", emailResponse);

                if (emailResponse.status === 200) {
                    toast.success('Email sent successfully');
                    setEmailSent(true);
                }
            } catch (emailError) {
                if (emailError.response && emailError.response.status === 404) {
                    toast.warn(emailError.response.data.message || 'User not found.');
                    setShowConfirmInvite(true);  // Show confirmation dialog
                } else {
                    toast.error("An error occurred while sending the email.");
                }
            }

    
                // Prepare and open WhatsApp URL
                const message = `This Incident ${incidentname} Should be Resolved within ${timeFrame}!!!!! ... Sector: ${sector}, Incident Category: ${incidentcategory}\nIncident Name: ${incidentname}\nIncident Owner: ${incidentowner}\nIncident Description: ${incidentdescription}\nDate: ${date}\nCurrent Address: ${currentaddress}\nGPS: ${gps}\nRaised to User: ${raisedtouser}\nStatus: ${status}\ntags:${tagNames}\npriority:${priority}\nRemark:${remark}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
    
                loadData();
            } else {
                toast.error("User not found.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("An error occurred while processing the request.");
        }
    };
    
    
const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleRemarkChange = (plainText) => {
    setRemark(plainText);
  };
    const handleGoBack = () => {
        onClose();
    };

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;

        if (name === "priority") {
            setPriority(value);
        }
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === "gps") {
            setGps(value); // Assuming setCoordinates is defined to manage GPS state
        }
        
        // const handleEmailChange = (e) => {
        //     const email = e.target.value;
        //     setState((prevState) => ({ ...prevState, raisedtouser: email }));
        
        //     // Trigger the email existence check
        //     checkEmailExists(email);
        // };
        
        // Handle input change
        if (name === "raisedtouser") {
            // Update email value in the state
            setState(prevState => ({
                ...prevState,
                raisedtouser: value
            }));
    
            // Trigger email existence check
            checkEmailExists(value);
        }
        // Fetch incident names and descriptions when category or name changes
        if (name === 'sector') {
            setState(prevState => ({
                ...prevState,
                sector: value,
                incidentcategory: '', // Reset incident category when sector changes
                incidentname: '', // Reset incident name when sector changes
                incidentdescription: '' // Reset description when sector changes
            }));
        } else if (name === 'incidentcategory') {
            setState(prevState => ({
                ...prevState,
                incidentcategory: value,
                incidentname: '', // Reset incident name when category changes
                incidentdescription: '' // Reset description when category changes
            }));
        } else if (name === 'incidentname') {
            setState(prevState => ({
                ...prevState,
                incidentname: value,
                incidentdescription: '' // Reset description when name changes
            }));
        }
    };
  console.log(tags);
  const handleInviteConfirmation = async (confirm) => {
    if (confirm) {
        const invitePayload = {
            email: raisedtouser,
           
        };
        try {
            await axios.post(API.SEND_INVITE_EMAIL, invitePayload);
            toast.success('Invitation sent successfully');
            setMessage("Invitation sent successfully");
        } catch (error) {
            toast.error("Failed to send invitation.");
            setMessage("Failed to send invitation.");
        }
    } else {
        toast.error("User was not found and invitation was not sent.");
    }
    setShowConfirmInvite(false);  // Close the confirmation dialog
};

    return (
        <div className={`modal ${visible ? 'show' : 'hide'}`} style={{ marginTop: "20px" }}>
            <div className="modal-content">
                <center><h1>{editItem && editItem.incidentid ? 'Edit Incident' : 'Add Incident'}</h1></center>
                <form onSubmit={handleSubmit}>
                <div>
                        <label>{t("addincident.add_incident")}</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="sector"
                            name="sector"
                            value={sector || ""}
                            onChange={handleInputChange}
                        >
                            <option value=""> {t("addincident.select_sector")}</option>
                            {sectors.map((sectory, index) => (
                                <option
                                    key={sectory.incidentcategoryid}
                                    value={sectory.sector}
                                >
                                    {sectory.sector}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t("addincident.incident_category")}</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentcategory"
                            name="incidentcategory"
                            value={incidentcategory || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("addincident.select_incident_category")}</option>
                            {incidentCategories.map((category, index) => (
                                <option
                                    key={category.incidentcategoryid}
                                    value={category.incidentcategory}
                                >
                                    {category.incidentcategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t("addincident.incident_name")}</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentname"
                            name="incidentname"
                            value={incidentname || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("addincident.select_incident_name")}</option>
                            {incidentNames.map((name, index) => (
                                <option
                                    key={name.incidentnameid}
                                    value={name.incidentname}
                                >
                                    {name.incidentname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{t("addincident.incident_description")}</label>
                        <select
                            style={{ fontFamily: "Poppins" }}
                            id="incidentdescription"
                            name="incidentdescription"
                            value={incidentdescription || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("addincident.select_incident_description")}</option>
                            {incidentDescriptions.map((description, index) => (
                                <option
                                    key={description.incidentdescriptionid}
                                    value={description.incidentdescription}
                                >
                                    {description.incidentdescription}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label htmlFor="incidentowner">{t("addincident.incident_owner")}</label>
                    <input
                        type="email"
                        id="incidentowner"
                        name="incidentowner"
                        value={incidentowner || ""}
                        placeholder={t("addincident.enter_incident_owner_email")}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="date">{t("addincident.date")}</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date || ""}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="currentaddress">{t("addincident.current_address")}</label>
                    <input
                        type="text"
                        id="currentaddress"
                        name="currentaddress"
                        value={currentaddress || ""}
                        placeholder={t("addincident.enter_current_address")}
                        onChange={handleInputChange}
                    />

<label htmlFor="gps">{t("addincident.gps")}</label>
      <MapComponent onPlaceSelect={handlePlaceSelect} />
      <input
        type="text"
        id="gps"
        name="gps"
        value={gps || ""}
        placeholder={t("addincident.enter_gps_coordinates")}
        onChange={handleInputChange}
      />

<div>
    <label htmlFor="raisedtouser">{t("addincident.raise_to_user")}</label>
    <input
        type="email"
        id="raisedtouser"
        name="raisedtouser"
        value={raisedtouser || ""}
        placeholder={t("addincident.enter_raise_user_email")}
        onChange={handleInputChange}
    />
    {!emailValidation.exists && <div style={{ color: 'red' }}>{emailValidation.message}</div>}

    {message && <div style={{ color: 'green' }}className="message">{message}</div>}
</div>
<div>
      <p>{t("addincident.select_or_add_tags")}.</p>
      <div className="tag-input-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag.name}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="tag-remove-button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Add new tag"
          className="tag-input"
        />
      </div>
      <p><b>{t("addincident.tag_names")}</b></p>
      <pre><code>{JSON.stringify(tagNames, null, 2)}</code></pre>
</div>             
                    <label htmlFor="status">{t("addincident.status")}</label>
                    <select
                        id="status"
                        name="status"
                        value={status || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">{t("addincident.select_status")}</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="inprogress">In Progress</option>
                        <option value="onhold">On Hold</option>
                    </select>

                    <label htmlFor="priority">{t("addincident.priority")}</label>
<div onChange={handleInputChange} style={{ margin: '10px 0' }}>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff0000' }}>
        <input
            type="radio"
            name="priority"
            value="critical"
            checked={priority === "critical"}
            style={{ marginRight: '8px' }}
        />
       {t("addincident.critical")}  
    </label> 
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff4500' }}>
        <input
            type="radio"
            name="priority"
            value="veryhigh"
            checked={priority === "veryhigh"}
            style={{ marginRight: '8px' }}
        />
       {t("addincident.very_high")}
    </label>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ff8c00' }}>
        <input
            type="radio"
            name="priority"
            value="high"
            checked={priority === "high"}
            style={{ marginRight: '8px' }}
        />
        {t("addincident.high")}
    </label>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer', color: '#ffd700' }}>
        <input
            type="radio"
            name="priority"
            value="medium"
            checked={priority === "medium"}
            style={{ marginRight: '8px' }}
        />
        {t("addincident.medium")}
    </label>
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#32cd32' }}>
        <input
            type="radio"
            name="priority"
            value="low"
            checked={priority === "low"}
            style={{ marginRight: '8px' }}
        />
        {t("addincident.low")}
    </label>
</div>
<input type="file" name="photo" onChange={handlePhotoChange} />
      {/* Rich Text Editor for Remark */}
      <PlainTextQuillEditor onChange={handleRemarkChange} />

                    <input type="submit" value={editItem && editItem.incidentid ? "Update" : "Save"} />
                    {emailSent && <div style={{ color: 'green', marginTop: '10px' }}>Email sent successfully!</div>}
                </form>
                <button onClick={handleGoBack}>Go Back</button>
                
            </div>
            {showConfirmInvite && (
            <div className="confirmation-dialog">
                <p>The email address is not registered. Do you want to send an invitation?</p>
                <button onClick={() => handleInviteConfirmation(true)}>Yes</button>
                <button onClick={() => handleInviteConfirmation(false)}>No</button>
            </div>
        )}
        </div>
    );
};

export default FAddEdit;
