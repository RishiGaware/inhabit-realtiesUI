import React, { useState, useEffect, useRef } from 'react';
import styles from './documentReview&Approval.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Navbar from '../../../components/navbar/Navbar';
import { FaEye, FaCheck, FaUndo, FaTimes, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Pagination from '../../../components/pagination/Pagination';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../../components/common/Modal';
import { fetchPendingDocuments, updateDocumentStatus, downloadDocumentById } from '../../../services/sopojt-Management/documentReview&ApprovalService';
import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react';

const itemsPerPage = 10;

const DocumentReviewApproval = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnRemarks, setReturnRemarks] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const tableContainerRef = useRef(null);

  const checkScroll = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
      
      setShowLeftIndicator(!isAtStart);
      setShowRightIndicator(!isAtEnd);
    }
  };

  const handleScroll = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = tableContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      tableContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [currentPage, searchTerm]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetchPendingDocuments();
      
      if (response.header.errorCount === 0) {
        const filteredDocs = response.documentMasters.filter(doc => 
          doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.documentCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setDocuments(filteredDocs);
        setTotalRecords(filteredDocs.length);
      } else {
        toast.error(response.header.messages[0].messageText);
      }
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

  const handleViewDocument = async (documentId) => {
    try {
      const response = await downloadDocumentById(documentId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to preview document');
    }
  };

  const closePdfViewer = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const handleDownloadDocument = async (documentId) => {
    try {
      const response = await downloadDocumentById(documentId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Document_${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleApprove = (doc) => {
    setSelectedDoc(doc);
    setShowApproveModal(true);
  };

  // Unified status update handler
  const handleStatusUpdate = async (status, remarks = '') => {
    if ((status === 'Rejected' || status === 'Return') && !remarks.trim()) {
      toast.error(`Please provide ${status.toLowerCase()} remarks`);
      return;
    }

    try {
      const response = await updateDocumentStatus({
        documentID: selectedDoc.documentID,
        documentStatus: status,
        modifiedBy: sessionStorage.getItem('userID'),
        ...(remarks && { reasonForChange: remarks })
      });

      if (response.header.errorCount === 0) {
        const message = response?.header?.messages?.[0]?.messageText ?? `Document ${status.toLowerCase()}ed successfully`;
        toast.success(message);
        if (status === 'Rejected') {
          setShowRejectModal(false);
          setRejectionRemarks('');
        } else if (status === 'Return') {
          setShowReturnModal(false);
          setReturnRemarks('');
        } else {
          setShowApproveModal(false);
        }
        setSelectedDoc(null);
        loadDocuments();
      } else {
        const errorMessage = response?.header?.messages?.[0]?.messageText ?? `Failed to ${status.toLowerCase()} document`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing document:`, error);
      toast.error(`Failed to ${status.toLowerCase()} document`);
    }
  };

  const handleReturn = (doc) => {
    setSelectedDoc(doc);
    setShowReturnModal(true);
  };

  const handleReject = (doc) => {
    setSelectedDoc(doc);
    setShowRejectModal(true);
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return documents.slice(startIndex, endIndex);
  };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar />
      <Sidebar activeMainItem="SOP/OJT Management" activeSubItem="Document Review & Approval" />
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

      {showApproveModal && (
        <Modal
          title="Confirm Approval"
          message={`Are you sure you want to approve ${selectedDoc?.documentName}?`}
          onConfirm={() => handleStatusUpdate('Approved')}
          onCancel={() => {
            setShowApproveModal(false);
            setSelectedDoc(null);
          }}
        />
      )}

      {showRejectModal && (
        <Modal
          title="Reject Document"
          message={
            <div className={styles.rejectModalContent}>
              <p>Are you sure you want to reject this document?</p>
              <textarea
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="Enter rejection remarks..."
                className={styles.rejectionRemarks}
                required
              />
            </div>
          }
          onConfirm={() => handleStatusUpdate('Rejected', rejectionRemarks)}
          onCancel={() => {
            setShowRejectModal(false);
            setSelectedDoc(null);
            setRejectionRemarks('');
          }}
        />
      )}

      {showReturnModal && (
        <Modal
          title="Return Document"
          message={
            <div className={styles.rejectModalContent}>
              <p>Are you sure you want to return this document?</p>
              <textarea
                value={returnRemarks}
                onChange={(e) => setReturnRemarks(e.target.value)}
                placeholder="Enter return remarks..."
                className={styles.rejectionRemarks}
                required
              />
            </div>
          }
          onConfirm={() => handleStatusUpdate('Return', returnRemarks)}
          onCancel={() => {
            setShowReturnModal(false);
            setSelectedDoc(null);
            setReturnRemarks('');
          }}
        />
      )}


      <div className={styles.container}>
        <div className={styles.documentReview}>
          <div className={styles.panelHeader}>
            <h2>Document Review & Approval</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div ref={tableContainerRef} className={styles.docTableContainer}>
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
            <div className={styles.tableWrapper}>
              <table className={styles.docTable}>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Document Code</th>
                    <th>Document Type</th>
                    <th>Version</th>
                    <th>Actions</th>
                    <th>View</th>
                    <th>Download</th>
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
                    getCurrentItems().map((doc) => (
                      <tr key={doc.documentID}>
                        <td>{doc.documentName}</td>
                        <td>{doc.documentCode}</td>
                        <td>{doc.documentTypeID}</td>
                        <td>{doc.documentVersion}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleApprove(doc)}
                              title="Approve Document"
                            >
                              <FaCheck className={styles.approveIcon} />
                              <span>Approve</span>
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleReturn(doc)}
                              title="Return Document"
                            >
                              <FaUndo className={styles.returnIcon} />
                              <span>Return</span>
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleReject(doc)}
                              title="Reject Document"
                            >
                              <FaTimes className={styles.rejectIcon} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                        <td className={styles.viewColumn}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => handleViewDocument(doc.documentID)}
                            title="View Document"
                          >
                            <FaEye className={styles.viewIcon} />
                          </button>
                        </td>
                        <td>
                          <button
                            className={styles.downloadBtn}
                            onClick={() => handleDownloadDocument(doc.documentID)}
                            title="Download Document"
                          >
                            <FaDownload className={styles.downloadIcon} />                          
                          </button>
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
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />

        {pdfUrl && (
          <div className={styles.pdfViewerOverlayOuter}>
            <div className={styles.pdfViewerCenteredContainer}>
              <div className={styles.pdfViewerCloseBtnWrapper}>
                <button
                  onClick={closePdfViewer}
                  className={styles.pdfViewerCloseBtn}
                >
                  Close Preview
                </button>
              </div>
              <div className={styles.pdfViewerInnerContainer}>
                <RPConfig>
                  <RPProvider src={pdfUrl}>
                    <RPDefaultLayout style={{ height: '100%', flexGrow: 1 }}>
                      <RPPages />
                    </RPDefaultLayout>
                  </RPProvider>
                </RPConfig>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default DocumentReviewApproval;
