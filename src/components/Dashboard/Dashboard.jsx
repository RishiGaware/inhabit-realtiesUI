import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className={styles.container}>
      {/* Pass the actual function, not the string */}
      <Sidebar activeMainItem={activeItem} setActiveMainItem={setActiveItem} />
      <Navbar />
      <div className={styles.mainSection}>
        <main className={styles.mainContent}>
          <br />
          <h1>Welcome to the {activeItem}!</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;