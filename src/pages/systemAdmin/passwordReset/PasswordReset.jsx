import React, { useState, useEffect, useContext } from 'react'; 
import styles from './PasswordReset.module.css';

import { MdResetTv } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { fetchPasswordResetRequests, acceptPasswordReset } from '../../../services/systemAdmin/PasswordResetService'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordReset = () => {
  const { userDetails } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch reset requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchPasswordResetRequests(); // Using the service
        if (data.header?.errorCount === 0 && Array.isArray(data.passwordReset)) {
          setRequests(data.passwordReset);
        } else {
          console.error('Error fetching reset requests:', data?.header?.messages);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handlePasswordChange = (transactionID, value) => {
    setPasswords({ ...passwords, [transactionID]: value });
  };

  // Accept password reset
  const handleReset = async (transactionID) => {
    const password = passwords[transactionID];
    const plantID = userDetails?.plantID || 0;
    const acceptedBy = userDetails?.userID?.toString() || userDetails?.firstName || 'Admin';

    if (!password) {
      toast.error('Please enter a password.', { position: 'top-right', autoClose: 3000, hideProgressBar: false });
      return;
    }

    try {
      const result = await acceptPasswordReset(transactionID, password, acceptedBy, plantID); // Using the service
      const messages = result.header?.messages || [];
      const errorMessages = messages.filter(msg => msg.messageLevel === 'Error').map(msg => msg.messageText);
      const infoMessages = messages.filter(msg => msg.messageLevel === 'Information').map(msg => msg.messageText);
      if (result.header?.errorCount === 0) {
        infoMessages.forEach((msg, idx) => toast.success(msg, { position: 'top-right', autoClose: 1500 + idx * 500, hideProgressBar: false }));
        setRequests(prev => prev.filter(r => r.transactionID !== transactionID));
      } else {
        errorMessages.forEach((msg, idx) => toast.error(msg, { position: 'top-right', autoClose: 3000 + idx * 500, hideProgressBar: false }));
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting password.', { position: 'top-right', autoClose: 3000, hideProgressBar: false });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className={styles.container}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className={styles.loader}></div>
            <p>Loading Password Reset Requests...</p>
          </div>
        ) : (
        <div className={styles.passwordReset}>
          <div className={styles.panelHeader}>
            <h2>Password Reset Requests</h2>
          </div>
          <div className={styles.userTableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>New Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.transactionID}>
                    <td>{req.employeeID}</td>
                    <td>{`${req.firstName} ${req.lastName}`}</td>
                    <td>
                      <input
                        type="password"
                        className={styles.resetInput}
                        value={passwords[req.transactionID] || ''}
                        onChange={(e) => handlePasswordChange(req.transactionID, e.target.value)}
                      />
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.resetBtn}
                        onClick={() => handleReset(req.transactionID)}
                      >
                        <MdResetTv />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && requests.length === 0 && <p>No password reset requests.</p>}
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default PasswordReset;