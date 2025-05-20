import React, { createContext, useState, useEffect } from 'react';
import { fetchAllUserPersonalDetails, updateUserPersonalDetail } from '../services/systemAdmin/UserPersonalDetailsService';

const UserPersonalContext = createContext();

const UserPersonalProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUserPersonalDetails();
      setUsers(data.usersPersonalnfo || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Set selected user for editing
  const setUserForEdit = (user) => {
    setSelectedUser(user);
  };

  // Update user details
  const updateUser = async (userData) => {
    setLoading(true);
    try {
      const result = await updateUserPersonalDetail(userData);
      
      if (result.header?.errorCount === 0) {
        // Update the local state after successful API update
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.userID === userData.userID ? { ...user, ...userData } : user
          )
        );
        setError(null);
        return { success: true };
      } else {
        const errorMsg = result.header?.messages?.[0]?.messageText || 'Failed to update user';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserPersonalContext.Provider value={{ 
      users, 
      loading, 
      error, 
      selectedUser,
      fetchUsers, 
      setUserForEdit,
      updateUser 
    }}>
      {children}
    </UserPersonalContext.Provider>
  );
};

export { UserPersonalProvider, UserPersonalContext };