import React, { useState, useEffect, useContext } from 'react';
import styles from './EditDepartment.module.css';

import { useNavigate, useLocation } from 'react-router-dom';
import { DepartmentContext } from '../../../../context/DepartmentContext';
import { updateDepartment } from '../../../../services/systemAdmin/DepartmentMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditDepartment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDepartment } = useContext(DepartmentContext);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    departmentID: selectedDepartment?.departmentId || '',
    departmentName: selectedDepartment?.departmentName || '',
    reasonForChange: '',
  });

  useEffect(() => {
    if (location.state?.departmentData) {
      setFormData({
        departmentID: location.state.departmentData.departmentID,
        departmentName: location.state.departmentData.departmentName,
        reasonForChange: '',
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    if (!formData.reasonForChange.trim()) {
      toast.error("Please provide a reason for change.");
      setLoading(false);
      return;
    }
  
    try {
      const departmentData = {
        departmentID: formData.departmentID,
        departmentName: formData.departmentName.trim(),
        modifiedBy: "Admin",
        plantID: 1,
        reasonForChange: formData.reasonForChange,
        electronicSignature: "Admin",
        signatureDate: new Date().toISOString().split('T')[0],
      };
  
      const response = await updateDepartment(departmentData);
  
      if (response.header?.errorCount === 0) {
        const infoMsg = response.header?.messages?.[0]?.messageText;
        toast.success(infoMsg); // Display success message
        setTimeout(() => {
          navigate('/system-admin/department-master');
        }, 1200);
      } else {
        if (response.header?.errorCount !== 0) {
          const errorMsg = response.header?.messages?.[0]?.messageText;
          if (errorMsg) {
            setError(errorMsg);
            toast.error(errorMsg);
          }
        }
      }
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error("An error occurred while updating the department");
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
      <div className={styles.container}>
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

          <div className={styles.formContent}>
            <h3 className={styles.sectionHeading}>Edit Department</h3>

            <div className={styles.row}>
              <label>
                Department Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="Enter Department Name"
                required
              />
            </div>

            <div className={styles.row}>
              <label>
                Reason for Change <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="reasonForChange"
                value={formData.reasonForChange}
                onChange={handleChange}
                placeholder="Enter Reason for Change"
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

export default EditDepartment;