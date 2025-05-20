import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './DocumentRegistration.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Navbar from '../../../components/navbar/Navbar';
import { FaEdit } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import Pagination from '../../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../../../context/sopModule/DocumentContext';
import { fetchDocumentsByUserId, deleteDocument } from '../../../services/sopojt-Management/DocumentRegistrationService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../../components/common/Modal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {downloadDocumentById} from '../../../services/sopojt-Management/documentReview&ApprovalService'
import { FaDownload } from 'react-icons/fa';

const itemsPerPage = 10;

const DocumentMaster = () => {
  const navigate = useNavigate();
  const { setDocumentDetails } = useContext(DocumentContext);
  
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const tableContainerRef = useRef(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [currentPage, searchTerm, refreshKey]);

  useEffect(() => {
    const checkScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;
      setShowLeftIndicator(container.scrollLeft > 0);
      setShowRightIndicator(container.scrollLeft < container.scrollWidth - container.clientWidth);
    };

    checkScroll();

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [documents]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetchDocumentsByUserId(currentPage, itemsPerPage, searchTerm);
      
      if (response.header.errorCount === 0) {
        setDocuments(response.documentMasters || []);
        setTotalRecords(response.totalRecord || 0);
      } else {
        toast.error(response.header.messages[0].messageText);
      }
      console.log(response)
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleAddDocClick = () => {
    navigate('/sopojt-management/document-registration/register-document');
  };

  const handleEditDocClick = (doc) => {
    try {
      setDocumentDetails(doc);
      localStorage.setItem('editDocumentData', JSON.stringify(doc));
      navigate('/sopojt-management/document-registration/edit-document');
    } catch (error) {
      console.error('Error preparing document for edit:', error);
      toast.error('Failed to prepare document for editing');
    }
  };

  const handleDeleteClick = (doc) => {
    setSelectedDoc(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const userId = sessionStorage.getItem('userID'); // or wherever you store the current user id
  
      const response = await deleteDocument(selectedDoc.documentID, userId);
  
      if (response.header.errorCount === 0) {
        toast.success(response.header.messages[0].messageText || 'Document deactivated successfully');
        setShowDeleteModal(false);
        setSelectedDoc(null);
        setRefreshKey(prev => prev + 1); // Trigger re-fetch
      } else {
        toast.error(response.header.messages[0].messageText || 'Failed to deactivate document');
      }
    } catch (error) {
      console.error('Error deactivating document:', error);
      toast.error('Failed to deactivate document');
    } finally {
      setShowDeleteModal(false);
      setSelectedDoc(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDoc(null);
  };

  const handleScroll = (direction) => {
    const container = tableContainerRef.current;
    if (!container) return;
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDownloadDocument = async (documentId, documentName) => {
    try {
      const response = await downloadDocumentById(documentId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      // Use the document name with a fallback filename
      link.download = documentName ? `${documentName}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar activeMainItem="SOP/OJT Management" activeSubItem="Document Registration" />
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
      
      <div className={styles.container}>
        <div className={styles.documentMaster}>
          <div className={styles.panelHeader}>
            <h2>Document Registration</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <button className={styles.addDocBtn} onClick={handleAddDocClick}>
                + Add
              </button>
            </div>
          </div>

          <div className={styles.docTableContainer} ref={tableContainerRef}>
          {showLeftIndicator && (
              <div 
                className={`${styles.scrollIndicator} ${styles.left} ${styles.visible}`}
                onClick={() => handleScroll('left')}
              >
                <FaChevronLeft />
              </div>
            )}
            {showRightIndicator && (
              <div 
                className={`${styles.scrollIndicator} ${styles.right} ${styles.visible}`}
                onClick={() => handleScroll('right')}
              >
                <FaChevronRight />
              </div>
            )}
            <table className={styles.docTable}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Document Name</th>
                  <th>Document Type</th>
                  <th>Version</th>
                  {/* <th>Effective From</th> */}
                  <th>Download</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.documentID}>
                      <td>{doc.documentCode}</td>
                      <td>{doc.documentName}</td>
                      <td>{doc.documentTypeID}</td>
                      <td>{doc.documentVersion}</td>

                      <td className={styles.downloadCell}>
                        <button
                          onClick={() => handleDownloadDocument(doc.documentID, doc.documentName)}
                          className={styles.downloadBtn}
                          title="Download Document"
                        >
                          <FaDownload className={styles.downloadIcon} />
                        </button>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEditDocClick(doc)}
                            title="Edit Document"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleDeleteClick(doc)}
                            title="Deactivate Document"
                          >
                            <FcCancel className={styles.deleteIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.scrollButtons}>
            <div 
              className={`${styles.scrollIndicator} ${styles.left} ${styles.visible}`}
              onClick={() => handleScroll('left')}
            >
              <FaChevronLeft />
            </div>
            <div 
              className={`${styles.scrollIndicator} ${styles.right} ${styles.visible}`}
              onClick={() => handleScroll('right')}
            >
              <FaChevronRight />
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>
      {showDeleteModal && (
        <Modal
          title="Confirm Deactivate"
          message={`Are you sure you want to deactivate document "${selectedDoc?.documentName}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default DocumentMaster;
