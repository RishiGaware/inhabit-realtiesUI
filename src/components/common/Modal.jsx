import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Yes</button>
          <button className={styles.cancelBtn} onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
