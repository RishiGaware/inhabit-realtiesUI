import React, { useState, useEffect, useContext } from 'react';
import styles from './PlantMaster.module.css';

import { FaEdit } from 'react-icons/fa';
import { FcCancel } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { fetchAllPlants, deletePlant } from '../../../services/systemAdmin/PlantMasterService';
import { PlantContext } from '../../../context/PlantContext';
import Pagination from '../../../components/pagination/Pagination';
import Modal from '../../../components/common/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlantMaster = () => {
  const navigate = useNavigate();
  const { setPlantDetails } = useContext(PlantContext);
  const [allPlants, setAllPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  // Removed: paginatedPlants state

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      try {
        const data = await fetchAllPlants(currentPage, itemsPerPage);
        if (data.header?.errorCount === 0 && Array.isArray(data.plants)) {
          setAllPlants(data.plants || []); // Fetch only 10 records at a time
          setTotalCount(data.totalRecord || 0);
        }
        if (data.header?.errorCount > 0) {
          toast.error(data.header.messages?.[0]?.messageText || 'An error occurred');
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlants();
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddPlantClick = () => {
    navigate('/system-admin/plant-master/add-plant');
  };

  const handleEditPlantClick = (plant) => {
    setPlantDetails(plant);
    navigate('/system-admin/plant-master/edit-plant', { state: { plant } });
  };

  const handleDeleteClick = (plant) => {
    setSelectedPlant(plant);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedPlant) return;
    try {
      await deletePlant({ plantID: selectedPlant.plantID, modifiedBy: 'admin' });
      setAllPlants((prev) => prev.filter(p => p.plantID !== selectedPlant.plantID));
      setShowDeleteModal(false);
      setSelectedPlant(null);
    } catch (error) {
      alert('Failed to delete plant', error);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlant(null);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Paginate function
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // This will trigger the useEffect to fetch data for the new page
  };

  return (
    <>
      
      {loading && <div className={styles.loadingBar}></div>}
      <div className={styles.container}>
        <div className={styles.plantMaster}>
          <div className={styles.panelHeader}>
            <h2>Plant Master</h2>
            <div className={styles.recordCount}>
              {/* Showing {allPlants.length} of {totalCount} records */}
            </div>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <button className={styles.addUserBtn} onClick={handleAddPlantClick}>
                + Add
              </button>
            </div>
          </div>

          <div className={styles.plantTableContainer}>
            <table className={styles.plantTable}>
              <thead>
                <tr>
                  <th>Plant Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : allPlants.length > 0 ? (
                  allPlants.map((plant) => (
                    <tr key={plant.plantID}>
                      <td>{plant.plantName}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEditPlantClick(plant)}
                            title="Edit Plant"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => handleDeleteClick(plant)}
                            title="Delete Plant"
                          >
                            <FcCancel className={styles.deleteIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
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
            itemsPerPage={itemsPerPage}
            totalItems={totalCount}
            paginate={paginate}
          />
        </div>
      </div>

      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete "${selectedPlant?.plantName}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default PlantMaster;