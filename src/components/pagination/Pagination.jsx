// Pagination.jsx
import React from 'react';
import styles from './Pagination.module.css'; // we'll reuse your existing styles

const Pagination = ({ currentPage, totalPages, paginate }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      {currentPage > 1 && (
        <button
          className={styles.paginationBtn}
          onClick={() => paginate(currentPage - 1)}
        >
          Prev
        </button>
      )}

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`${styles.paginationBtn} ${currentPage === index + 1 ? styles.active : ''}`}
          onClick={() => paginate(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className={styles.paginationBtn}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;