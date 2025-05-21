import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import loginImg from '../../assets/images/loginImage1.jpg';
import logo from '../../assets/images/logown.png';
import { FaTimes } from 'react-icons/fa';
import { getIpAndLocation } from '../../utils/locationUtils';
import { showToast } from '../../utils/toastConfig';
import { authService } from '../../services/auth/authService';
import FloatingInput from '../../components/common/FloatingInput';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
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
      }
    };

    fetchLocationData();
  }, []);

  const handleSignIn = async () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await authService.login({
        username: email,
        password: password,
        ipAddress: locationData.ip,
        latitude: locationData.lat,
        longitude: locationData.long
      });

      sessionStorage.setItem('userData', JSON.stringify(response.userMaster));
      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('plantId', response.userMaster.plantID);
      sessionStorage.setItem('userId', response.userMaster.userID);

      showToast.success('Login successful!');

      if (response.userMaster.isReset === true) {
        setTimeout(() => navigate('/profile/password-change'), 2000);
      } else {
        setTimeout(() => navigate('/select-plant'), 2000);
      }
    } catch (error) {
      const errorMessage = error.header?.messages?.[0]?.messageText || 'Login failed';
      const currentFailedAttempts = error.failedAttempts;
      
      setFailedAttempts(currentFailedAttempts);
      setErrors(prev => ({ ...prev, general: errorMessage }));

      if (currentFailedAttempts < 0) {
        showToast.error(errorMessage);
      } else {
        showToast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(prev => ({ ...prev, reset: '' }));

    try {
      const response = await authService.forgotPassword(resetEmail);
      const errorCount = response?.header?.errorCount;
      const errorMsg = response?.header?.messages?.[0]?.messageText;

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
      const errorMsg = error.header?.messages?.[0]?.messageText || 'Failed to submit reset request. Please try again.';
      setErrors(prev => ({ ...prev, reset: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword(forgotLoginId);
      const messages = res.header?.messages || [];
      const errorMessages = messages.filter(msg => msg.messageLevel === 'Error').map(msg => msg.messageText);
      const infoMessages = messages.filter(msg => msg.messageLevel === 'Information').map(msg => msg.messageText);
      
      if (res.header?.errorCount === 0) {
        infoMessages.forEach((msg, idx) => showToast.success(msg));
        setShowForgotModal(false);
        setForgotLoginId('');
      } else {
        errorMessages.forEach(msg => showToast.error(msg));
      }
    } catch (error) {
      showToast.error('An error occurred while processing your request.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.container} onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} tabIndex={0}>
      <div className={styles.left}>
        <img src={loginImg} alt="Login Visual" className={styles.leftImage} />
      </div>

      <div className={styles.right}>
        <div className={styles.formContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2>Welcome Back</h2>

          <FloatingInput
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Username"
            error={errors.email}
            required
            autoFocus
          />

          <FloatingInput
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            error={errors.password}
            required
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

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

          <div className={styles.registerText}>
            Don't have an account?{' '}
            <button
              className={styles.registerLink}
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>

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
                  <FloatingInput
                    type="text"
                    id="resetEmail"
                    name="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    label="Login ID"
                    error={errors.reset}
                    required
                    disabled={loading}
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

      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeModal} onClick={() => setShowForgotModal(false)}>
              <FaTimes />
            </button>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotSubmit}>
              <div className={styles.modalInputGroup}>
                <FloatingInput
                  type="text"
                  id="forgotLoginId"
                  name="forgotLoginId"
                  value={forgotLoginId}
                  onChange={(e) => setForgotLoginId(e.target.value)}
                  label="Login ID"
                  required
                  disabled={forgotLoading}
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
