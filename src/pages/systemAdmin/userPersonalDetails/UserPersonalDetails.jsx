import React, { useState, useEffect } from 'react';
import styles from './UserPersonalDetails.module.css';
import avatar from '../../../assets/images/profile.png';

import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchAllUserPersonalDetails } from '../../../services/systemAdmin/UserPersonalDetailsService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../components/common/pagination/Pagination';

const UserPersonalDetails = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageData, setPageData] = useState({});
  const [searchMode, setSearchMode] = useState(false);

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
          const data = await fetchAllUserPersonalDetails(currentPage, itemsPerPage);
          console.log('Users Data:', data);

          const message = data.header?.messages?.[0];
          if (message?.messageLevel?.toLowerCase() === 'warning') {
            toast.warning(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'error') {
            toast.error(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'information') {
            // toast.success(message.messageText);
          }

          if (data.header?.errorCount === 0 && Array.isArray(data.usersPersonalnfo)) {
            setPageData(prev => ({ ...prev, [currentPage]: data.usersPersonalnfo }));
            setUsers(data.usersPersonalnfo);
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
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchMode(false);
      return;
    }

    const allUsers = Object.values(pageData).flat();
    const filtered = allUsers.filter(item =>
      `${item.firstName} ${item.lastName} ${item.address} ${item.contactNo}`
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

  const handleEditUserClick = (user) => {
    navigate('/system-admin/User-Personal-Details/edit-user', { state: { userData: user } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  const getUserStatus = (user) => {
    const requiredFields = {
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      doj: user.doj,
      address: user.address,
      contactNo: user.contactNo,
      emergencyNo: user.emergencyNo,
      bloodGroup: user.bloodGroup,
      fatherName: user.fatherName,
      motherName: user.motherName,
      totalExperience: user.totalExperience
    };

    const isFilled = (field) => {
      if (field === null || field === undefined) return false;
      if (typeof field === 'string') return field.trim() !== '';
      if (typeof field === 'number') return true;
      return false;
    };

    const missingFields = Object.entries(requiredFields).filter(([_, value]) => !isFilled(value));

    if (missingFields.length > 0) {
      return { status: 'Pending', className: styles.pending };
    } else {
      return { status: 'Completed', className: styles.completed };
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
        <div className={styles.userMaster}>
          <div className={styles.panelHeader}>
            <h2>User Personal Details</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {/* <button className={styles.filterBtn}>Filter</button> */}
            </div>
          </div>

          <div className={styles.userTableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact Info</th>
                  <th>DOB</th>
                  <th>DOJ</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : getCurrentItems().length > 0 ? (
                  getCurrentItems().map((user, index) => {
                    const { status, className } = getUserStatus(user);
                    return (
                      <tr key={index}>
                        <td>
                          <div className={styles.userInfo}>
                            <img src={avatar} alt="avatar" className={styles.avatar} />
                            {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                          </div>
                        </td>
                        <td>{user.address || '-'}</td>
                        <td>{user.contactNo || '-'}</td>
                        <td>{user.dob ? formatDate(user.dob) : '--'}</td>
                        <td>{user.doj ? formatDate(user.doj) : '--'}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${className}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button 
                              className={styles.editBtn} 
                              onClick={() => handleEditUserClick(user)}
                              title="Edit User"
                            >
                              <FaEdit className={styles.editIcon} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
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

export default UserPersonalDetails;