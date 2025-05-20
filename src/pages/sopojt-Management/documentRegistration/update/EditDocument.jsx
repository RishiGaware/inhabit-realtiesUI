import React, { useState, useEffect, useContext } from 'react';
import styles from '../register/RegisterDocument.module.css';
import Navbar from '../../../../components/Navbar/Navbar';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DocumentContext } from '../../../../context/sopModule/DocumentContext';
import { updateDocument } from '../../../../services/sopojt-Management/DocumentRegistrationService';

const EditDocument = () => {
  const navigate = useNavigate();
  const { documentDetails } = useContext(DocumentContext);

  const [formData, setFormData] = useState({
    id: '',
    documentName: '',
    uniqueCode: '',
    documentType: '',
    version: '',
    effectiveFrom: '',
    nextReviewDate: '',
    uploadFile: null,
    remarks: '',
  });

  const documentTypes = [
    { value: 'SOP', label: 'SOP' },
    { value: 'WI', label: 'Work Instruction' },
    { value: 'Protocol', label: 'Protocol' },
    { value: 'Policy', label: 'Policy' },
    { value: 'Manual', label: 'Manual' },
  ];

  useEffect(() => {
    // First try to get data from context
    if (documentDetails) {
      setFormData({
        id: documentDetails.id,
        documentName: documentDetails.name,
        uniqueCode: documentDetails.code,
        documentType: documentDetails.type,
        version: documentDetails.version,
        effectiveFrom: documentDetails.effectiveFrom,
        nextReviewDate: documentDetails.nextReviewDate,
        uploadFile: null,
        remarks: documentDetails.remarks || '',
      });
    } else {
      // If context is empty, try to get data from localStorage
      const storedDoc = localStorage.getItem('editDocumentData');
      if (storedDoc) {
        const docData = JSON.parse(storedDoc);
        setFormData({
          id: docData.id,
          documentName: docData.name,
          uniqueCode: docData.code,
          documentType: docData.type,
          version: docData.version,
          effectiveFrom: docData.effectiveFrom,
          nextReviewDate: docData.nextReviewDate,
          uploadFile: null,
          remarks: docData.remarks || '',
        });
      } else {
        // If no data is found in either place, redirect back
        toast.error('No document selected for editing');
        navigate('/sopojt-management/document-registration');
      }
    }
  }, [documentDetails, navigate]);

  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('editDocumentData');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Special handling for Effective From date to update Next Review Date min
    if (name === 'effectiveFrom') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // If Next Review Date is before new Effective From date, reset it
        nextReviewDate: prev.nextReviewDate && new Date(prev.nextReviewDate) < new Date(value) 
          ? prev.nextReviewDate 
          : ''
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value,
      }));
    }
  };

  const validateDocumentName = (name) => {
    if (name.length < 5) {
      return 'Document name must be at least 5 characters long';
    }
    if (name.length > 100) {
      return 'Document name must not exceed 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-_.,()]+$/.test(name)) {
      return 'Document name can only contain letters, numbers, spaces, and basic punctuation';
    }
    return null;
  };

  const validateUniqueCode = (code) => {
    if (!code) return 'Unique code is required';
    
    // Format validation (e.g., SOP-001, WI-001)
    const codeRegex = /^(SOP|WI|Protocol|Policy|Manual)-\d{3}$/;
    if (!codeRegex.test(code)) {
      return 'Unique code must follow the format: TYPE-XXX (e.g., SOP-001)';
    }
    return null;
  };

  const validateDates = (effectiveFrom, nextReviewDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveDate = new Date(effectiveFrom);
    const reviewDate = new Date(nextReviewDate);

    if (effectiveDate < today) {
      return 'Effective From date cannot be in the past';
    }

    if (reviewDate <= effectiveDate) {
      return 'Next Review Date must be after Effective From Date';
    }

    // Maximum review period (e.g., 2 years)
    const maxReviewPeriod = new Date(effectiveDate);
    maxReviewPeriod.setFullYear(maxReviewPeriod.getFullYear() + 2);
    if (reviewDate > maxReviewPeriod) {
      return 'Next Review Date cannot be more than 2 years after Effective From Date';
    }

    return null;
  };

  const validateFile = (file) => {
    if (file) {
      // File type validation
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        return 'Only PDF and DOCX files are allowed';
      }

      // File size validation (500MB)
      const maxFileSize = 500 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return 'File size must be less than 500MB';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateDocumentName(formData.documentName);
    if (nameError) {
      toast.error(nameError);
      return;
    }

    const codeError = validateUniqueCode(formData.uniqueCode);
    if (codeError) {
      toast.error(codeError);
      return;
    }

    if (!formData.documentType) {
      toast.error('Please select a document type');
      return;
    }

    // Version format validation
    const versionRegex = /^\d+\.\d+$/;
    if (!versionRegex.test(formData.version)) {
      toast.error('Version must be in the format X.Y (e.g., 1.0, 2.1)');
      return;
    }

    const dateError = validateDates(formData.effectiveFrom, formData.nextReviewDate);
    if (dateError) {
      toast.error(dateError);
      return;
    }

    const fileError = validateFile(formData.uploadFile);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      const response = await updateDocument({
        id: formData.id,
        name: formData.documentName,
        code: formData.uniqueCode,
        type: formData.documentType,
        version: formData.version,
        effectiveFrom: formData.effectiveFrom,
        nextReviewDate: formData.nextReviewDate,
        remarks: formData.remarks,
        // Only include file if a new one was uploaded
        file: formData.uploadFile
      });

      if (response.header.errorCount === 0) {
        toast.success('Document updated successfully');
        setTimeout(() => {
          navigate('/sop-module/document-registration');
        }, 2000);
      } else {
        toast.error(response.header.messages[0].messageText);
      }
    } catch (error) {
      toast.error('Failed to update document');
      console.error('Error updating document:', error);
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
      <Navbar />
      <Sidebar activeMainItem="SOP/OJT Management" activeSubItem="Document Registration" />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <h3 className={styles.sectionHeading}>Edit Document</h3>

            <div className={styles.row}>
              <label>Document Name <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                name="documentName" 
                value={formData.documentName} 
                onChange={handleChange} 
                required 
                placeholder="Enter document name (5-100 characters)"
              />
            </div>

            <div className={styles.row}>
              <label>Unique Code <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                name="uniqueCode" 
                value={formData.uniqueCode} 
                onChange={handleChange} 
                required 
                placeholder="e.g., SOP-001"
                disabled // Unique code should not be editable
              />
            </div>

            <div className={styles.row}>
              <label>Document Type <span className={styles.required}>*</span></label>
              <Select
                name="documentType"
                options={documentTypes}
                value={documentTypes.find((type) => type.value === formData.documentType)}
                onChange={(selected) =>
                  setFormData({ ...formData, documentType: selected ? selected.value : '' })
                }
                isClearable
                placeholder="-- Select Document Type --"
                className={styles.reactSelect}
              />
            </div>

            <div className={styles.row}>
              <label>Version <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                name="version" 
                value={formData.version} 
                onChange={handleChange} 
                required 
                placeholder="e.g., 1.0"
              />
            </div>

            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Effective From <span className={styles.required}>*</span></label>
                <input 
                  type="date" 
                  name="effectiveFrom" 
                  value={formData.effectiveFrom} 
                  onChange={handleChange} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className={styles.row}>
                <label>Next Review Date <span className={styles.required}>*</span></label>
                <input 
                  type="date" 
                  name="nextReviewDate" 
                  value={formData.nextReviewDate} 
                  onChange={handleChange} 
                  required 
                  min={formData.effectiveFrom || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className={styles.row}>
              <label>Upload File</label>
              <input 
                type="file" 
                name="uploadFile" 
                onChange={handleChange} 
                accept=".pdf,.docx"
              />
              <small>Accepted formats: PDF, DOCX (Max size: 500MB)</small>
            </div>

            <div className={styles.row}>
              <label>Remarks</label>
              <textarea 
                name="remarks" 
                value={formData.remarks} 
                onChange={handleChange} 
                maxLength={500} 
                placeholder="Enter remarks (max 500 characters)"
              />
              <small>{formData.remarks.length}/500 characters</small>
            </div>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.primaryBtn}>Update Document</button>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDocument;
