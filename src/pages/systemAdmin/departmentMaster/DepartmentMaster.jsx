import React, { useState, useEffect, useContext } from "react";
import styles from "./DepartmentMaster.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaEdit } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import Modal from "../../../components/common/Modal";
import { useNavigate } from "react-router-dom";
import { DepartmentContext } from "../../../context/DepartmentContext";
import {
  fetchAllDepartments,
  deleteDepartment,
} from "../../../services/systemAdmin/DepartmentMasterService";
import Pagination from "../../../components/pagination/Pagination";

const DepartmentMaster = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageData, setPageData] = useState({});
  const itemsPerPage = 10;
  const { setDepartmentDetails } = useContext(DepartmentContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchMode, setSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      if (pageData[currentPage] && !searchTerm) {
        setDepartments(pageData[currentPage]);
        setIsLoading(false); // IMPORTANT: Make sure loading is false if cached
        return;
      }

      if (!searchTerm) {
        try {
          setIsLoading(true);
          const data = await fetchAllDepartments(currentPage, itemsPerPage);
          console.log("Departments Data:", data);

          if (
            data.header?.errorCount === 0 &&
            Array.isArray(data.departments)
          ) {
            setPageData((prev) => ({
              ...prev,
              [currentPage]: data.departments,
            }));
            setDepartments(data.departments);
            setTotalRecords(data.totalRecord);

            //  Show the success toast from API message
            if (data.header.messages?.[0]?.messageText) {
              // toast.success(data.header.messages[0].messageText);
            }
          } else {
            console.error("Failed to load departments:", data.header?.message);
            toast.error(data.header?.messages?.[0]?.messageText);
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
          toast.error("An error occurred while fetching departments");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDepartments();
  }, [currentPage, searchTerm, refreshKey]); // Add refreshKey to dependencies

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchMode(false);
      setFilteredDepartments([]);
      // Don't reset current page here
      return;
    }

    // Perform search locally
    const allDepartments = Object.values(pageData).flat();
    const filtered = allDepartments.filter((item) =>
      item.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(filtered);
    setSearchMode(true);
    setCurrentPage(1); // Reset to page 1 only when a search term exists
  }, [searchTerm, pageData]);

  const totalPages = searchMode
    ? Math.ceil(filteredDepartments.length / itemsPerPage)
    : Math.ceil(totalRecords / itemsPerPage);

  const getCurrentItems = () => {
    if (searchMode) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredDepartments.slice(startIndex, endIndex);
    } else {
      const currentDepartments = pageData[currentPage] || [];
      return currentDepartments;
    }
  };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
  };

  const handleEditDepartment = (department) => {
    setDepartmentDetails(department.departmentID, department.departmentName);
    navigateTo("/system-admin/department-master/edit-department", {
      departmentData: department,
    });
  };

  const handleDeleteDepartment = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteDepartment(selectedDepartment.departmentID);
      if (res.header?.errorCount === 0) {
        toast.success(
          res.header?.messages?.[0]?.messageText || "Deleted successfully"
        );

        setPageData({});
        setCurrentPage(1); // Reset to first page
        setRefreshKey((prev) => prev + 1); // Trigger re-fetch
      } else {
        toast.error(res.header?.messages?.[0]?.messageText || "Delete failed");
      }
    } catch (error) {
      toast.error("Error while deleting department");
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setSelectedDepartment(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="colored"
      />

      <div className={styles.container}>
        <div className={styles.departmentMaster}>
          <div className={styles.panelHeader}>
            <h2>Department Master</h2>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {/* <button className={styles.filterBtn}>Filter</button> */}
              <button
                className={styles.addUserBtn}
                onClick={() =>
                  navigateTo("/system-admin/department-master/add-department")
                }
              >
                + Add
              </button>
            </div>
          </div>

          <div className={styles.departmentTableContainer}>
            <table className={styles.departmentTable}>
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (!pageData[currentPage] || searchMode) ? (
                  <tr>
                    <td
                      colSpan="2"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      <div className={styles.loader}></div>
                    </td>
                  </tr>
                ) : getCurrentItems().length > 0 ? (
                  getCurrentItems().map((item, index) => (
                    <tr key={index}>
                      <td>{item.departmentName}</td>
                      <td className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditDepartment(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleDeleteDepartment(item)}
                        >
                          <FcCancel />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No Records found.
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
      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete department "${selectedDepartment?.departmentName}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default DepartmentMaster;
