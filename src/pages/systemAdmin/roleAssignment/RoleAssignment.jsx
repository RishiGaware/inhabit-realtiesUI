import React, { useEffect, useState } from 'react';
import styles from './RoleAssignment.module.css';

import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getRoleAssignments } from '../../../services/systemAdmin/RoleAssignmentService';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from '../../../components/pagination/Pagination';

const RoleAssignment = () => {
  const navigate = useNavigate();
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getRoleAssignments();
      console.log('Fetched Role Assignments:', response);
      
      if (response.header?.errorCount === 0 && Array.isArray(response.roleAssignments)) {
        setRoleAssignments(response.roleAssignments);
      } else {
        setRoleAssignments([]);
        const message = response.header?.messages?.[0];
        if (message?.messageLevel?.toLowerCase() === 'warning') {
          toast.warning(message.messageText);
        } else if (message?.messageLevel?.toLowerCase() === 'error') {
          toast.error(message.messageText);
        }
      }
    } catch (error) {
      console.error('Error fetching role assignments:', error);
      toast.error('Error fetching role assignments. Please try again.');
      setRoleAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = Array.isArray(roleAssignments) ? roleAssignments.filter(item =>
    `${item.roleName} ${item.userName} ${item.plantName}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const currentItems = filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginate = (page) => setCurrentPage(page);

  const handleEdit = (assignment) => {
    navigate('/system-admin/role-assignment/edit-role-assignment', { state: { assignmentData: assignment } });
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
        <div className={styles.plantMaster}>
          <div className={styles.panelHeader}>
            <h2>Role Assignment</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {/* <button className={styles.filterBtn}>Filter</button> */}
              <button
                className={styles.addUserBtn}
                onClick={() => navigate('/system-admin/role-assignment/add-role-assignment')}
              >
                + Add
              </button>
            </div>
          </div>

          <div className={styles.plantTableContainer}>
            <table className={styles.plantTable}>
              <thead>
                <tr>
                  {/* <th>RoleAssignment ID</th> */}
                  <th>Role Name</th>
                  <th>Full Name</th>
                  <th>Plant Name</th>
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
                ) : currentItems.length > 0 ? (
                  currentItems.map((assignment, index) => (
                    <tr key={index}>
                      {/* <td>{assignment.roleAssignmentID}</td> */}
                      <td>{assignment.roleName}</td>
                      <td>{`${assignment.firstName || ''} ${assignment.lastName || ''}`.trim()}</td>
                      <td>{assignment.plantName}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEdit(assignment)}
                            title="Edit Role Assignment"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      No role assignments found.
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

export default RoleAssignment;
