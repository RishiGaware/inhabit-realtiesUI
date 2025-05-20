import React, { useState } from 'react';
import styles from './AddUser.module.css';

import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { createUserPersonalDetail } from '../../../../services/systemAdmin/UserPersonalDetailsService'
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userID: '',
    name: '',
    address: '',
    dob: '',
    doj: '',
    contactNo: '',
    emergencyNo: '',
    bloodGroup: '',
    fatherName: '',
    motherName: '',
    totalExperience: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, address, dob, doj, contactNo, emergencyNo, totalExperience } = formData;

    if (!name || !address || !dob || !doj || !contactNo || !emergencyNo || !totalExperience) {
      setErrorMessage('Please fill all required fields.');
      return false;
    }
    if (contactNo.length < 10 || emergencyNo.length < 10) {
      setErrorMessage('Please enter valid phone numbers.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authorization token missing');
        return;
      }

      const payload = {
        userID: formData.userID,
        address: formData.address,
        dob: new Date(formData.dob).toISOString(),
        doj: new Date(formData.doj).toISOString(),
        totalExperience: parseFloat(formData.totalExperience),
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        contactNo: formData.contactNo,
        emergencyNo: formData.emergencyNo,
        bloodGroup: formData.bloodGroup,
        createdBy: 'admin', // dynamic if needed
        plantID: 0,
        reasonForChange: 'New user added',
        electronicSignature: 'admin-signature',
        signatureDate: new Date().toISOString(),
      };

      console.log('Sending payload:', payload);

      const result = await createUserPersonalDetail(payload); // calling service

      if (result.header?.errorCount === 0) {
        alert('User created successfully.');
        navigate('/system-admin/User-Personal-Details'); // corrected path
      } else {
        setErrorMessage(result.header?.message || 'Failed to create user.');
      }

    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.sectionHeading}>Add User Personal Details</h3>

          {errorMessage && <div className={styles.error}>{errorMessage}</div>}

          {/* UserID */}
          <div className={styles.row}>
            <label>User ID</label>
            <input type="number" name="userID" value={formData.userID} onChange={handleChange} placeholder="User ID" />
          </div>

          {/* Name + DOB */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div className={styles.row}>
              <label>DOB</label>
              <CustomDatePicker
                value={formData.dob}
                onChange={(date) => setFormData(prev => ({ ...prev, dob: date }))}
                placeholder="Select date of birth"
                isPastDatePicker={true}
              />
            </div>
          </div>

          {/* Address */}
          <div className={styles.row}>
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows={1} />
          </div>

          {/* Contact No + Emergency No */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>Contact No</label>
              <PhoneInput
                country={'in'}
                value={formData.contactNo}
                onChange={(phone) => setFormData(prev => ({ ...prev, contactNo: phone }))}
                enableSearch
              />
            </div>
            <div className={styles.row}>
              <label>Emergency No</label>
              <PhoneInput
                country={'in'}
                value={formData.emergencyNo}
                onChange={(phone) => setFormData(prev => ({ ...prev, emergencyNo: phone }))}
                enableSearch
              />
            </div>
          </div>

          {/* Blood Group */}
          <div className={styles.row}>
            <label>Blood Group</label>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="O+" />
          </div>

          {/* Father's Name + Mother's Name */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>Father's Name</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" />
            </div>
            <div className={styles.row}>
              <label>Mother's Name</label>
              <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" />
            </div>
          </div>

          {/* DOJ + Experience */}
          <div className={styles.inlineRow}>
            <div className={styles.row}>
              <label>DOJ</label>
              <CustomDatePicker
                value={formData.doj}
                onChange={(date) => setFormData(prev => ({ ...prev, doj: date }))}
                placeholder="Select date of joining"
                isPastDatePicker={true}
              />
            </div>
            <div className={styles.row}>
              <label>Total Experience (Years)</label>
              <input type="number" name="totalExperience" value={formData.totalExperience} onChange={handleChange} placeholder="Years" />
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className={styles.submitRow}>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Submitting...' : 'Submit'}
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

export default AddUser;