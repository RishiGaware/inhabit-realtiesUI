import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import loginImg from '../../assets/images/loginImg.jpg';
import logo from '../../assets/images/logo.png';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { getIpAndLocation } from '../../utils/locationUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword } from '../../services/systemAdmin/ForgotPasswordService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [locationData, setLocationData] = useState({
    ip: "127.0.0.1",
    lat: "0",
    long: "0"
  });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotLoginId, setForgotLoginId] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Fetch location data when component mounts
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await getIpAndLocation();
        setLocationData({
          ip: data.ip || "127.0.0.1",
          lat: data.lat?.toString() || "0",
          long: data.long?.toString() || "0"
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        // Keep default values if location fetch fails
      }
    };

    fetchLocationData();
  }, []); // Empty dependency array means this runs once on mount

  const handleSignIn = async () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await axios.post('http://82.180.147.10:7002/api/authentication/login', {
        username: email,
        password: password,
        ipAddress: locationData.ip,
        latitude: locationData.lat,
        longitude: locationData.long
      });

      if (response.status === 200) {
        sessionStorage.setItem('userData', JSON.stringify(response.data.userMaster));
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('plantId', response.data.userMaster.plantID);
        sessionStorage.setItem('userId', response.data.userMaster.userID);

        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        // Check if password reset is required
        if (response.data.userMaster.isReset === true) {
          setTimeout(() => navigate('/profile/password-change'), 2000);
        } else {
          setTimeout(() => navigate('/select-plant'), 2000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.header?.messages?.[0]?.messageText || 'Login failed';
      const currentFailedAttempts = error.response?.data?.failedAttempts;
      
      setFailedAttempts(currentFailedAttempts);
      setErrors(prev => ({ ...prev, general: errorMessage }));

      // Show password reset button only if failedAttempts < 0
      // Show attempts remaining if failedAttempts > 0
      if (currentFailedAttempts < 0) {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000
        });
      } else {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSignIn();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(prev => ({ ...prev, reset: '' }));

    try {
      const token = sessionStorage.getItem('authToken');

      const response = await axios.post(
        'http://82.180.147.10:7002/api/password/reset',
        { loginId: resetEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const errorCount = response.data?.header?.errorCount;
      const errorMsg = response.data?.header?.messages?.[0]?.messageText;

      if (errorCount && errorCount > 0) {
        setErrors(prev => ({
          ...prev,
          reset: errorMsg || 'An error occurred while submitting the reset request.'
        }));
      } else {
        setResetSubmitted(true);
        setTimeout(() => {
          setShowResetModal(false);
          setResetSubmitted(false);
          setResetEmail('');
        }, 3000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.header?.messages?.[0]?.messageText ||
        error.response?.data?.message ||
        'Failed to submit reset request. Please try again.';

      setErrors(prev => ({ ...prev, reset: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit Handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await forgotPassword(forgotLoginId);
      const messages = res.header?.messages || [];
      const errorMessages = messages.filter(msg => msg.messageLevel === 'Error').map(msg => msg.messageText);
      const infoMessages = messages.filter(msg => msg.messageLevel === 'Information').map(msg => msg.messageText);
      if (res.header?.errorCount === 0) {
        infoMessages.forEach((msg, idx) => toast.success(msg, { position: 'top-right', autoClose: 1500 + idx * 500, hideProgressBar: false }));
        setShowForgotModal(false);
        setForgotLoginId('');
      } else {
        errorMessages.forEach((msg, idx) => toast.error(msg, { position: 'top-right', autoClose: 3000 + idx * 500, hideProgressBar: false }));
      }
    } catch (error) {
      toast.error('An error occurred while processing your request.', { position: 'top-right', autoClose: 3000, hideProgressBar: false });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown} tabIndex={0}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
      <div className={styles.left}>
        <img src={loginImg} alt="Login Visual" className={styles.leftImage} />
      </div>

      <div className={styles.right}>
        <div className={styles.formContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />

          <label htmlFor="email" className={styles.label}>Username</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              id="email"
              placeholder="Enter Username"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            {errors.email && <span className={styles.errorText}>⚠ {errors.email}</span>}
          </div>

          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter Password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <span className={styles.errorText}>⚠ {errors.password}</span>}
          </div>

          {/* Forgot Password Button */}
          <div className={styles.forgotPassword}>
            <button
              type="button"
              className={styles.forgotPasswordBtn}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </button>
          </div>

          {failedAttempts > 0 && (
            <div className={styles.attemptsWarning}>
              <span>⚠️ {failedAttempts} {failedAttempts === 1 ? 'attempt' : 'attempts'} remaining</span>
            </div>
          )}

          <button
            className={styles.signInButton}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>

          {failedAttempts < 0 && (
            <button
              className={styles.resetPasswordBtn}
              onClick={() => setShowResetModal(true)}
              style={{ marginTop: 16 }}
            >
              Request Password Reset
            </button>
          )}
        </div>
      </div>

      {showResetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeModal} onClick={() => setShowResetModal(false)}>
              <FaTimes />
            </button>
            <h2>Password Reset Request</h2>
            {resetSubmitted ? (
              <div className={styles.resetSuccess}>
                <p>Your password reset request has been submitted to the administrator.</p>
                <p>You will be notified once your password has been reset.</p>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                {errors.reset && (
                  <div className={styles.resetError}>{errors.reset}</div>
                )}
                <div className={styles.modalInputGroup}>
                  <label htmlFor="resetEmail" style={{ color: 'black' }}>Login ID</label>
                  <input
                    type="text"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your login ID"
                    required
                    disabled={loading}
                    style={{ color: 'black' }}
                  />
                </div>
                <div className={styles.modalButtons}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowResetModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeModal} onClick={() => setShowForgotModal(false)}>
              <FaTimes />
            </button>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotSubmit}>
              <div className={styles.modalInputGroup}>
                <label htmlFor="forgotLoginId" style={{ color: 'black' }}>Login ID</label>
                <input
                  type="text"
                  id="forgotLoginId"
                  value={forgotLoginId}
                  onChange={(e) => setForgotLoginId(e.target.value)}
                  placeholder="Enter your login ID"
                  required
                  disabled={forgotLoading}
                  style={{ color: 'black' }}
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForgotModal(false)}
                  disabled={forgotLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
