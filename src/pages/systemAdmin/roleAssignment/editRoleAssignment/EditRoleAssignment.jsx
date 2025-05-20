import React, { useState, useEffect } from 'react';
import styles from './EditRoleAssignment.module.css';

import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  getAllRoles,
  getAllUsersBasicInfo,
  updateRoleAssignment,
} from '../../../../services/systemAdmin/RoleAssignmentService';

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

const EditRoleAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assignmentData = location.state?.assignmentData;

  const [formData, setFormData] = useState({
    roleID: '',
    userID: '',
    reasonForChange: '',
  });

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!assignmentData) {
      toast.error('No assignment data provided.');
      navigate('/system-admin/role-assignment');
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rolesResponse, usersResponse] = await Promise.all([
          getAllRoles(),
          getAllUsersBasicInfo(),
        ]);

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

        setFormData({
          roleID: assignmentData.roleID,
          userID: assignmentData.userID,
          reasonForChange: '',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load role assignment data');
        setRoles([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentData, navigate]);

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

    if (!formData.roleID || !formData.userID || !formData.reasonForChange) {
      toast.error('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const modifiedBy = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'admin';
    const plantID = parseInt(sessionStorage.getItem('plantId')) || 1;
    const selectedRole = roles.find(r => r.value === formData.roleID);

    if (!selectedRole) {
      toast.error('Selected role not found');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      roleID: parseInt(formData.roleID),
      roleName: selectedRole.label,
      description: selectedRole.description || selectedRole.label,
      modifiedBy: modifiedBy,
      plantID: plantID,
      reasonForChange: formData.reasonForChange,
      electronicSignature: modifiedBy,
      signatureDate: new Date().toISOString()
    };

    if (!payload.roleID || !payload.roleName || !payload.modifiedBy || !payload.description) {
      toast.error('Required fields are missing. Please check all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateRoleAssignment(payload);
      console.log('Update Response:', response);

      const message = response?.header?.messages?.[0];
      if (message?.messageLevel?.toLowerCase() === 'warning') {
        toast.warning(message.messageText);
      } else if (message?.messageLevel?.toLowerCase() === 'error') {
        toast.error(message.messageText);
      } else if (message?.messageLevel?.toLowerCase() === 'information') {
        toast.success(message.messageText);
      }

      if (response?.header?.errorCount === 0) {
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/system-admin/role-assignment');
        }, 1000);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage = error?.response?.data?.header?.messages?.[0]?.messageText || 
                          error?.response?.data?.header?.Messages?.[0]?.MessageText ||
                          'Error updating role assignment. Please try again.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <h3 className={styles.sectionHeading}>Edit Role Assignment</h3>

            <div className={styles.row}>
              <label>
                Select User <span className={styles.required}>*</span>
              </label>
              <Select
                name="userID"
                options={users}
                value={users.find((u) => u.value === formData.userID)}
                isDisabled={true}
                isClearable={false}
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
                onChange={(selected) =>
                  setFormData({ ...formData, roleID: selected ? selected.value : '' })
                }
                isClearable
                placeholder="-- Select Role --"
                className={styles.reactSelect}
                styles={selectStyles}
              />
            </div>

            <div className={styles.row}>
              <label>
                 Reason for Change <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="reasonForChange"
                value={formData.reasonForChange}
                onChange={handleChange}
                placeholder="Enter reason"
              />
            </div>
            <div className={styles.submitRow}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRoleAssignment;
