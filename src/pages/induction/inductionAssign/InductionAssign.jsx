import React, { useEffect, useState } from "react";
import styles from "./InductionAssign.module.css";
import { fetchAllInductionAssignments } from "../../../services/induction/InductionAssignService";
import Pagination from "../../../components/pagination/Pagination";

import StatusChip from "../../../components/StatusChip/StatusChip";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const InductionAssign = () => {
  const navigate = useNavigate();
  const [inductionAssignments, setInductionAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAssignments(currentPage);
  }, [currentPage]);

  const loadAssignments = async (page) => {
    setLoading(true);
    try {
      const data = await fetchAllInductionAssignments(page, itemsPerPage);
      console.log("Induction Assignments Data:", data);
      setInductionAssignments(data.inductionAssignments || []);
      const totalRecords = data.totalRecord || 0;
      setTotalPages(Math.ceil(totalRecords / itemsPerPage));
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
  };
  const handleEditInductionAssign = (inductionData) => {
  console.log("Navigating to edit with data:", inductionData); // Debugging
  navigate("/induction/induction-assign/edit-induction-assign", {
    state: { inductionData }, // Pass the selected induction data
  });
};
  

  return (
    <>
      
      <div className={styles.container}>
        <div className={styles.departmentMaster}>
          <div className={styles.panelHeader}>
            <h2>Induction Assign</h2>
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
                  navigateTo("/induction/induction-assign/add-induction-assign")
                }
              >
                Add Induction Assign
              </button>
            </div>
          </div>

          <div className={styles.departmentTableContainer}>
            {loading ? (
              <div className={styles.loader}></div>
            ) : (
              <table className={styles.departmentTable}>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Due Date</th>
                    <th>Induction Status</th>
                    <th>Remarks</th>
                    <th>Assigned By</th>
                    <th>Assigned On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inductionAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No assignments found.
                      </td>
                    </tr>
                  ) : (
                    inductionAssignments.map((item, index) => (
                      <tr key={index}>
                        <td>{`${item.firstName} ${item.lastName}`}</td>
                        <td>{item.dueDate
    ? new Date(item.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A"}</td>
                        <td>
                          <StatusChip status={item.inductionStatus} />
                        </td>
                        <td>{item.remarks}</td>
                        <td>{item.assignedBy}</td>
                        <td>
  {item.assignedDate
    ? new Date(item.assignedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A"}
</td>
                        <td className="styles.actions">
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEditInductionAssign(item)}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default InductionAssign;
