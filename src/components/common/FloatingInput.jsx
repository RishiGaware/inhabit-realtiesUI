import React from 'react';
import styles from './FloatingInput.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FloatingInput = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  error,
  required = false,
  placeholder = ' ',
  showPassword,
  onTogglePassword,
  disabled = false,
  className = '',
}) => {
  const isPassword = type === 'password';
  
  return (
    <div className={styles.inputWrapper}>
      <input
        type={isPassword && showPassword ? 'text' : type}
        id={id}
        name={name}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>
      {isPassword && (
        <span className={styles.eyeIcon} onClick={onTogglePassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      {error && <span className={styles.errorText}>⚠ {error}</span>}
    </div>
  );
};

export default FloatingInput; 