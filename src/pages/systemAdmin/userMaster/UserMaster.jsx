import React, { useState, useEffect, useContext } from 'react';
import styles from './UserMaster.module.css';
import profile from '../../../assets/images/profile.png';

import { FaEdit } from 'react-icons/fa';
import { FcCancel } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { fetchUsersBasicInfo, deleteUser } from '../../../services/systemAdmin/UserMasterService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../components/pagination/Pagination';
import Modal from '../../../components/common/Modal';

const UserMaster = () => {
  const navigate = useNavigate();
  const { setUserId, setUserDetails } = useContext(UserContext);
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pageData, setPageData] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      if (pageData[currentPage] && !searchTerm) {
        setUsers(pageData[currentPage]);
        setLoading(false);
        return;
      }

      if (!searchTerm) {
        try {
          setLoading(true);
          const data = await fetchUsersBasicInfo(currentPage, itemsPerPage);
          console.log('Users Data:', data);

          const message = data.header?.messages?.[0];
          if (message?.messageLevel?.toLowerCase() === 'warning') {
            toast.warning(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'error') {
            toast.error(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'information') {
            // toast.success(message.messageText);
          }

          if (data.header?.errorCount === 0 && Array.isArray(data.usersBasicInfo)) {
            setPageData(prev => ({ ...prev, [currentPage]: data.usersBasicInfo }));
            setUsers(data.usersBasicInfo);
            setTotalRecords(data.totalRecord);
          } else {
            console.error('Failed to load users:', data.header?.message);
          }
        } catch (error) {
          toast.error('Error fetching users');
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUsers();
  }, [currentPage, searchTerm, refreshKey]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchMode(false);
      return;
    }

    const allUsers = Object.values(pageData).flat();
    const filtered = allUsers.filter(item =>
      `${item.firstName} ${item.lastName} ${item.departmentID} ${item.roleName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setUsers(filtered);
    setSearchMode(true);
    setCurrentPage(1);
  }, [searchTerm, pageData]);

  const totalPages = searchMode
    ? Math.ceil(users.length / itemsPerPage)
    : Math.ceil(totalRecords / itemsPerPage);

  const getCurrentItems = () => {
    if (searchMode) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return users.slice(startIndex, endIndex);
    } else {
      return users;
    }
  };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddUserClick = () => navigate('/system-admin/user-master/add-user');

  const handleEditUserClick = (user) => {
    try {
      if (!user || !user.userID) {
        toast.error('Invalid user data');
        return;
      }

      setUserId(user.userID);
      setUserDetails(user);

      const userDataToStore = {
        userID: user.userID,
        employeeID: user.employeeID,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        categoryType: user.categoryType,
        roleID: user.roleID,
        departmentID: user.departmentID,
        designationID: user.designationID,
        reportsTo: user.reportsTo,
        emailID: user.emailID,
        loginID: user.loginID,
        inductionRequire: user.inductionRequire,
        userProfileID: user.userProfileID
      };

      localStorage.setItem('editUserFormData', JSON.stringify(userDataToStore));
      navigate('/system-admin/user-master/edit-user');
    } catch (error) {
      console.error('Error preparing user data for edit:', error);
      toast.error('Failed to prepare user data for editing');
    }
  };

  const handleDeactivateClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteUser(selectedUser.userID);
      
      if (response.header?.errorCount === 0) {
        const message = response.header?.messages?.[0];
        if (message?.messageLevel?.toLowerCase() === 'warning') {
          toast.warning(message.messageText);
        } else if (message?.messageLevel?.toLowerCase() === 'error') {
          toast.error(message.messageText);
        } else if (message?.messageLevel?.toLowerCase() === 'information') {
          toast.success(message.messageText);
        }
        setShowDeleteModal(false);
        setSelectedUser(null);
        setPageData({});
        setCurrentPage(1);
        setRefreshKey(prev => prev + 1);
      } else {
        const message = response.header?.messages?.[0];
        if (message?.messageLevel?.toLowerCase() === 'warning') {
          toast.warning(message.messageText);
        } else if (message?.messageLevel?.toLowerCase() === 'error') {
          toast.error(message.messageText);
        } else if (message?.messageLevel?.toLowerCase() === 'information') {
          toast.success(message.messageText);
        }
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      const errorMessage = error?.response?.data?.header?.messages?.[0]?.messageText || 
                          error?.response?.data?.header?.Messages?.[0]?.MessageText ||
                          'Failed to deactivate user. Please try again.';
      toast.error(errorMessage);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showDeleteModal && (
        <Modal
          title="Confirm Deactivate"
          message={`Are you sure you want to deactivate ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className={styles.container}>
        <div className={styles.userMaster}>
          <div className={styles.panelHeader}>
            <h2>User Master</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {/* <button className={styles.filterBtn}>Filter</button> */}
              <button className={styles.addUserBtn} onClick={handleAddUserClick}>
                + Add
              </button>
            </div>
          </div>

          <div className={styles.userTableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : getCurrentItems().length > 0 ? (
                  getCurrentItems().map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div className={styles.userInfo}>
                          <img src={profile} alt="profile" className={styles.profile} />
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                      </td>
                      <td>{user.departmentName}</td>
                      <td>{user.designationName}</td>
                      <td>{user.roleName || '-'}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEditUserClick(user)}
                            title="Edit User"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                          <button 
                            className={styles.deactivateBtn} 
                            onClick={() => handleDeactivateClick(user)}
                            title="Deactivate User"
                          >
                            <FcCancel className={styles.deleteIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>
    </>
  );
};

export default UserMaster;