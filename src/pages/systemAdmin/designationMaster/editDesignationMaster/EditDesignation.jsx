import React, { useState, useEffect, useContext } from 'react';
import styles from './EditDesignation.module.css';

import { useNavigate, useLocation } from 'react-router-dom';
import { DesignationContext } from '../../../..//context/DeignationContext'; 
import { updateDesignation } from '../../../../services/systemAdmin/DesignationMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const EditDesignation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDesignation } = useContext(DesignationContext); // Use context properly

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    DesignationID: selectedDesignation.designationId || '',
    DesignationName: selectedDesignation.designationName || '',
    reasonForChange: ''
  });

  useEffect(() => {
    if (location.state?.designationData) {
      setFormData({
        DesignationID: location.state.designationData.designationID,
        DesignationName: location.state.designationData.designationName,
        reasonForChange: ''
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const requestBody = {
      designationID: formData.DesignationID,
      designationName: formData.DesignationName.trim(),
      modifiedBy: "Your Name or User ID", // Replace with actual user ID or name
      plantID: 0,
      reasonForChange: formData.reasonForChange,
      electronicSignature: "Your Electronic Signature", // Replace appropriately
      signatureDate: new Date().toISOString()
    };
  
    try {
      const response = await updateDesignation(requestBody);
      const message = response?.header?.messages?.[0];
  
      if (message?.messageLevel) {
        const level = message.messageLevel.toLowerCase();
        if (level === 'error') toast.error(message.messageText);
        else if (level === 'warning') toast.warning(message.messageText);
        else if (level === 'information') {
          toast.success(message.messageText);
          setTimeout(() => {
            navigate('/system-admin/designation-master');
          }, 3000);
        }
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <ToastContainer />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
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
            <h3 className={styles.sectionHeading}>Edit Designation</h3>
            <div className={styles.row}>
              <label>
                Designation Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="DesignationName"
                value={formData.DesignationName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <label>
                Reason for Change <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="reasonForChange"
                value={formData.reasonForChange || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, reasonForChange: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDesignation;