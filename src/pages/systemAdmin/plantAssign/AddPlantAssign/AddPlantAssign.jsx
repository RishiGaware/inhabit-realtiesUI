import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './AddPlantAssign.module.css';

import Select from 'react-select';
import { fetchUsersBasicInfo } from '../../../../services/systemAdmin/UserMasterService';
import {createPlantAssign,fetchAllPlantsAssign} from '../../../../services/systemAdmin/PlantAssignService';
import {fetchAllPlants} from '../../../../services/systemAdmin/PlantAssignService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddPlantAssign = () => {


  const [formData, setFormData] = useState({
    employeeID: '',
    selectedPlant: [],
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [plants, setPlants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Initialize navigate function

  const showMessagesFromHeader = (header, type = 'success') => {
    if (Array.isArray(header?.messages)) {
      header.messages.forEach(msg => {
        if (msg?.messageText) {
          if (msg.messageLevel === 'Information') {
            console.log('TOAST MESSAGE:', msg.messageText);
            toast.info(msg.messageText);
          } else {
            type === 'error' ? toast.error(msg.messageText) : toast.success(msg.messageText);
          }
        }
      });
    }
  };

  useEffect(() => {
    // toast.success('Test toast is working');

    fetchData(); // Fetch users and plants from API
  }, []);

  const fetchData = async () => {
    try {
      // Fetching user data
      const usersData = await fetchUsersBasicInfo();
      if (usersData.header?.errorCount === 0 && Array.isArray(usersData.usersBasicInfo)) {
        const formattedUsers = usersData.usersBasicInfo.map((user) => ({
          value: user.userID,
          label: `${user.firstName} ${user.lastName}`,
        }));
        setUsers(formattedUsers);
      } else {
        console.error('User fetch failed:', usersData.header?.messages?.[0]?.messageText);
        setUsers([]);
      }

      // Fetching plant data
      const plantsData = await fetchAllPlants();
      if (plantsData?.plants) {
        const formattedPlants = plantsData.plants.map((plant) => ({
          value: plant.plantID,
          label: plant.plantName, // Adjust field names based on the response data structure
        }));
        setPlants(formattedPlants);
      } else {
        console.error('Plant fetch failed:', plantsData?.header?.messages?.[0]?.messageText);
        setPlants([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers([]);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const plantID = parseInt(value); // important
  
    if (name === 'selectedPlant') {
      setFormData((prev) => ({
        ...prev,
        selectedPlant: checked
          ? [...prev.selectedPlant, plantID]
          : prev.selectedPlant.filter((id) => id !== plantID),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  
    if (!formData.employeeID || formData.selectedPlant.length === 0) {
      return; // Simply return without showing toast errors for field validation
    }
  
    const payload = {
      plantIDs: formData.selectedPlant.join(','), // Convert selected plant IDs to a comma-separated string
      userID: parseInt(formData.employeeID), // Ensure userID is an integer
      createdBy: "3", 
      electronicSignature: "string", 
      signatureDate: new Date().toISOString(),
    };
  
    try {
      const response = await createPlantAssign(payload);
      console.log('API Response:', response);
      console.log('Header Messages:', response.header?.messages);
    
      if (response.header?.errorCount === 0) {
        showMessagesFromHeader(response.header, 'success');
      
        setFormData({
          employeeID: '',
          selectedPlant: [],
        });
      
        setFormSubmitted(false); //  Reset validation indicators
      
        setTimeout(() => {
          navigate('/system-admin/plant-assign');
        }, 3000);
      } else {
        showMessagesFromHeader(response.header, 'error');
      }
    } catch (error) {
      console.error('Error submitting plant assignment:', error);
      toast.error('An error occurred while submitting the plant assignment.');
    }
  };


  const handleCancel = () => {
    window.history.back();
  };


  return (
    <>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className={styles.container}>
        <div className={styles.form}>
          <h2 className={styles.sectionHeading}>Assign Plants</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <label>
                Select User <span className={styles.required}>*</span>
              </label>
              <Select
                name="employeeID"
                value={users.find((user) => user.value === formData.employeeID)}
                options={users}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, employeeID: selectedOption ? selectedOption.value : '' })
                }
                isClearable
                isSearchable
                placeholder="-- Select User --"
                isLoading={loading}
                className="react-select"
              />
              {formSubmitted && !formData.employeeID && (
                <span className={styles.errorText}>User selection is required.</span>
              )}
            </div>

            <div className={styles.row}>
              <label>
                Select Plants <span className={styles.required}>*</span>
              </label>
            <div className={styles.checkboxContainer}>
              {plants.map((plant) => (
                <label key={plant.value} className={styles.roundCheckbox}>
                  <input
                    type="checkbox"
                    name="selectedPlant"
                    value={plant.value}
                    checked={formData.selectedPlant.includes(plant.value)}
                    onChange={handleChange}
                  />
                  <span className={styles.customCheckmark}></span>
                  {plant.label}
                </label>
              ))}
            </div>
            {formSubmitted && formData.selectedPlant.length === 0 && (
              <span className={styles.errorText}>At least one plant must be selected.</span>
            )}
          </div>

            <div className={styles.submitRow}>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
     
    </>
  );
};

export default AddPlantAssign;