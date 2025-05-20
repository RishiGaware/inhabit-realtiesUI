import React, { useState, useEffect } from 'react';
import styles from './AddUser.module.css';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchUsersBasicInfo, createUserBasicInfo } from '../../../../services/systemAdmin/UserMasterService';
import {fetchAllDepartments } from '../../../../services/systemAdmin/DepartmentMasterService'
import {fetchAllDesignations} from '../../../../services/systemAdmin/DesignationMasterService';
import { fetchAllRoles } from '../../../../services/systemAdmin/RoleMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    EmployeeID: '',
    FirstName: '',
    LastName: '',
    Gender: '',
    CategoryType: '',
    RoleID: '',
    DepartmentID: '',
    DesignationID: '',
    ReportsTo: '',
    EmailID: '',
    LoginID: '',
    Password: '',
    ConfirmPassword: '',
    InductionRequire: false,
    UserProfileID: '',
  });

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, designationsRes, usersRes, rolesRes] = await Promise.all([
          fetchAllDepartments(),
          fetchAllDesignations(),
          fetchUsersBasicInfo(1, 1000),
          fetchAllRoles()
        ]);

        if (departmentsRes.departments) {
          setDepartments(departmentsRes.departments.map((d) => ({ value: d.departmentID, label: d.departmentName })));
        }

        if (designationsRes.designations) {
          setDesignations(designationsRes.designations.map((d) => ({ value: d.designationID, label: d.designationName })));
        }

        if (usersRes.usersBasicInfo) {
          setUsers(usersRes.usersBasicInfo.map((u) => ({ 
            value: u.userID.toString(), 
            label: `${u.firstName} ${u.lastName} (${u.employeeID})`
          })));
        }

        if (rolesRes.roles) {
          setRoles(rolesRes.roles.map(role => ({ value: role.roleID.toString(), label: role.roleName })));
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Error fetching form data. Please refresh the page.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'FirstName', 'LastName', 'Gender', 'EmployeeID', 'RoleID',
      'DepartmentID', 'DesignationID', 'EmailID', 'LoginID', 'Password', 'ConfirmPassword'
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field.`);
        return;
      }
    }

    if (formData.Password !== formData.ConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Validate gender
    if (!['M', 'F', 'O'].includes(formData.Gender)) {
      toast.error('Please select a valid gender');
      return;
    }

    try {
      const payload = {
        employeeID: formData.EmployeeID.trim(),
        firstName: formData.FirstName.trim(),
        lastName: formData.LastName.trim(),
        gender: formData.Gender,
        categoryType: formData.CategoryType || '',
        roleID: Number(formData.RoleID),
        departmentID: Number(formData.DepartmentID),
        designationID: Number(formData.DesignationID),
        reportsTo: formData.ReportsTo ? Number(formData.ReportsTo) : 0,
        emailID: formData.EmailID.trim(),
        loginID: formData.LoginID.trim(),
        password: formData.Password,
        inductionRequire: formData.InductionRequire || false,
        userProfileID: Number(formData.UserProfileID) || 0,
        createdBy: 'admin',
        reasonForChange: 'Initial creation',
        electronicSignature: 'admin-signature',
        signatureDate: new Date().toISOString(),
        plantID: Number(sessionStorage.getItem('plantId')) || 0
      };

      console.log("Sending payload:", payload);
      const response = await createUserBasicInfo(payload);
      console.log("Create response:", response);

      if (response.header?.errorCount === 0) {
        const allMessages = response.header?.messages || [];
        const errorMessages = allMessages.filter(msg => msg.messageLevel === 'Error');
        const infoMessages = allMessages.filter(msg => msg.messageLevel === 'Information');

        if (errorMessages.length > 0) {
          errorMessages.forEach(msg => toast.error(msg.messageText));
        } else {
          infoMessages.forEach((msg, index) => {
            setTimeout(() => {
              toast.success(msg.messageText);
            }, index * 500);
          });

          // Delay navigation slightly more than the total toast duration
          setTimeout(() => {
            navigate('/system-admin/user-master');
          }, infoMessages.length * 500 + 3200);
        }
      } else {
        const allMessages = response.header?.messages || [];
        const errorMessages = allMessages.filter(msg => msg.messageLevel === 'Error');
        errorMessages.forEach(msg => toast.error(msg.messageText));
      }
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMsg =
        error?.response?.data?.messages?.[0]?.messageText ||
        error?.response?.data?.message ||
        'An error occurred while creating user.';
      toast.error(errorMsg);
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
            <h3 className={styles.sectionHeading}>Add User Master</h3>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>First Name <span className={styles.required}>*</span></label>
                <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <label>Last Name <span className={styles.required}>*</span></label>
                <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.row}>
              <label>Gender <span className={styles.required}>*</span></label>
              <Select
                name="Gender"
                options={[
                  { value: 'M', label: 'Male' },
                  { value: 'F', label: 'Female' },
                  { value: 'O', label: 'Other' }
                ]}
                value={
                  ['M', 'F', 'O'].includes(formData.Gender)
                    ? { value: formData.Gender, label: { M: 'Male', F: 'Female', O: 'Other' }[formData.Gender] }
                    : null
                }
                onChange={(selected) =>
                  setFormData({ ...formData, Gender: selected ? selected.value : '' })
                }
                isClearable
                placeholder="-- Select Gender --"
                className={styles.reactSelect}
              />
            </div>

            <div className={styles.row}>
              <label>Employee ID <span className={styles.required}>*</span></label>
              <input type="text" name="EmployeeID" value={formData.EmployeeID} onChange={handleChange} required />
            </div>

            <div className={styles.row}>
              <label>Category Type</label>
              <input type="text" name="CategoryType" value={formData.CategoryType} onChange={handleChange} />
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Role <span className={styles.required}>*</span></label>
                <Select
                  name="RoleID"
                  options={roles}
                  value={roles.find((r) => r.value === formData.RoleID)}
                  onChange={(selected) =>
                    setFormData({ ...formData, RoleID: selected ? selected.value : '' })
                  }
                  isClearable
                  placeholder="-- Select Role --"
                  className={styles.reactSelect}
                />
              </div>

              <div className={styles.row}>
                <label>Department <span className={styles.required}>*</span></label>
                <Select
                  name="DepartmentID"
                  options={departments}
                  value={departments.find((d) => d.value.toString() === formData.DepartmentID)}
                  onChange={(selected) =>
                    setFormData({ ...formData, DepartmentID: selected ? selected.value : '' })
                  }
                  isClearable
                  placeholder="-- Select Department --"
                  className={styles.reactSelect}
                />
              </div>
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Designation <span className={styles.required}>*</span></label>
                <Select
                  name="DesignationID"
                  options={designations}
                  value={designations.find((d) => d.value.toString() === formData.DesignationID)}
                  onChange={(selected) =>
                    setFormData({ ...formData, DesignationID: selected ? selected.value : '' })
                  }
                  isClearable
                  placeholder="-- Select Designation --"
                  className={styles.reactSelect}
                />
              </div>

              <div className={styles.row}>
                <label>Reports To <span className={styles.required}>*</span></label>
                <Select
                  name="ReportsTo"
                  options={users}
                  value={users.find((u) => u.value.toString() === formData.ReportsTo)}
                  onChange={(selected) =>
                    setFormData({ ...formData, ReportsTo: selected ? selected.value : '' })
                  }
                  isClearable
                  placeholder="-- Select Manager --"
                  className={styles.reactSelect}
                />
              </div>
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Email <span className={styles.required}>*</span></label>
                <input type="email" name="EmailID" value={formData.EmailID} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <label>Login ID <span className={styles.required}>*</span></label>
                <input type="text" name="LoginID" value={formData.LoginID} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Password <span className={styles.required}>*</span></label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className={styles.row}>
                <label>Confirm Password <span className={styles.required}>*</span></label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="ConfirmPassword"
                    value={formData.ConfirmPassword}
                    onChange={handleChange}
                    required
                    className={formData.Password && formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword ? styles.errorInput : ''}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.primaryBtn}>Submit</button>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;