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
  disabled = false,
  showPasswordToggle = false,
  onPasswordToggle,
  showPassword,
  placeholder = ' ',
  className = '',
  onKeyDown,
  autoFocus = false
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>
      {showPasswordToggle && (
        <span className={styles.eyeIcon} onClick={onPasswordToggle}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      {error && <span className={styles.errorText}>⚠ {error}</span>}
    </div>
  );
};

export default FloatingInput; 