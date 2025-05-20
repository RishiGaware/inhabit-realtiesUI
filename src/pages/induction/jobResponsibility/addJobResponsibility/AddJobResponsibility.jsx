import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './AddJobResposibility.module.css';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUsersNotAssignedJobResponsibility, createJobResponsibility } from '../../../../services/induction/JobResponsibilityService';

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

const AddJobResposibility = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    userID: '',
    inductionID: '',
    title: '',
    JobResposibility: '',
    responsibilities: '',
  });

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setUsers(formattedUsers);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selected, field) => {
    console.log('Selected value:', selected);
    if (field === 'userID') {
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

    const requiredFields = ['userID', 'title', 'JobResposibility'];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field.`, TOAST_CONFIG);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Get user data from session storage
      const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      const plantID = sessionStorage.getItem('plantID') || '1';

      const payload = {
        inductionID: parseInt(formData.inductionID),
        userID: parseInt(formData.userID),
        jobDescriptionMasterID: 1,
        title: formData.title,
        description: formData.JobResposibility,
        responsibilities: formData.responsibilities || '',
        createdBy: userData.userID?.toString() || '2',
        plantID: plantID,
        electronicSignature: userData.firstName + ' ' + userData.lastName,
        signatureDate: new Date().toISOString()
      };

      console.log('Submitting payload:', payload);
      const response = await createJobResponsibility(payload);
      
      if (response.header?.errorCount > 0) {
        const errorMessage = response.header.messages[0]?.messageText || 'Failed to create job responsibility';
        toast.error(errorMessage, TOAST_CONFIG);
        setIsSubmitting(false);
        return;
      }

      if (response.header?.informationCount > 0) {
        const successMessage = response.header.messages[0]?.messageText || 'Job responsibility created successfully';
        toast.success(successMessage, TOAST_CONFIG);
        
        // Add delay before redirecting
        setTimeout(() => {
          navigate('/induction/job-Responsibility');
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating job responsibility:', error);
      const errorMessage = error.response?.data?.header?.messages?.[0]?.messageText || 
        'An error occurred while creating job responsibility';
      toast.error(errorMessage, TOAST_CONFIG);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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

  const customTitleSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: '#000000', // text color for all states
      backgroundColor: state.isSelected || state.isFocused ? '#e6f7ff' : '#ffffff',
      fontWeight: 'normal',
      cursor: 'pointer',
    }),
    control: (provided, state) => ({
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
            <h3 className={styles.sectionHeading}>Add Job Responsibility</h3>

            <div className={styles.row}>
              <label className={styles.labelWithPadding}>
                User <span className={styles.required}>*</span>
              </label>
              <Select
                name="userID"
                options={users}
                value={users.find((u) => u.value === formData.userID) || null}
                onChange={(selected) => handleSelectChange(selected, 'userID')}
                isClearable
                placeholder="-- Select User --"
                className={styles.reactSelect}
                isLoading={isLoading}
                classNamePrefix="select"
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
                className={styles.reactSelect} // your module.css
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

            <div className={styles.buttonContainer}>
              <button 
                type="submit" 
                className={styles.primaryBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default AddJobResposibility;

