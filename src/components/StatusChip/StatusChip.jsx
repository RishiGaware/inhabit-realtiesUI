import React from 'react';
import styles from './StatusChip.module.css';

const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return styles.completed;
      case 'Overdue':
        return styles.overdue;
      case 'InProgress':
        return styles.inProgress;
      case 'Assigned':
        return styles.assigned;
      default:
        return styles.default;
    }
  };

  return (
    <span className={`${styles.chip} ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusChip; 