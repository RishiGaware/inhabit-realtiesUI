import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import profile from '../../../assets/images/profile.png';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [plantName, setPlantName] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get plant name from localStorage
    const selectedPlant = localStorage.getItem('selectedPlant');
    if (selectedPlant) {
      try {
        setPlantName(JSON.parse(selectedPlant).plantName || '');
      } catch {
        setPlantName('');
      }
    } else {
      setPlantName('');
    }

    // Get user info from sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
        setUserRole(user.roleName || '');
      } catch {
        setUserName('');
        setUserRole('');
      }
    } else {
      setUserName('');
      setUserRole('');
    }
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChangePassword = () => {
    setDropdownOpen(false);
    navigate('/profile/password-change');
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    sessionStorage.clear();
    localStorage.removeItem('selectedPlant');
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}></div>

      <div className={styles.navRight}>
        <div className={styles.sessionAndInfo}>
          <div className={styles.sessionBlock}>
            <div className={styles.plantName}>{plantName || 'No Plant Selected'}</div>
            <p className={styles.sessionTime}>Session ends in: {formatTime(timeLeft)}</p>
          </div>

          <div className={styles.userInfo}>
            <p className={styles.userName}>{userName || 'User'}</p>
            <p className={styles.userRole}>{userRole || 'Role'}</p>
          </div>
        </div>

        <img
          src={profile}
          alt="User"
          className={styles.navAvatar}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className={styles.dropdown}>
            <p className={styles.dropdownItem} onClick={handleProfile}>Profile</p>
            <p className={styles.dropdownItem} onClick={handleChangePassword}>
              Change Password
            </p>
            <button className={styles.dropdownItem} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;