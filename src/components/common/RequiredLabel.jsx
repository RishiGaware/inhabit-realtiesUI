import React from 'react';
const RequiredLabel = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor}>
      {children} <span style={{ color: 'red' }}>*</span>
    </label>
  );
  
  export default RequiredLabel;
  