import React, { useState } from 'react';
import styles from './AddDesignation.module.css';

import { useNavigate } from 'react-router-dom';
import { createDesignation } from '../../../../services/systemAdmin/DesignationMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDesignation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    DesignationName: '',
    createdBy: 'admin', // Change this dynamically as needed
    plantID: 1,         // Update this with actual plantID
    electronicSignature: 'admin-signature', // Or fetch from user session
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      designationName: formData.DesignationName.trim(),
      createdBy: formData.createdBy,
      plantID: formData.plantID,
      electronicSignature: formData.electronicSignature,
      signatureDate: new Date().toISOString()
    };
  
    try {
      const result = await createDesignation(payload);  
      const message = result?.header?.messages?.[0];
      if (message?.messageLevel) {
        const level = message.messageLevel.toLowerCase();
        if (level === 'error') toast.error(message.messageText);
        else if (level === 'warning') toast.warning(message.messageText);
        else if (level === 'information') {
          toast.success(message.messageText);
          setTimeout(() => {
            navigate('/system-admin/designation-master');
          }, 1200);
        }
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error creating designation:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className={styles.container}>

        <ToastContainer position="top-right" autoClose={1500} />
        {loading && (
          <div className="progress mb-3" style={{ height: '3px' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: '100%' }}
            />
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
        {/* Bootstrap progress bar (full width of form) */}
        {loading && (
            <div className="progress mb-3" style={{ height: '3px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: '100%' }}
              />
            </div>
          )}
          <h3 className={styles.sectionHeading}>Add Designation</h3>
          
          <div className={styles.row}>
            <label>
              Designation Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="DesignationName"
              value={formData.DesignationName}
              onChange={handleChange}
              placeholder="Enter Designation Name"
              required
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Submit'}
            </button>
            <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDesignation;