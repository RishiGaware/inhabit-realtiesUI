import React, { useState } from 'react';
import styles from './AddDepartment.module.css';

import { useNavigate } from 'react-router-dom';
import { createDepartment } from '../../../../services/systemAdmin/DepartmentMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //  Import Bootstrap

const AddDepartment = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const departmentData = {
        departmentName: formData.departmentName.trim(),
        createdBy: "Admin", // Replace dynamically if needed
        plantID: 0,
        electronicSignature: "Admin",
        signatureDate: new Date().toISOString(),
      };

      const response = await createDepartment(departmentData);
      console.log(response)

      if (response.header?.errorCount === 0) {
        const infoMsg = response.header?.messages?.[0]?.messageText;
        toast.success(infoMsg);
        setTimeout(() => {
          navigate('/system-admin/department-master');
        }, 1000);
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
      setError('An error occurred while creating the department');
      toast.error('An error occurred');
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

          <h3 className={styles.sectionHeading}>Add Department</h3>
          
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

export default AddDepartment;