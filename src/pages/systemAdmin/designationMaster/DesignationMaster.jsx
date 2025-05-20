import React, { useState, useEffect, useContext } from 'react';
import styles from './DesignationMaster.module.css';

import { FaEdit } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { DesignationContext } from '../../../context/DeignationContext';
import { fetchAllDesignations, deleteDesignation } from '../../../services/systemAdmin/DesignationMasterService';
import Pagination from '../../../components/pagination/Pagination';
import Modal from '../../../components/common/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DesignationMaster = () => {
  const navigate = useNavigate();
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageData, setPageData] = useState({});
  const itemsPerPage = 10;
  const { setDesignationDetails } = useContext(DesignationContext);
  const [showModal, setShowModal] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  
  const [searchMode, setSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDesignations = async () => {
      if (pageData[currentPage] && !searchTerm) {
        setDesignations(pageData[currentPage]);
        setIsLoading(false);
        return;
      }
  
      if (!searchTerm) {
        try {
          setIsLoading(true);
          const data = await fetchAllDesignations(currentPage, itemsPerPage);
          console.log('Designations Data:', data);
  
          const message = data.header?.messages?.[0];
          if (message?.messageLevel?.toLowerCase() === 'warning') {
            toast.warning(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'error') {
            toast.error(message.messageText);
          } else if (message?.messageLevel?.toLowerCase() === 'information') {
            // toast.success(message.messageText);
          }
  
          if (data.header?.errorCount === 0 && Array.isArray(data.designations)) {
            setPageData(prev => ({ ...prev, [currentPage]: data.designations }));
            setDesignations(data.designations);
            setTotalRecords(data.totalRecord);
          } else {
            console.error('Failed to load designations:', data.header?.message);
          }
        } catch (error) {
          toast.error('Error fetching designations');
          console.error('Error fetching designations:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    loadDesignations();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchMode(false);
      setFilteredDesignations([]);
      return;
    }

    const allDesignations = Object.values(pageData).flat();
    const filtered = allDesignations.filter(item =>
      item.designationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDesignations(filtered);
    setSearchMode(true);
    setCurrentPage(1);
  }, [searchTerm, pageData]);

  const totalPages = searchMode
    ? Math.ceil(filteredDesignations.length / itemsPerPage)
    : Math.ceil(totalRecords / itemsPerPage);

    const getCurrentItems = () => {
      if (searchMode) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDesignations.slice(startIndex, endIndex);
      } else {
        const allDesignations = Object.values(pageData).flat(); // Merge all pages
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allDesignations.slice(startIndex, endIndex); // Slice properly here
      }
    };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
  };

  const handleEditDesignation = (designation) => {
    setDesignationDetails(designation.designationID, designation.designationName);
    navigateTo('/system-admin/designation-master/edit-designation', { designationData: designation });
  };

  const handleDeleteDesignation = (designation) => {
    setDesignationToDelete(designation);
    setShowModal(true);
  };
  const confirmDeleteDesignation = async () => {
    try {
      const res = await deleteDesignation(designationToDelete.designationID);
      if (res.header?.errorCount === 0) {
        toast.success('Designation deleted successfully');
  
        // Remove from all pageData
        const updatedPageData = {};
        let newDesignations = [];
  
        Object.entries(pageData).forEach(([page, items]) => {
          const filteredItems = items.filter(d => d.designationID !== designationToDelete.designationID);
          if (filteredItems.length > 0) {
            updatedPageData[page] = filteredItems;
            newDesignations.push(...filteredItems);
          }
        });
  
        setPageData(updatedPageData);
        setFilteredDesignations(prev => prev.filter(d => d.designationID !== designationToDelete.designationID));
        setDesignations(newDesignations);
        setTotalRecords(prev => prev - 1);
  
        // Optional: move back a page if current page becomes empty
        const currentItems = getCurrentItems();
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
  
      } else {
        toast.error(res.header?.messages?.[0]?.messageText || 'Failed to delete designation');
      }
    } catch (err) {
      toast.error('Error deleting designation');
      console.error('Delete Error:', err);
    } finally {
      setShowModal(false);
      setDesignationToDelete(null);
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
            <h2>Designation Master</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button
                className={styles.addUserBtn}
                onClick={() => navigateTo('/system-admin/designation-master/add-designation')}
              >
                + Add
              </button>
            </div>
          </div>

          <div className={styles.userTableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Designation Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="2" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : getCurrentItems().length > 0 ? (
                  getCurrentItems().map((item, index) => (
                    <tr key={index}>
                      <td>{item.designationName}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEditDesignation(item)}
                            title="Edit Designation"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => handleDeleteDesignation(item)}
                            title="Delete Designation"
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
                      No designations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>
      {showModal && designationToDelete && (
  <Modal
    title="Confirm Delete"
    message={`Are you sure you want to delete "${designationToDelete.designationName}"?`}
    onConfirm={confirmDeleteDesignation}
    onCancel={() => setShowModal(false)}
  />
)}

    </>
  );
};


export default DesignationMaster;
