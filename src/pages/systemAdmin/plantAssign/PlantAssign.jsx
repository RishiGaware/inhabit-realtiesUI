import React, { useState, useEffect, useContext } from 'react';
import styles from './PlantAssign.module.css';

import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchAllPlantsAssign } from '../../../services/systemAdmin/PlantAssignService';
import Pagination from '../../../components/pagination/Pagination';
import { PlantAssignContext } from '../../../context/PlantAssignContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlantAssign = () => {
  const navigate = useNavigate();
  const { setPlantAssignDetails } = useContext(PlantAssignContext);
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPlants = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllPlantsAssign(currentPage, itemsPerPage, searchTerm);
        if (data.header?.errorCount === 0) {
          setPlants(data.plantAssignments || []);
          setTotalRecords(data.totalRecord || 0);
          if (data.header?.messages?.length > 0) {
            data.header.messages.forEach(msg => {
              if (msg.messageText) {
                // toast.success(msg.messageText, { autoClose: 3000 });
              }
            });
          }
          console.log(data);
        } else if (data.header?.messages?.length > 0) {
          data.header.messages.forEach(msg => {
            if (msg.messageText) {
              toast.error(msg.messageText, { autoClose: 3000 });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
        toast.error('Error fetching plant assignments');
      } finally {
        setIsLoading(false);
      }
    };

    getPlants();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleEdit = (plant) => {
    const fullName = `${plant.firstName} ${plant.lastName}`;
    setPlantAssignDetails(plant.plantAssignmentID, plant.userID, fullName, plant.plantIDs);
    navigate('/system-admin/plant-assign/edit-plant-assign');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
            <h2>Plant Assign</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <button
                className={styles.addUserBtn}
                onClick={() => navigate('/system-admin/plant-assign/add-plant-assign')}
              >
                + Add
              </button>
            </div>
          </div>

          <div className={styles.plantTableContainer}>
            <table className={styles.plantTable}>
              <thead>
                <tr>
                  {/* <th>Assignment ID</th> */}
                  {/* <th>User ID</th> */}
                  <th>Full Name</th>
                  <th>Plant Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : plants.length > 0 ? (
                  plants.map((assignment, index) => (
                    <tr key={index}>
                      {/* <td>{assignment.plantAssignmentID}</td>
                      <td>{assignment.userID}</td> */}
                      <td>{`${assignment.firstName || 'N/A'} ${assignment.lastName || 'N/A'}`}</td>
                      <td>{assignment.plantName || 'Not Assigned'}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEdit(assignment)}
                            title="Edit Plant Assignment"
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
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default PlantAssign;