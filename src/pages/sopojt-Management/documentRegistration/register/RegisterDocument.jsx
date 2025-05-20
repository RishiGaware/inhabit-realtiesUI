import React, { useState, useEffect } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import styles from './RegisterDocument.module.css';
import Navbar from '../../../../components/Navbar/Navbar';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchDocumentTypes, createDocument } from '../../../../services/sopojt-Management/DocumentRegistrationService';

const RegisterDocument = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentName: '',
    uniqueCode: '',
    documentType: '',
    version: '',
    estimatedReadingTime: '',
    effectiveFrom: '',
    nextReviewDate: '',
    uploadFile: null,
    remarks: '',
    createdBy: '',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    const getDocumentTypes = async () => {
      try {
        const data = await fetchDocumentTypes();
        if (data?.documentTypes) {
          const options = data.documentTypes.map(type => ({
            value: type.documentTypeName,
            label: type.documentTypeName
          }));
          setDocumentTypes(options);
        }
      } catch (err) {
        const errorMessage = err?.response?.data?.message || 'Failed to load document types';
        toast.error(errorMessage);
      }
    };

    getDocumentTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'effectiveFrom') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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

    const maxReviewPeriod = new Date(effectiveDate);
    maxReviewPeriod.setFullYear(maxReviewPeriod.getFullYear() + 2);
    if (reviewDate > maxReviewPeriod) {
      return 'Next Review Date cannot be more than 2 years after Effective From Date';
    }

    return null;
  };

  const validateFile = (file) => {
    if (!file) return 'File is required';

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are allowed';
    }

    const maxFileSize = 500 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return 'File size must be less than 500MB';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const versionRegex = /^\d+\.\d+$/;
    if (!versionRegex.test(formData.version)) {
      toast.error('Version must be in the format X.Y (e.g., 1.0, 2.1)');
      return;
    }

    if (!formData.estimatedReadingTime || isNaN(formData.estimatedReadingTime) || Number(formData.estimatedReadingTime) <= 0) {
      toast.error('Estimated Reading Time must be a positive number');
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

    const formDataToSend = new FormData();
    formDataToSend.append('DocumentPath', '');
    formDataToSend.append('DocumentExtention', `.${formData.uploadFile.name.split('.').pop()}`);
    formDataToSend.append('SignatureDate', new Date().toISOString());
    formDataToSend.append('PlantID', 0);
    formDataToSend.append('DocumentName', formData.documentName);
    formDataToSend.append('DocumentCode', formData.uniqueCode);
    formDataToSend.append('DocumentTypeID', 1);
    formDataToSend.append('Remarks', formData.remarks || '');
    formDataToSend.append('ElectronicSignature', 'string');
    formDataToSend.append('file', formData.uploadFile);
    formDataToSend.append('EstimatedReadingTime', formData.estimatedReadingTime);
    formDataToSend.append('DocumentVersion', formData.version);
    formDataToSend.append('CreatedBy', formData.createdBy || 'string');

    
    const result = await createDocument(formDataToSend);
    console.log(result,"<<<<<<")
    if (result?.header?.errorCount === 0) {
      const apiMessage = result.header.messages?.[0]?.messageText || 'Document registered successfully';
      toast.success(apiMessage);
      setTimeout(() => {
        navigate('/sopojt-management/document-registration');
      }, 2000);
    } else {
      const errorMessage = result?.header?.messages?.[0]?.messageText || 'Failed to register document';
      toast.error(errorMessage);
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
            <h3 className={styles.sectionHeading}>Register Document</h3>

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

            <div className={styles.row}>
              <label>Estimated Reading Time (minutes) <span className={styles.required}>*</span></label>
              <input 
                type="number"
                min="1"
                name="estimatedReadingTime"
                value={formData.estimatedReadingTime}
                onChange={handleChange}
                required
                placeholder="Enter estimated reading time"
              />
            </div>

            <div className={styles.row}>
              <label>Upload File <span className={styles.required}>*</span></label>
              <input 
                type="file" 
                name="uploadFile" 
                onChange={handleChange} 
                accept=".pdf,.docx" 
                required 
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
              <button type="submit" className={styles.primaryBtn}> Submit</button>
              <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterDocument;
