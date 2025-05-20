import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

import { fetchUsersBasicInfo } from '../../services/systemAdmin/UserMasterService';
import { fetchAllUserPersonalDetails } from '../../services/systemAdmin/UserPersonalDetailsService';
import { getRoleAssignments } from '../../services/systemAdmin/RoleAssignmentService';
import { fetchAllPlantsAssign } from '../../services/systemAdmin/PlantAssignService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserBasicInfoById, fetchUserPersonalInfoById, fetchPlantAssignmentsByUserId, fetchRoleAssignmentByUserId } from '../../services/profile/ProfileService';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('userMaster');
  const [loading, setLoading] = useState(true);
  const [userMasterData, setUserMasterData] = useState(null);
  const [userPersonalData, setUserPersonalData] = useState(null);
  const [roleAssignmentData, setRoleAssignmentData] = useState(null);
  const [plantAssignmentData, setPlantAssignmentData] = useState(null);
  const [userMasterApiData, setUserMasterApiData] = useState(null);
  const [userMasterSessionData, setUserMasterSessionData] = useState(null);
  const [userPersonalApiData, setUserPersonalApiData] = useState(null);
  const [plantAssignmentsApiData, setPlantAssignmentsApiData] = useState([]);
  const [roleAssignmentApiData, setRoleAssignmentApiData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          toast.error('User ID not found');
          return;
        }

        // Fetch User Master Data
        const userMasterResponse = await fetchUsersBasicInfo();
        const userMaster = userMasterResponse.usersBasicInfo?.find(user => user.userID === userId);
        setUserMasterData(userMaster);

        // Fetch User Personal Details
        const userPersonalResponse = await fetchAllUserPersonalDetails();
        const userPersonal = userPersonalResponse.usersPersonalnfo?.find(user => user.userID === userId);
        setUserPersonalData(userPersonal);

        // Fetch Role Assignment Data
        const roleAssignments = await getRoleAssignments();
        const roleAssignment = roleAssignments.find(assignment => assignment.userID === userId);
        setRoleAssignmentData(roleAssignment);

        // Fetch Plant Assignment Data
        const plantAssignmentResponse = await fetchAllPlantsAssign();
        const plantAssignment = plantAssignmentResponse.plantAssignments?.find(assignment => assignment.userID === userId);
        setPlantAssignmentData(plantAssignment);

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    // Fetch userId from sessionStorage
    let userId = sessionStorage.getItem('userId');
    if (!userId || userId === 'undefined') {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          userId = JSON.parse(userData).userID;
        } catch (e) {
          userId = null;
        }
      }
    }
    if (!userId) {
      setUserMasterApiData(null);
      setUserPersonalApiData(null);
      setPlantAssignmentsApiData([]);
      setRoleAssignmentApiData(null);
      return;
    }
    // Fetch user master data from API
    const fetchUserMasterApiData = async () => {
      try {
        const response = await fetchUserBasicInfoById(userId);
        if (response && response.userBasicData) {
          setUserMasterApiData(response.userBasicData);
        } else {
          setUserMasterApiData(null);
        }
      } catch (error) {
        setUserMasterApiData(null);
      }
    };
    fetchUserMasterApiData();

    // Fetch user personal details from API
    const fetchUserPersonalApiData = async () => {
      try {
        const response = await fetchUserPersonalInfoById(userId);
        if (response && response.userPersonalData) {
          setUserPersonalApiData(response.userPersonalData);
        } else {
          setUserPersonalApiData(null);
        }
      } catch (error) {
        setUserPersonalApiData(null);
      }
    };
    fetchUserPersonalApiData();

    // Fetch plant assignments from API
    const fetchPlantAssignmentsApiData = async () => {
      try {
        const response = await fetchPlantAssignmentsByUserId(userId);
        if (response && Array.isArray(response.userPlantAssignments)) {
          setPlantAssignmentsApiData(response.userPlantAssignments);
        } else {
          setPlantAssignmentsApiData([]);
        }
      } catch (error) {
        setPlantAssignmentsApiData([]);
      }
    };
    fetchPlantAssignmentsApiData();

    // Fetch role assignment from API
    const fetchRoleAssignmentApiData = async () => {
      try {
        const response = await fetchRoleAssignmentByUserId(userId);
        if (response && response.userRoleAssignment) {
          setRoleAssignmentApiData(response.userRoleAssignment);
        } else {
          setRoleAssignmentApiData(null);
        }
      } catch (error) {
        setRoleAssignmentApiData(null);
      }
    };
    fetchRoleAssignmentApiData();
  }, []);

  const renderUserMasterDetails = () => (
    <div className={styles.detailsSection}>
      <h3>User Details</h3>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : userMasterData ? (
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>Employee ID:</label>
            <span>{userMasterData.employeeID}</span>
          </div>
          <div className={styles.detailItem}>
            <label>First Name:</label>
            <span>{userMasterData.firstName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Last Name:</label>
            <span>{userMasterData.lastName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Gender:</label>
            <span>{userMasterData.gender === 'M' ? 'Male' : userMasterData.gender === 'F' ? 'Female' : 'Other'}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Category Type:</label>
            <span>{userMasterData.categoryType}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Email:</label>
            <span>{userMasterData.emailID}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Login ID:</label>
            <span>{userMasterData.loginID}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Department:</label>
            <span>{userMasterData.departmentName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Designation:</label>
            <span>{userMasterData.designationName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Role:</label>
            <span>{userMasterData.roleName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Reports To:</label>
            <span>{userMasterData.reportsToName || 'Not Assigned'}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Induction Required:</label>
            <span>{userMasterData.inductionRequire ? 'Yes' : 'No'}</span>
          </div>
        </div>
      ) : (
        <div className={styles.noData}>No user master details found</div>
      )}
    </div>
  );

  const renderUserPersonalDetails = () => (
    <div className={styles.detailsSection}>
      <h3>Personal Details</h3>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : userPersonalData ? (
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>First Name:</label>
            <span>{userPersonalData.firstName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Last Name:</label>
            <span>{userPersonalData.lastName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Date of Birth:</label>
            <span>{new Date(userPersonalData.dob).toLocaleDateString()}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Date of Joining:</label>
            <span>{new Date(userPersonalData.doj).toLocaleDateString()}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Contact Number:</label>
            <span>{userPersonalData.contactNo}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Emergency Contact:</label>
            <span>{userPersonalData.emergencyNo}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Blood Group:</label>
            <span>{userPersonalData.bloodGroup}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Father's Name:</label>
            <span>{userPersonalData.fatherName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Mother's Name:</label>
            <span>{userPersonalData.motherName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Address:</label>
            <span>{userPersonalData.address}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Total Experience:</label>
            <span>{userPersonalData.totalExperience} years</span>
          </div>
        </div>
      ) : (
        <div className={styles.noData}>No personal details found</div>
      )}
    </div>
  );

  const renderRoleAssignmentDetails = () => (
    <div className={styles.detailsSection}>
      <h3>Role Assignment Details</h3>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : roleAssignmentData ? (
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>Role Assignment ID:</label>
            <span>{roleAssignmentData.roleAssignmentID}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Role Name:</label>
            <span>{roleAssignmentData.roleName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Assigned Date:</label>
            <span>{roleAssignmentData.signatureDate}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Assigned By:</label>
            <span>{roleAssignmentData.createdBy}</span>
          </div>
        </div>
      ) : (
        <div className={styles.noData}>No role assignment details found</div>
      )}
    </div>
  );

  const renderPlantAssignmentDetails = () => (
    <div className={styles.detailsSection}>
      <h3>Plant Assignment Details</h3>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : plantAssignmentData ? (
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>Plant Assignment ID:</label>
            <span>{plantAssignmentData.plantAssignmentID}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Plant Name:</label>
            <span>{plantAssignmentData.plantName}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Assigned Date:</label>
            <span>{plantAssignmentData.signatureDate}</span>
          </div>
          <div className={styles.detailItem}>
            <label>Assigned By:</label>
            <span>{plantAssignmentData.createdBy}</span>
          </div>
        </div>
      ) : (
        <div className={styles.noData}>No plant assignment details found</div>
      )}
    </div>
  );

  const renderUserMasterApiForm = () => (
    <div className={styles.detailsSection}>
      <h3>User Details</h3>
      {userMasterApiData ? (
        <form className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>User ID:</label>
            <input type="text" value={userMasterApiData.userID || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Employee ID:</label>
            <input type="text" value={userMasterApiData.employeeID || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>First Name:</label>
            <input type="text" value={userMasterApiData.firstName || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Last Name:</label>
            <input type="text" value={userMasterApiData.lastName || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Gender:</label>
            <input type="text" value={userMasterApiData.gender === 'M' ? 'Male' : userMasterApiData.gender === 'F' ? 'Female' : (userMasterApiData.gender || '')} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Department:</label>
            <input type="text" value={userMasterApiData.departmentName || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Designation:</label>
            <input type="text" value={userMasterApiData.designationName || ''} readOnly />
          </div>
          
          <div className={styles.detailItem}>
            <label>Email:</label>
            <input type="text" value={userMasterApiData.emailID || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Login ID:</label>
            <input type="text" value={userMasterApiData.loginID || ''} readOnly />
          </div>

          <div className={styles.detailItem}>
            <label>User Profile ID:</label>
            <input type="text" value={userMasterApiData.userProfileID || ''} readOnly />
          </div>


        </form>
      ) : (
        <div className={styles.noData}>No user master details found</div>
      )}
    </div>
  );

  const renderUserPersonalApiForm = () => (
    <div className={styles.detailsSection}>
      <h3>Personal Details</h3>
      {userPersonalApiData ? (
        <form className={styles.detailsGrid}>
          
          <div className={styles.detailItem}>
            <label>Address:</label>
            <input type="text" value={userPersonalApiData.address || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Date of Birth:</label>
            <input type="text" value={userPersonalApiData.dob ? new Date(userPersonalApiData.dob).toLocaleDateString() : ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Date of Joining:</label>
            <input type="text" value={userPersonalApiData.doj ? new Date(userPersonalApiData.doj).toLocaleDateString() : ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Total Experience:</label>
            <input type="text" value={userPersonalApiData.totalExperience || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Father's Name:</label>
            <input type="text" value={userPersonalApiData.fatherName || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Mother's Name:</label>
            <input type="text" value={userPersonalApiData.motherName || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Contact No:</label>
            <input type="text" value={userPersonalApiData.contactNo || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Emergency No:</label>
            <input type="text" value={userPersonalApiData.emergencyNo || ''} readOnly />
          </div>
          <div className={styles.detailItem}>
            <label>Blood Group:</label>
            <input type="text" value={userPersonalApiData.bloodGroup || ''} readOnly />
          </div>
        </form>
      ) : (
        <div className={styles.noData}>No personal details found</div>
      )}
    </div>
  );

  const renderPlantAssignmentsApiForm = () => (
    <div className={styles.detailsSection}>
      <h3>Plant Assignment Details</h3>
      {plantAssignmentsApiData && plantAssignmentsApiData.length > 0 ? (
        <table className={styles.plantTable}>
          <thead>
            <tr>
              <th>Plant ID</th>
              <th>Plant Name</th>
            </tr>
          </thead>
          <tbody>
            {plantAssignmentsApiData.map((assignment, idx) => (
              <tr key={idx}>
                <td>{assignment.plantID}</td>
                <td>{assignment.plantName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noData}>No plant assignment details found</div>
      )}
    </div>
  );

  const renderRoleAssignmentApiForm = () => (
    <div className={styles.detailsSection}>
      <h3>Role Assignment Details</h3>
      {roleAssignmentApiData ? (
        <form className={styles.detailsGrid}>
          
          <div className={styles.detailItem}>
            <label>Role Name:</label>
            <input type="text" value={roleAssignmentApiData.roleName || ''} readOnly />
          </div>
        </form>
      ) : (
        <div className={styles.noData}>No role assignment details found</div>
      )}
    </div>
  );

  return (
    <>
      
      
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'userMaster' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('userMaster')}
            >
              User Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'userPersonal' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('userPersonal')}
            >
              Personal Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'roleAssignment' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('roleAssignment')}
            >
              Role Assignment
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'plantAssignment' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('plantAssignment')}
            >
              Plant Assignment
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === 'userMaster' && renderUserMasterApiForm()}
            {activeTab === 'userPersonal' && renderUserPersonalApiForm()}
            {activeTab === 'roleAssignment' && renderRoleAssignmentApiForm()}
            {activeTab === 'plantAssignment' && renderPlantAssignmentsApiForm()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 