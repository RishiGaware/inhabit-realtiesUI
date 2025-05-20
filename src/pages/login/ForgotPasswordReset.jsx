import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/systemAdmin/ResetPasswordService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ForgotPasswordReset.module.css';

const ForgotPasswordReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({
        loginId: form.loginId,
        email: form.email,
        password: form.password,
        token,
        userId: 0
      });
      const messages = res.header?.messages || [];
      const errorMessages = messages.filter(msg => msg.messageLevel === 'Error' || msg.MessageLevel === 1).map(msg => msg.messageText || msg.MessageText);
      const infoMessages = messages.filter(msg => msg.messageLevel === 'Information' || msg.MessageLevel === 2).map(msg => msg.messageText || msg.MessageText);
      if (res.header?.errorCount === 0 || res.header?.ErrorCount === 0) {
        infoMessages.forEach(msg => toast.success(msg));
      } else {
        errorMessages.forEach(msg => toast.error(msg));
      }
    } catch (err) {
      toast.error('An error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <h2 className={styles.heading}>Reset Your Password</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Login ID</label>
            <input className={styles.input} name="loginId" value={form.loginId} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.label}>Email</label>
            <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.label}>New Password</label>
            <input className={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.label}>Confirm Password</label>
            <input className={styles.input} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordReset; 