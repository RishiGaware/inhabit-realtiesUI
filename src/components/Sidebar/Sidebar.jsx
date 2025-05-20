import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import logo from '../../assets/images/logo.png';
import profile from '../../assets/images/profile.png';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeMainItem, activeSubItem }) => {
  const [openItems, setOpenItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // Automatically open the section with the active item
    if (activeMainItem && !openItems.includes(activeMainItem)) {
      setOpenItems((prev) => [...prev, activeMainItem]);
    }
  }, [activeMainItem]);

  const menuItems = [
    {
      name: "Dashboard",
    },
    {
      name: 'System Admin',
      subItems: [
        'Module Central Configuration',
        'User Master',
        'Department Master',
        'Designation Master',
        'Role Master',
        'Plant Master',
        'User Personal Details',
        'Role Assignment',
        'Plant Assign',
        'Password Configuration',
        'User Status',
        // 'Password Change',
        'Password Reset',
      ],
    },
    {
      name: 'Induction',
      subItems: [
        'Module Central Configuration',
        
        'Induction Assign',
        'Job Responsibility',
        'Induction Sign',
      ],
    },

    {
      name: 'SOP/OJT Management',
      subItems: [
        'Document Registration',
        'Document Review & Approval',
        'Question Preparation',
        'Questioner Approval',
        'OJT Master',
        'OJT Approval',
        'SOP/OJT Decommissioning',
      ],
    },
    {
      name: 'Course Code',
      subItems: ['Department/Role Wise Code Generate', 'SOP Assignment'],
    },
    {
      name: 'Training Session',
      subItems: [
        'Module Central Configuration',
        'Yearly Planning',
        'Schedule Training',
        'Un-schedule Training',
        'On-Job Training',
        'Self-Training',
        'Trainer',
        'Document Reading',
        'Training Attendance',
        'Question Preparation',
        'Evaluation',
        'Retraining',
        'Training Completion',
        'Training Certificate',
      ],
    },
    
  ];

  const handleItemClick = (itemName) => {
    if (openItems.includes(itemName)) {
      setOpenItems(openItems.filter((name) => name !== itemName));
    } else {
      setOpenItems([...openItems, itemName]);
    }
  };

  const handleSubItemClick = (main, sub) => {
    const mainSlug = main.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const subSlug = sub.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const route = `/${mainSlug}/${subSlug}`;
    navigate(route);
  
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <button
        className={styles.hamburger}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={isSidebarOpen}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>
          <div className={styles.menuScroll}>
            <ul className={styles.menuList}>
            {menuItems.map((item) => {
            const isOpen = openItems.includes(item.name);
            const isActive = activeMainItem === item.name;

            return (
              <li key={item.name}>
                <div
                  className={`${styles.menuItem} 
                    ${isOpen ? styles.openMenuItem : ''} 
                    ${isActive ? styles.activeMenuItem : ''}`}
                    onClick={() => {
                      if (item.subItems) {
                        handleItemClick(item.name);
                        // setActiveMainItem(item.name);
                      } else {
                        // setActiveMainItem(item.name);
                        navigate('/dashboard');
                        if (window.innerWidth <= 768) setIsSidebarOpen(false);
                      }
                    }}
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${item.name}`}
                >
                  <span>{item.name}</span>
                  {item.subItems && (
                    <span
                      className={`${styles.arrowIcon} ${isOpen ? styles.rotate : ''}`}
                    >
                      ▶
                    </span>
                  )}
                </div>
                {isOpen && item.subItems && (
                  <ul className={styles.subMenuList} id={`submenu-${item.name}`}>
                    {item.subItems.map((sub, i) => (
                      <li
                        key={i}
                        className={`${styles.subMenuItem} ${
                          activeSubItem === sub ? styles.activeSubMenuItem : ''
                        }`}
                        onClick={() => handleSubItemClick(item.name, sub)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;