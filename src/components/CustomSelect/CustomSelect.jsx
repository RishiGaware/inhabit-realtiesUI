import React, { useState, useRef, useEffect } from 'react';
import StatusChip from '../StatusChip/StatusChip';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div 
        className={styles.selectHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <StatusChip status={value} />
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`} />
      </div>
      
      {isOpen && (
        <div className={styles.optionsList}>
          {options.map((option) => (
            <div
              key={option}
              className={`${styles.option} ${value === option ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
            >
              <StatusChip status={option} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 