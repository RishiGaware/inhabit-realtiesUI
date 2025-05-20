import React, { useState, useEffect, useContext } from "react";
import styles from "./RoleMaster.module.css";

import { FaEdit} from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../../context/RoleContext";
import { fetchAllRoles, deleteRole } from "../../../services/systemAdmin/RoleMasterService";
import Pagination from "../../../components/pagination/Pagination";
import Modal from "../../../components/common/Modal";

const RoleMaster = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const { setRoleDetails } = useContext(RoleContext);

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const data = await fetchAllRoles(); 
        console.log("Roles Data:", JSON.stringify(data.roles, null, 2));


        if (data.header?.errorCount === 0 && Array.isArray(data.roles)) {
          setRoles(data.roles);
        } else {
          console.error("Failed to load roles:", data.header?.message);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const filtered = roles.filter((item) =>
    item.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (page) => setCurrentPage(page);

  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
  };

  const handleEditRole = (role) => {
    setRoleDetails(role.roleID, role.roleName, role.description);
    console.log(role.roleID, role.roleName, role.description);
    navigateTo("/system-admin/role-master/edit-role", { roleData: role });
  };
  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setShowModal(true);
  };
  
  const confirmDeleteRole = async () => {
    try {
      await deleteRole(roleToDelete.roleID);
      setRoles(prev => prev.filter(r => r.roleID !== roleToDelete.roleID));
      toast.success(`Role "${roleToDelete.roleName}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting role:", err);
      toast.error("Error deleting role. Please try again.");
    } finally {
      setShowModal(false);
      setRoleToDelete(null);
    }
  };
  
  return (
    <>
      
      <div className={styles.container}>
        <div className={styles.userMaster}>
          <div className={styles.panelHeader}>
            <h2>Role Master</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* <button className={styles.filterBtn}>Filter</button> */}
              <button
                className={styles.addUserBtn}
                onClick={() => navigateTo("/system-admin/role-master/add-role")}
              >
                + Add
              </button>
            </div>
          </div>

          <div className={styles.userTableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className={styles.spinnerCell}>
                      <div className={styles.spinner}></div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.roleName}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEditRole(item)}
                            title="Edit Role"
                          >
                            <FaEdit className={styles.editIcon} />
                          </button>
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => handleDeleteRole(item)}
                            title="Delete Role"
                          >
                            <FcCancel className={styles.deleteIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  paginate={paginate}
/>

        </div>
      </div>
      {showModal && roleToDelete && (
  <Modal
    title="Confirm Delete"
    message={`Are you sure you want to delete "${roleToDelete.roleName}"?`}
    onConfirm={confirmDeleteRole}
    onCancel={() => setShowModal(false)}
  />
)}

    </>
  );
};

export default RoleMaster;
// add toast message for deletion success and error
