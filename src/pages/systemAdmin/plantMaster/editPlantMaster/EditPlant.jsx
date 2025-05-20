import React, { useState, useEffect, useContext } from 'react';
import styles from './EditPlant.module.css';

import { useNavigate, useLocation } from 'react-router-dom';
import { updatePlant } from '../../../../services/systemAdmin/PlantMasterService';
import { PlantContext } from '../../../../context/PlantContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPlant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPlant } = useContext(PlantContext);

  const [formData, setFormData] = useState({
    plantID: selectedPlant?.plantID || '',
    plantName: selectedPlant?.plantName || ''
  });
  const [reasonForChange, setReasonForChange] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.plant) {
      setFormData({
        plantID: location.state.plant.plantID,
        plantName: location.state.plant.plantName
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'plantName') {
      setFormData((prev) => ({ ...prev, plantName: value }));
    } else if (name === 'reasonForChange') {
      setReasonForChange(value);
    }
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.plantName.trim()) {
      setError('Plant name is required.');
      return;
    }

    if (!reasonForChange.trim()) {
      setError('Reason for change is required.');
      return;
    }

    const payload = {
      plantID: Number(formData.plantID),
      plantName: formData.plantName.trim(),
      modifiedBy: 'Admin',
      reasonForChange: reasonForChange.trim(),
      electronicSignature: 'Admin',
      signatureDate: new Date().toISOString().split('T')[0],
    };

    setLoading(true);
    try {
      const response = await updatePlant(payload);
      if (response.header?.errorCount === 0) {
        const successMsg = response.header?.messages?.[0]?.messageText;
        toast.success(successMsg || 'Plant updated successfully!');
        setTimeout(() => navigate('/system-admin/plant-master'), 1500);
      } else {
        const errorMsg = response.header?.messages?.[0]?.messageText;
        toast.error(errorMsg || 'Failed to update plant');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    } finally {
      setLoading(false);
    }
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
      {loading && <div className={styles.loadingBar}></div>}
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.sectionHeading}>Edit Plant</h3>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <div className={styles.row}>
            <label>Plant Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              placeholder="Enter Plant Name"
              required
            />
          </div>

          <div className={styles.row}>
            <label>Reason for Change <span className={styles.required}>*</span></label>
            <textarea
              name="reasonForChange"
              value={reasonForChange}
              onChange={handleChange}
              placeholder="Enter reason for change"
              required
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button type="button" onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPlant;
