import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import loginImg from '../../assets/images/loginImage1.jpg';
import logo from '../../assets/images/logown.png';
import { showToast } from '../../utils/toastConfig';
import { authService } from '../../services/auth/authService';
import FloatingInput from '../../components/common/FloatingInput';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await authService.register(formData);
      showToast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={loginImg} alt="Register Visual" className={styles.leftImage} />
      </div>

      <div className={styles.right}>
        <div className={styles.formContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2>Create Account</h2>

          <FloatingInput
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            label="Full Name"
            error={errors.fullName}
            required
          />

          <FloatingInput
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="Username"
            error={errors.username}
            required
          />

          <FloatingInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            error={errors.email}
            required
          />

          <FloatingInput
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            label="Phone Number"
            error={errors.phoneNumber}
            required
          />

          <FloatingInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            error={errors.password}
            required
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FloatingInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm Password"
            error={errors.confirmPassword}
            required
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <button
            className={styles.signUpButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className={styles.loginText}>
            Already have an account?{' '}
            <button
              className={styles.loginLink}
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 