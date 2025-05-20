import React, { useState, useEffect, useContext } from 'react';
import styles from './EditUser.module.css';

import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { UserContext } from '../../../../context/UserContext';
import { fetchUsersBasicInfo, updateUserBasicInfo } from '../../../../services/systemAdmin/UserMasterService';
import { fetchAllDepartments } from '../../../../services/systemAdmin/DepartmentMasterService';
import { fetchAllDesignations } from '../../../../services/systemAdmin/DesignationMasterService';
import { fetchAllRoles } from '../../../../services/systemAdmin/RoleMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditUser = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userID: '',
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
    InductionRequire: false,
    UserProfileID: '',
  });

  // Fetch all dropdown data and initialize form
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentsRes, designationsRes, usersRes, rolesRes] = await Promise.all([
          fetchAllDepartments(),
          fetchAllDesignations(),
          fetchUsersBasicInfo(),
          fetchAllRoles()
        ]);

        // Set dropdown options
        if (departmentsRes.departments) {
          setDepartments(departmentsRes.departments.map(d => ({ value: d.departmentID, label: d.departmentName })));
        }
        if (designationsRes.designations) {
          setDesignations(designationsRes.designations.map(d => ({ value: d.designationID, label: d.designationName })));
        }
        if (usersRes.usersBasicInfo) {
          setUsers(usersRes.usersBasicInfo.map(u => ({ value: u.userID, label: `${u.firstName} ${u.lastName}` })));
        }
        if (rolesRes.roles) {
          setRoles(rolesRes.roles.map(r => ({ value: r.roleID, label: r.roleName })));
        }

        // Initialize form data
        const storedFormData = JSON.parse(localStorage.getItem('editUserFormData'));

        if (storedFormData) {
          setFormData({
            userID: storedFormData.userID,
            EmployeeID: storedFormData.employeeID || '',
            FirstName: storedFormData.firstName || '',
            LastName: storedFormData.lastName || '',
            Gender: storedFormData.gender || '',
            CategoryType: storedFormData.categoryType || '',
            RoleID: storedFormData.roleID || '',
            DepartmentID: storedFormData.departmentID || '',
            DesignationID: storedFormData.designationID || '',
            ReportsTo: storedFormData.reportsTo || '',
            EmailID: storedFormData.emailID || '',
            LoginID: storedFormData.loginID || '',
            InductionRequire: storedFormData.inductionRequire === 'True' || false,
            UserProfileID: storedFormData.userProfileID || '',
          });
        } else if (userDetails) {
          setFormData({
            userID: userDetails.userID,
            EmployeeID: userDetails.employeeID || '',
            FirstName: userDetails.firstName || '',
            LastName: userDetails.lastName || '',
            Gender: userDetails.gender || '',
            CategoryType: userDetails.categoryType || '',
            RoleID: userDetails.roleID || '',
            DepartmentID: userDetails.departmentID || '',
            DesignationID: userDetails.designationID || '',
            ReportsTo: userDetails.reportsTo || '',
            EmailID: userDetails.emailID || '',
            LoginID: userDetails.loginID || '',
            InductionRequire: userDetails.inductionRequire === 'True' || false,
            UserProfileID: userDetails.userProfileID || '',
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(updatedFormData);
    localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = [
      'FirstName', 'LastName', 'Gender', 'EmployeeID', 'RoleID',
      'DepartmentID', 'DesignationID', 'EmailID', 'LoginID'
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        setLoading(false);
        return;
      }
    }

    // Validate gender
    if (!['M', 'F', 'O'].includes(formData.Gender)) {
      toast.error('Please select a valid gender', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        userID: formData.userID,
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
        inductionRequire: formData.InductionRequire || false,
        userProfileID: Number(formData.UserProfileID) || 0,
        createdBy: sessionStorage.getItem('userId') || 'Admin',
        reasonForChange: 'User details update',
        electronicSignature: sessionStorage.getItem('userId') || 'Admin',
        signatureDate: new Date().toISOString(),
        plantID: Number(sessionStorage.getItem('plantId')) || 0
      };

      const response = await updateUserBasicInfo(payload);

      if (response.header?.errorCount === 0) {
        toast.success('User details updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        // Clear localStorage
        localStorage.removeItem('editUserFormData');

        // Navigate back after toast
        setTimeout(() => {
          navigate('/system-admin/user-master');
        }, 3000);
      } else {
        const errorMsg = response.header?.messages?.[0]?.messageText || 'Failed to update user details';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user details. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
          theme="colored"
          style={{
            zIndex: 9999,
            width: 'auto',
            maxWidth: '600px'
          }}
        />
        
        <div className={styles.container}>
          <form className={styles.form}>
            <div className="progress mb-3" style={{ height: '3px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: '100%' }}
              />
            </div>
            <div className={styles.formContent}>
              <h3 className={styles.sectionHeading}>Edit User</h3>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="colored"
      />
      
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <h3 className={styles.sectionHeading}>Edit User</h3>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>First Name <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <label>Last Name <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.row}>
              <label>Gender <span style={{ color: 'red' }}>*</span></label>
              <Select
                name="Gender"
                options={[
                  { value: 'M', label: 'Male' },
                  { value: 'F', label: 'Female' },
                  { value: 'O', label: 'Other' }
                ]}
                defaultValue={formData.Gender ? { value: formData.Gender, label: { M: 'Male', F: 'Female', O: 'Other' }[formData.Gender] } : null}
                value={formData.Gender ? { value: formData.Gender, label: { M: 'Male', F: 'Female', O: 'Other' }[formData.Gender] } : null}
                onChange={(selected) => {
                  const updatedFormData = { ...formData, Gender: selected ? selected.value : '' };
                  setFormData(updatedFormData);
                  localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                }}
                className={styles.reactSelect}
                placeholder="-- Select Gender --"
                isSearchable={false}
              />
            </div>

            <div className={styles.row}>
              <label>Employee ID <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="EmployeeID" value={formData.EmployeeID} onChange={handleChange} required />
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Role <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="RoleID"
                  options={roles}
                  defaultValue={roles.find(r => r.value === Number(formData.RoleID))}
                  value={roles.find(r => r.value === Number(formData.RoleID))}
                  onChange={(selected) => {
                    const updatedFormData = { ...formData, RoleID: selected ? selected.value : '' };
                    setFormData(updatedFormData);
                    localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                  }}
                  className={styles.reactSelect}
                  placeholder="-- Select Role --"
                />
              </div>

              <div className={styles.row}>
                <label>Department <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="DepartmentID"
                  options={departments}
                  value={departments.find(d => d.value === Number(formData.DepartmentID))}
                  onChange={(selected) => {
                    const updatedFormData = { ...formData, DepartmentID: selected ? selected.value : '' };
                    setFormData(updatedFormData);
                    localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                  }}
                  className={styles.reactSelect}
                  placeholder="-- Select Department --"
                />
              </div>
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Designation <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="DesignationID"
                  options={designations}
                  value={designations.find(d => d.value === Number(formData.DesignationID))}
                  onChange={(selected) => {
                    const updatedFormData = { ...formData, DesignationID: selected ? selected.value : '' };
                    setFormData(updatedFormData);
                    localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                  }}
                  className={styles.reactSelect}
                  placeholder="-- Select Designation --"
                />
              </div>

              <div className={styles.row}>
                <label>Reports To <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="ReportsTo"
                  options={users}
                  value={users.find(u => u.value === Number(formData.ReportsTo))}
                  onChange={(selected) => {
                    const updatedFormData = { ...formData, ReportsTo: selected ? selected.value : '' };
                    setFormData(updatedFormData);
                    localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                  }}
                  className={styles.reactSelect}
                  placeholder="-- Select Manager --"
                />
              </div>
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Email <span style={{ color: 'red' }}>*</span></label>
                <input type="email" name="EmailID" value={formData.EmailID} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <label>Login ID <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="LoginID" value={formData.LoginID} readOnly className={styles.readOnlyInput} />
              </div>
            </div>

            <div className={styles.row}>
              <label>Induction Required</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="InductionRequire"
                    checked={formData.InductionRequire === true}
                    onChange={() => {
                      const updatedFormData = { ...formData, InductionRequire: true };
                      setFormData(updatedFormData);
                      localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                    }}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="InductionRequire"
                    checked={formData.InductionRequire === false}
                    onChange={() => {
                      const updatedFormData = { ...formData, InductionRequire: false };
                      setFormData(updatedFormData);
                      localStorage.setItem('editUserFormData', JSON.stringify(updatedFormData));
                    }}
                  />
                  No
                </label>
              </div>
            </div>

            {/* <div className={styles.row}>
              <label>User Profile ID</label>
              <input type="text" name="UserProfileID" value={formData.UserProfileID} onChange={handleChange} />
            </div> */}

          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;