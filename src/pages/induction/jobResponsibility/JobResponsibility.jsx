import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobResposibility.module.css';

import { FaEdit } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { fetchAllJobResponsibilities, deleteJobResponsibility } from '../../../services/induction/JobResponsibilityService';
import Pagination from '../../../components/pagination/Pagination';
import { JobResponsibilityContext } from '../../../context/induction/JobResponsibilityContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobResponsibility = () => {
  const navigate = useNavigate();
  const { setJobResponsibilityId, setJobResponsibilityDetails } = useContext(JobResponsibilityContext);

  const [jobResponsibilities, setJobResponsibilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedJobResponsibility, setSelectedJobResponsibility] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadJobResponsibilities = async () => {
      try {
        const response = await fetchAllJobResponsibilities(currentPage, itemsPerPage);
        if (response.jobResponsibilities) {
          console.log('Fetched Job Responsibilities:', response);
          setJobResponsibilities(response.jobResponsibilities);
          setTotalRecords(response.totalRecord || 0);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load job responsibilities');
        setLoading(false);
      }
    };

    loadJobResponsibilities();
  }, [currentPage]);

  const handleEditJobResponsibility = (jobResponsibility) => {
    try {
      if (!jobResponsibility || !jobResponsibility.jobResponsibilityID) {
        toast.error('Invalid job responsibility data');
        return;
      }

      setJobResponsibilityId(jobResponsibility.jobResponsibilityID);
      setJobResponsibilityDetails(jobResponsibility);

      // Store job responsibility details in localStorage with correct field mapping
      const jobResponsibilityDataToStore = {
        jobResponsibilityID: jobResponsibility.jobResponsibilityID,
        userID: jobResponsibility.userID,
        inductionID: jobResponsibility.inductionID,
        jobTitle: jobResponsibility.jobTitle,
        title: jobResponsibility.title,
        description: jobResponsibility.description,
        responsibilities: jobResponsibility.responsibilities,
        firstName: jobResponsibility.firstName,
        lastName: jobResponsibility.lastName,
        plantName: jobResponsibility.plantName,
        userName: `${jobResponsibility.firstName} ${jobResponsibility.lastName}`
      };

      localStorage.setItem('editJobResponsibilityFormData', JSON.stringify(jobResponsibilityDataToStore));
      console.log("Job responsibility data stored for editing:", jobResponsibilityDataToStore);
      
      navigate('/induction/job-responsibility/edit-job-responsibility');
    } catch (error) {
      console.error('Error preparing job responsibility data for edit:', error);
      toast.error('Failed to prepare job responsibility data for editing');
    }
  };

  const handleDeactivateClick = (jobResponsibility) => {
    setSelectedJobResponsibility(jobResponsibility);
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async () => {
    try {
      const response = await deleteJobResponsibility(selectedJobResponsibility.jobResponsibilityID);
      
      if (response.header?.errorCount === 0) {
        const successMsg = response.header?.messages?.[0]?.messageText || 'Job responsibility deactivated successfully';
        toast.success(successMsg);
        setShowDeactivateModal(false);
        setSelectedJobResponsibility(null);
        
        // Refresh the job responsibilities list
        const loadJobResponsibilities = async () => {
          try {
            const response = await fetchAllJobResponsibilities(currentPage, itemsPerPage);
            if (response.jobResponsibilities) {
              setJobResponsibilities(response.jobResponsibilities);
              setTotalRecords(response.totalRecord || 0);
            }
          } catch (err) {
            console.error('Error fetching job responsibilities:', err);
            toast.error('Failed to refresh job responsibilities list');
          }
        };
        
        loadJobResponsibilities();
      } else {
        const errorMsg = response.header?.messages?.[0]?.messageText || 'Failed to deactivate job responsibility';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error deactivating job responsibility:', error);
      toast.error('Failed to deactivate job responsibility. Please try again.');
    }
  };

  const handleAddJobResponsibility = () => {
    navigate('/induction/job-responsibility/add-job-responsibility');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showDeactivateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Deactivate Job Responsibility</h3>
            <br />
            <p>Are you sure you want to deactivate the job responsibility for {selectedJobResponsibility?.firstName} {selectedJobResponsibility?.lastName}?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleDeactivateConfirm}>
                Confirm
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.container}>
        <div className={styles.JobResposibility}>
          <div className={styles.panelHeader}>
            <h2>Job Responsibility</h2>
            <div className={styles.controls}>
              <input type="text" placeholder="Search..." />
              <button className={styles.addUserBtn} onClick={handleAddJobResponsibility}>+ Add</button>
            </div>
          </div>

          <div className={styles.jobTableContainer}>
            <table className={styles.jobTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Plant Name</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Responsibilities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobResponsibilities.map((item, index) => (
                  <tr key={`${item.jobResponsibilityID}-${item.userID}-${index}`}>
                    <td>{`${item.firstName} ${item.lastName}`}</td>
                    <td>{item.plantName || '-'}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.responsibilities}</td>
                    <td className={styles.actions}>
                        <button
                        className={styles.editBtn}
                        onClick={() => handleEditJobResponsibility(item)}
                        >
                        <FaEdit />
                        </button>
                        <button
                        className={styles.deactivateBtn} 
                        onClick={() => handleDeactivateClick(item)}
                        title="Deactivate Job Responsibility"
                        >
                        <FcCancel />
                        </button>
                    </td>
                    </tr>
                ))}
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

export default JobResponsibility;