import React, { useState, useEffect } from 'react';
import styles from './ChangePassword.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { changePassword } from '../../../services/systemAdmin/PasswordChangeService'
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import classNames from 'classnames';
import 'bootstrap/dist/css/bootstrap.min.css'; //  Import Bootstrap
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordChange = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const payload = {
        password: formData.newPassword
      };
  
      const result = await changePassword(payload);
  
      const header = result?.data?.header;
  
      if (header?.errorCount === 0) {
        const allMessages = header?.messages || [];
        const errorMessages = allMessages.filter(msg => msg.messageLevel === 'Error');
        const infoMessages = allMessages.filter(msg => msg.messageLevel === 'Information');

        if (errorMessages.length > 0) {
          errorMessages.forEach(msg => toast.error(msg.messageText, { autoClose: 3000 }));
          setError(errorMessages.map(msg => msg.messageText).join(' '));
        } else {
          infoMessages.forEach((msg, index) => {
            setTimeout(() => {
              toast.success(msg.messageText, { autoClose: 3000 });
            }, index * 500);
          });

          // Clear all session data
          setTimeout(() => {
            sessionStorage.clear(); // Clear all session data
            navigate('/'); // Redirect to login page
          }, infoMessages.length * 500 + 3200);
        }
      } else {
        const allMessages = header?.messages || [];
        const errorMessages = allMessages.filter(msg => msg.messageLevel === 'Error');
        errorMessages.forEach(msg => toast.error(msg.messageText));
        setError(errorMessages.map(msg => msg.messageText).join(' '));
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg =
        error?.response?.data?.messages?.[0]?.messageText ||
        error?.response?.data?.message ||
        'An error occurred while changing password.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      
      <div className={styles.container}>
        <div className={styles.outerCard}>
        {loading && (
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '99%', 
            marginTop:"2px",
          }}>
            <div className="progress" style={{ height: '4px', marginBottom: 0 }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
          <div className={styles.formContainer}>

            <form onSubmit={handleSubmit} className={styles.form}>

              <h2 className={styles.heading}>Change Password</h2>
              <br />

              {/* New Password */}
              <div className={styles.field}>
                <label>New Password <span style={{ color: 'red' }}>*</span></label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={classNames({ [styles.inputError]: errors.newPassword })}
                    required
                  />
                  <span onClick={() => toggleVisibility('new')}>
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.newPassword && <span className={styles.errorText}>⚠ {errors.newPassword}</span>}
              </div>

              {/* Confirm Password */}
              <div className={styles.field}>
                <label>Confirm Password <span style={{ color: 'red' }}>*</span></label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={classNames({ [styles.inputError]: errors.confirmPassword })}
                    required
                  />
                  <span onClick={() => toggleVisibility('confirm')}>
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <span className={styles.errorText}>⚠ {errors.confirmPassword}</span>}
              </div>

              <br />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Changing...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;