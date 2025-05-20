  import React, { useState } from 'react';
  import styles from './AddPlant.module.css';
  
  import { useNavigate } from 'react-router-dom';
  import { createPlant } from '../../../../services/systemAdmin/PlantMasterService';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const AddPlant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ plantName: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      setFormData({ plantName: e.target.value });
      setError('');
      setMessage('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!formData.plantName.trim()) {
        setError('Plant name is required');
        return;
      }
    
      const payload = {
        plantName: formData.plantName.trim(),
        createdBy: 'Admin',
        electronicSignature: 'Admin',
        signatureDate: new Date().toISOString().split('T')[0],
      };
    
      setLoading(true);
      try {
        const response = await createPlant(payload);
        console.log(response); // Log the response for debugging
    
        if (response.header?.errorCount === 0) {
          const successMsg = response.header?.messages?.[0]?.messageText;
          toast.success(successMsg || 'Plant added successfully!');
          setTimeout(() => navigate('/system-admin/plant-master'), 1500);
        } else {
          const errorMsg = response.header?.messages?.[0]?.messageText;
          if (errorMsg) {
            setError(errorMsg);
            toast.error(errorMsg);
          } else {
            toast.error('Failed to add plant');
          }
        }
      } catch (err) {
        toast.error('An error occurred while adding the plant');
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
            <h3 className={styles.sectionHeading}>Add Plant</h3>

            {/* {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.success}>{message}</div>} */}

            <div className={styles.row}>
              <label>
                Plant Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                placeholder="Enter Plant Name"
                required
              />
            </div>

            <div className={styles.submitRow}>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Submit'}
              </button>
              <button type="button" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  export default AddPlant;
