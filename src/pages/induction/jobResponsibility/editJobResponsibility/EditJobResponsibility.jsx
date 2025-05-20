import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './EditJobResponsibility.module.css';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUsersNotAssignedJobResponsibility, updateJobResponsibility } from '../../../../services/induction/JobResponsibilityService';

const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  toastId: 'unique-toast'
};

// Static list of job titles for suggestions
const JOB_TITLES = [
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Quality Assurance Engineer', label: 'Quality Assurance Engineer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'Technical Lead', label: 'Technical Lead' },
  { value: 'System Administrator', label: 'System Administrator' },
  { value: 'Database Administrator', label: 'Database Administrator' },
  { value: 'Network Engineer', label: 'Network Engineer' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' }
];

const customTitleSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    color: '#000000', // text color for all states
    backgroundColor: state.isSelected || state.isFocused ? '#e6f7ff' : '#ffffff',
    fontWeight: 'normal',
    cursor: 'pointer',
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '38px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    '&:hover': {
      borderColor: '#40a9ff',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000000',
    fontWeight: 'normal',
  }),
  input: (provided) => ({
    ...provided,
    color: '#000000',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#bfbfbf',
  }),
};

const EditJobResponsibility = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    userID: '',
    inductionID: '',
    title: '',
    JobResposibility: '',
    responsibilities: '',
    reasonForChange: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [titleInputValue, setTitleInputValue] = useState('');
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [isTitleMenuOpen, setIsTitleMenuOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetchUsersNotAssignedJobResponsibility();
      console.log('Fetched user data:', response);

      if (response.header?.errorCount > 0) {
        toast.error(response.header.messages[0].messageText, TOAST_CONFIG);
        return;
      }

      if (response.users) {
        const formattedUsers = response.users.map((u) => ({
          value: u.userID.toString(),
          label: u.userName,
          inductionID: u.inductionID
        }));
        console.log('Formatted users:', formattedUsers);
      }
    } catch (error) {
      const msg =
        error.response?.data?.header?.messages?.[0]?.messageText ||
        'Error fetching users. Please try again.';
      toast.error(msg, TOAST_CONFIG);
    } finally {
      setIsLoading(false);
      }
  }, [isLoading]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [fetchData]);

  useEffect(() => {
    const loadJobResponsibilityData = () => {
      try {
        // First try to get data from localStorage
        const storedData = localStorage.getItem('editJobResponsibilityFormData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('Loaded stored data:', parsedData);

          // Set form data with correct field mapping
          setFormData({
            userID: parsedData.userID || '',
            inductionID: parsedData.inductionID || '',
            title: parsedData.title || '',
            JobResposibility: parsedData.description || '', // Map description to JobResposibility
            responsibilities: parsedData.responsibilities || '', // Keep responsibilities as is
            reasonForChange: ''
          });

          // Set selected user with the correct user data from stored data
          if (parsedData.userID && parsedData.firstName && parsedData.lastName) {
            const user = {
              value: parsedData.userID.toString(),
              label: `${parsedData.firstName} ${parsedData.lastName}`,
              inductionID: parsedData.inductionID
            };
            setSelectedUser(user);
          }

          // Set the title input value and filtered titles
          setTitleInputValue(parsedData.title || '');
          if (parsedData.title) {
            const filtered = JOB_TITLES.filter(option =>
              option.label.toLowerCase().includes(parsedData.title.toLowerCase())
            );
            setFilteredJobTitles(filtered);
          }

          return;
        }

        // If no data available, show error and redirect
        toast.error('No job responsibility data found for editing', TOAST_CONFIG);
        navigate('/induction/job-Responsibility');
      } catch (error) {
        console.error('Error loading job responsibility data:', error);
        toast.error('Failed to load job responsibility data', TOAST_CONFIG);
        navigate('/induction/job-Responsibility');
      }
    };

    loadJobResponsibilityData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTitleInputChange = (inputValue) => {
    setTitleInputValue(inputValue);
    if (inputValue) {
      const filtered = JOB_TITLES.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredJobTitles(filtered);
      setIsTitleMenuOpen(true);
    } else {
      setFilteredJobTitles([]);
      setIsTitleMenuOpen(false);
    }
  };

  const handleSelectChange = (selected, field) => {
    console.log('Selected value:', selected);
    if (field === 'userID') {
      setSelectedUser(selected);
      setFormData((prev) => ({
        ...prev,
        userID: selected ? selected.value : '',
        inductionID: selected ? selected.inductionID : ''
      }));
    } else if (field === 'title') {
    setFormData((prev) => ({
      ...prev,
        title: selected ? selected.value : ''
    }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.reasonForChange.trim()) {
      toast.error('Please provide a reason for the change', TOAST_CONFIG);
      setIsSubmitting(false);
      return;
    }

    const requiredFields = ['userID', 'title', 'JobResposibility'];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field.`, TOAST_CONFIG);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const storedData = JSON.parse(localStorage.getItem('editJobResponsibilityFormData'));
      if (!storedData) {
        throw new Error('No stored job responsibility data found');
      }

      // Get user data from session storage
      const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

      const payload = {
        jobResponsibilityID: parseInt(storedData.jobResponsibilityID),
        inductionID: parseInt(storedData.inductionID),
        userID: parseInt(storedData.userID),
        jobDescriptionMasterID: 1,
        title: formData.title,
        description: formData.JobResposibility,
        responsibilities: formData.responsibilities || '',
        modifiedBy: userData.userID?.toString() || '2',
        reasonForChange: formData.reasonForChange,
        electronicSignature: userData.firstName + ' ' + userData.lastName,
        signatureDate: new Date().toISOString()
      };

      console.log('Submitting payload:', payload);
      const response = await updateJobResponsibility(payload);
      
      if (response.header?.errorCount > 0) {
        const errorMessage = response.header.messages[0]?.messageText || 'Failed to update job responsibility';
        toast.error(errorMessage, TOAST_CONFIG);
        setIsSubmitting(false);
        return;
      }

      if (response.header?.informationCount > 0) {
        const successMessage = response.header.messages[0]?.messageText || 'Job responsibility updated successfully';
        toast.success(successMessage, TOAST_CONFIG);
        localStorage.removeItem('editJobResponsibilityFormData');
        
        // Add delay before redirecting
        setTimeout(() => {
          navigate('/induction/job-Responsibility');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating job responsibility:', error);
      const errorMessage = error.response?.data?.header?.messages?.[0]?.messageText || 
        'An error occurred while updating job responsibility';
      toast.error(errorMessage, TOAST_CONFIG);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
        limit={1}
      />
      
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <h3 className={styles.sectionHeading}>Edit Job Responsibility</h3>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>
                User <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={selectedUser ? selectedUser.label : ''}
                readOnly
                className={styles.readOnlyInput}
              />
            </div>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>
                Title <span className={styles.required}>*</span>
              </label>
              <Select
                name="title"
                options={filteredJobTitles}
                value={formData.title ? { value: formData.title, label: formData.title } : null}
                onChange={(selected) => handleSelectChange(selected, 'title')}
                onInputChange={handleTitleInputChange}
                isClearable
                placeholder="Type to search job title"
                className={styles.reactSelect}
                classNamePrefix="select"
                inputValue={titleInputValue}
                menuIsOpen={isTitleMenuOpen}
                onBlur={() => setIsTitleMenuOpen(false)}
                menuPortalTarget={document.body}
                noOptionsMessage={() => null}
                styles={customTitleSelectStyles}
              />
            </div>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                name="JobResposibility"
                value={formData.JobResposibility}
                onChange={handleChange}
                rows="2"
                required
              />
            </div>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>Responsibilities (Optional)</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>
                Reason for Change <span className={styles.required}>*</span>
              </label>
              <textarea
                name="reasonForChange"
                value={formData.reasonForChange}
                onChange={handleChange}
                rows="2"
                placeholder="Please provide a reason for the changes"
                required
              />
            </div>

            <div className={styles.buttonContainer}>
              <button 
                type="submit" 
                className={styles.primaryBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
              <button 
                type="button" 
                className={styles.cancelBtn} 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditJobResponsibility;