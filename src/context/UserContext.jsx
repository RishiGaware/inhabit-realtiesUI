// src/context/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Store full user details

  return (
    <UserContext.Provider value={{ userId, setUserId, userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };