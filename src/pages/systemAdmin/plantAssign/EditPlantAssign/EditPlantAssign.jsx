import React, { useEffect, useState, useContext } from "react";
import styles from "./EditPlantAssign.module.css";
import { useNavigate } from "react-router-dom";
import { PlantAssignContext } from "../../../../context/PlantAssignContext";

import { fetchAllPlants } from '../../../../services/systemAdmin/PlantMasterService';
import { updatePlantAssign } from "../../../../services/systemAdmin/PlantAssignService"; // Correct import for updatePlantAssign
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const EditPlantAssign = () => {
  const navigate = useNavigate();
  const { selectedPlantAssignment } = useContext(PlantAssignContext);

  const [formData, setFormData] = useState({
    employeeID: '',
    selectedPlant: [],
  });

  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantsData = await fetchAllPlants();
        const formattedPlants = plantsData?.plants?.map(p => ({
          value: p.plantID,
          label: p.plantName,
        })) || [];
        setPlants(formattedPlants);
        console.log(formattedPlants);
      } catch (error) {
        console.error("Error fetching plants:", error);
        setPlants([]);
      }
    };

    fetchPlants();

    if (selectedPlantAssignment?.employeeID) {
      setFormData({
        employeeID: selectedPlantAssignment.employeeID || '',
        selectedPlant: Array.isArray(selectedPlantAssignment.plantIDs)
          ? selectedPlantAssignment.plantIDs
          : typeof selectedPlantAssignment.plantIDs === 'string'
          ? selectedPlantAssignment.plantIDs
              .split(',')
              .map(id => parseInt(id))
              .filter(id => !isNaN(id))
          : [],
      });
    }
  }, [selectedPlantAssignment]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const plantID = parseInt(value);
  
    if (name === "selectedPlant" && !isNaN(plantID)) {
      setFormData(prev => ({
        ...prev,
        selectedPlant: checked
          ? [...prev.selectedPlant, plantID]
          : prev.selectedPlant.filter(id => id !== plantID),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.employeeID || formData.selectedPlant.length === 0) {
      toast.error("Please select at least one plant.");
      return;
    }
  
    const payload = {
      plantAssignmentID: selectedPlantAssignment?.plantAssignmentID,
      plantIDs: formData.selectedPlant
        .filter(Boolean)                 // Remove null/undefined/false/0
        .map(String)
        .join(','),
      userId: formData.employeeID,
      modifiedBy: "admin",
      reasonForChange: "Updating plant assignment",
      electronicSignature: "signature_placeholder",
      signatureDate: new Date().toISOString(),
    };
  
    try {
      const response = await updatePlantAssign(payload); // Use correct API function
      console.log('API Response:', response);
      console.log('Header Messages:', response.header?.messages);
  
      if (response.header?.errorCount === 0) {
        showMessagesFromHeader(response.header, 'success');

        setTimeout(() => {
          navigate('/system-admin/plant-assign');
        }, 3000);
      } else {
        showMessagesFromHeader(response.header, 'error');
      }
    } catch (error) {
      console.error('Error updating plant assignment:', error);
    
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            toast.error(`${field}: ${msg}`, { autoClose: 3000 });
          });
        });
      } else {
        toast.error("An unexpected error occurred.", { autoClose: 3000 });
      }
    }
  };
  
  const showMessagesFromHeader = (header, type) => {
    if (header?.messages?.length > 0) {
      header.messages.forEach((msg) => {
        if (msg.messageText) {
          if (type === 'success') {
            toast.success(msg.messageText, { autoClose: 3000 });
          } else if (type === 'error') {
            toast.error(msg.messageText, { autoClose: 3000 });
          }
        }
      });
    }
  };

  const handleCancel = () => {
    navigate("/system-admin/plant-assign");
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
          <h2 className={styles.sectionHeading}>Edit Plant Assignment</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <label>
                User <span className={styles.required}>*</span>
              </label>
              <div style={{ padding: "10px", backgroundColor: "#f3f3f3", borderRadius: "8px", fontWeight: 500 }}>
                {selectedPlantAssignment?.fullName || "No user selected"}
              </div>
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
            </div>

            <div className={styles.submitRow}>
              <button type="submit">Update</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPlantAssign;