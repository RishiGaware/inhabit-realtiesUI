import React, { useState, useEffect } from 'react';
import styles from './EditUser.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { updateUserPersonalDetail } from '../../../../services/systemAdmin/UserPersonalDetailsService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    address: '',
    contactNo: '',
    dob: '',
    doj: '',
    emergencyNo: '',
    bloodGroup: '',
    fatherName: '',
    motherName: '',
    totalExperience: '',
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { userData } = location.state || {};
    if (userData) {
      setFormData({
        userID: userData.userID || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        address: userData.address || '',
        contactNo: userData.contactNo || '',
        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
        doj: userData.doj ? new Date(userData.doj).toISOString().split('T')[0] : '',
        emergencyNo: userData.emergencyNo || '',
        bloodGroup: userData.bloodGroup || '',
        fatherName: userData.fatherName || '',
        motherName: userData.motherName || '',
        totalExperience: userData.totalExperience || '',
      });
    } else {
      toast.error('No user data found');
      navigate('/system-admin/User-Personal-Details');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        toast.error('Authorization token missing. Please log in again.');
        return;
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.contactNo || !formData.dob || !formData.doj) {
        toast.error('Please fill in all required fields: First Name, Last Name, Address, Contact No, DOB, and DOJ');
        return;
      }

      // Validate phone numbers
      if (formData.contactNo.length < 10) {
        toast.error('Please enter a valid contact number');
        return;
      }

      if (formData.emergencyNo && formData.emergencyNo.length < 10) {
        toast.error('Please enter a valid emergency number');
        return;
      }

      const payload = {
        userID: formData.userID,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        contactNo: formData.contactNo,
        dob: new Date(formData.dob).toISOString(),
        doj: new Date(formData.doj).toISOString(),
        emergencyNo: formData.emergencyNo,
        bloodGroup: formData.bloodGroup,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        totalExperience: parseFloat(formData.totalExperience),
        modifiedBy: 'admin', // Replace with dynamic user
        plantID: 0,
        reasonForChange: 'User details updated',
        electronicSignature: 'admin-signature', // Replace if dynamic
        signatureDate: new Date().toISOString(),
      };

      console.log('Submitting updated user:', payload);

      const result = await updateUserPersonalDetail(payload);

      if (result.header?.errorCount === 0) {
        toast.success('User personal details updated successfully!');
        setTimeout(() => {
          navigate('/system-admin/User-Personal-Details');
        }, 1500);
      } else {
        const errorMsg = result.header?.messages?.map(msg => msg.messageText).join('\n') || 'Failed to update user details';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error updating user details. Please try again.');
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
          <h3 className={styles.sectionHeading}>Edit User Personal Details</h3>

          {/* First Name + Last Name */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>First Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label>Last Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          {/* DOB + DOJ */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>DOB <span style={{ color: 'red' }}>*</span></label>
              <CustomDatePicker
                value={formData.dob}
                onChange={(date) => setFormData(prev => ({ ...prev, dob: date }))}
                placeholder="Select date of birth"
                isPastDatePicker={true}
              />
            </div>
            <div className={styles.row}>
              <label>DOJ <span style={{ color: 'red' }}>*</span></label>
              <CustomDatePicker
                value={formData.doj}
                onChange={(date) => setFormData(prev => ({ ...prev, doj: date }))}
                placeholder="Select date of joining"
                isPastDatePicker={true}
              />
            </div>
          </div>

          {/* Address */}
          <div className={styles.row}>
            <label>Address <span style={{ color: 'red' }}>*</span></label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required />
          </div>

          {/* Contact No + Emergency No */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>Contact No <span style={{ color: 'red' }}>*</span></label>
              <PhoneInput
                country={'in'}
                value={formData.contactNo}
                onChange={(phone) => handlePhoneChange(phone, 'contactNo')}
                enableSearch
              />
            </div>
            <div className={styles.row}>
              <label>Emergency No</label>
              <PhoneInput
                country={'in'}
                value={formData.emergencyNo}
                onChange={(phone) => handlePhoneChange(phone, 'emergencyNo')}
                enableSearch
              />
            </div>
          </div>

          {/* Blood Group */}
          <div className={styles.row}>
            <label>Blood Group</label>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
          </div>

          {/* Father's Name + Mother's Name */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>Father's Name</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <label>Mother's Name</label>
              <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>
          </div>

          {/* Total Experience */}
          <div className={styles.row}>
            <label>Total Experience (Years)</label>
            <input type="number" name="totalExperience" value={formData.totalExperience} onChange={handleChange} step="0.1" />
          </div>

          {/* Submit & Cancel */}
          <div className={styles.submitRow}>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;