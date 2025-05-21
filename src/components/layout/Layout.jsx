import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';

const Layout = () => {
  const [activeMainItem, setActiveMainItem] = useState('');
  const [activeSubItem, setActiveSubItem] = useState('');
  const location = useLocation();

  // Function to determine active items based on current path
  const updateActiveItems = () => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);

    if (pathParts.length >= 2) {
      const mainItem = pathParts[0].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setActiveMainItem(mainItem);

      const subItem = pathParts[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setActiveSubItem(subItem);
    } else if (pathParts.length === 1) {
      const mainItem = pathParts[0].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setActiveMainItem(mainItem);
      setActiveSubItem('');
    }
  };

  // Update active items when location changes
  React.useEffect(() => {
    updateActiveItems();
  }, [location]);

  return (
    <>
      <Sidebar activeMainItem={activeMainItem} activeSubItem={activeSubItem} />
      <Navbar />
      
      <Outlet />
    </>
  );
};

export default Layout; 