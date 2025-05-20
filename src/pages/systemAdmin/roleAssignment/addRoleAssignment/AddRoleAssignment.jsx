import React, { useState, useEffect } from 'react';
import styles from './AddRoleAssignment.module.css';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAllRoles, getAllUsersBasicInfo, addRoleAssignment } from '../../../../services/systemAdmin/RoleAssignmentService';
import { toast, ToastContainer } from 'react-toastify';

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#127C96' : '#ccc',
    boxShadow: state.isFocused ? '0 0 0 2px #127C9633' : 'none',
    '&:hover': { borderColor: '#127C96' },
    color: '#001b36',
    minHeight: 38,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff',
    color: '#001b36',
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#127C96'
      : state.isFocused
      ? '#e6f7fa'
      : '#fff',
    color: state.isSelected ? '#fff' : '#001b36',
    fontSize: 14,
    padding: '8px 12px',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#001b36',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#a9a9a9',
    fontSize: 13,
  }),
};

const AddRoleAssignment = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    roleID: '',
    userID: '',
    reasonForChange: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await getAllRoles();
        if (rolesResponse.header?.errorCount === 0 && Array.isArray(rolesResponse.roles)) {
          const formattedRoles = rolesResponse.roles.map(role => ({
            value: role.roleID,
            label: role.roleName,
          }));
          setRoles(formattedRoles);
        } else {
          setRoles([]);
          const message = rolesResponse.header?.messages?.[0];
          if (message?.messageLevel?.toLowerCase() === 'warning') {
            toast.warning(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'error') {
            toast.error(message.messageText);
          }
        }

        try {
          const usersResponse = await getAllUsersBasicInfo();
          if (usersResponse.header?.errorCount === 0 && Array.isArray(usersResponse.usersBasicInfo)) {
            const formattedUsers = usersResponse.usersBasicInfo.map(user => ({
              value: user.userID,
              label: `${user.firstName} ${user.lastName}`,
            }));
            setUsers(formattedUsers);
          } else {
            setUsers([]);
            const message = usersResponse.header?.messages?.[0];
            if (message?.messageLevel?.toLowerCase() === 'warning') {
              toast.warning(message.messageText);
            } else if (message?.messageLevel?.toLowerCase() === 'error') {
              toast.error(message.messageText);
            }
          }
        } catch (userErr) {
          setUsers([]);
          toast.error('Error fetching users for dropdown.');
        }
      } catch (error) {
        console.error('Error fetching data for dropdowns:', error);
        toast.error('Error fetching dropdown data.');
        setRoles([]);
        setUsers([]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.roleID || !formData.userID) {
      toast.error('Please select both a role and a user.');
      setIsSubmitting(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const createdBy = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'admin';
    const plantID = sessionStorage.getItem('plantId') || '001';
  
    const payload = {
      roleID: formData.roleID,
      userID: formData.userID,
      createdBy,
      plantID,
      electronicSignature: createdBy,
      signatureDate: new Date().toISOString(),
      reasonForChange: 'Creating role assignment',
    };
    
    try {
      const response = await addRoleAssignment(payload);
  
      // Check if the API returned an error via the header
      if (response?.header?.errorCount > 0) {
        const message = response.header.messages?.[0]?.messageText || 'Error occurred. Please try again.';
        toast.error(message);
        setIsSubmitting(false);
        return;
      }
  
      const successMessage = response?.header?.messages?.[0]?.messageText || 'Role Assignment Created Successfully';
      toast.success(successMessage);

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/system-admin/role-assignment');
      }, 3000); // Wait 3 seconds to allow the toast to be read
    } catch (error) {
      console.error('Error creating role assignment:', error);
      toast.error('Error creating role assignment. Please try again.');
      setIsSubmitting(false);
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
          <div className={styles.formContent}>
            <h3 className={styles.sectionHeading}>Add Role Assignment</h3>
            
            <div className={styles.row}>
              <label>
                Select User <span className={styles.required}>*</span>
              </label>
              <Select
                name="userID"
                options={users}
                value={users.find((u) => u.value === formData.userID)}
                onChange={(selected) => setFormData({ ...formData, userID: selected ? selected.value : '' })}
                isClearable
                placeholder="-- Select User --"
                className={styles.reactSelect}
                styles={selectStyles}
              />
            </div>
            
            <div className={styles.row}>
              <label>
                Select Role <span className={styles.required}>*</span>
              </label>
              <Select
                name="roleID"
                options={roles}
                value={roles.find((r) => r.value === formData.roleID)}
                onChange={(selected) => setFormData({ ...formData, roleID: selected ? selected.value : '' })}
                isClearable
                placeholder="-- Select Role --"
                className={styles.reactSelect}
                styles={selectStyles}
              />
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRoleAssignment;
