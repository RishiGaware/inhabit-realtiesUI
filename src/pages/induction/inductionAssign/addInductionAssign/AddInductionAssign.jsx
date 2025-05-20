import React, { useEffect, useState } from "react";
import styles from "./AddInductionAssign.module.css";

import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import {
  assignInduction,
  fetchUnassignedUsers,
} from "../../../../services/induction/InductionAssignService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AddInductionAssign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userID: "",
    dueDate: "",
    remarks: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUnassignedUsers = async () => {
    try {
        const usersData = await fetchUnassignedUsers();
        if (usersData && Array.isArray(usersData)) {
            setUsers(usersData); 
        } else {
            setUsers([]); 
            toast.error("No unassigned users found.");
        }
    } catch (error) {
        console.error("Error fetching unassigned users:", error);
        toast.error("Error fetching unassigned users.");
    }
};

  useEffect(() => {
    loadUnassignedUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userID: formData.userID,
        dueDate: formData.dueDate || null,
        remarks: formData.remarks || "",
        assignedBy: "Admin", // Replace with dynamic value if needed,
        assignedOn: new Date().toISOString(),
        electronicSignature: "Admin",
        signatureDate: new Date().toISOString(),
      };

      const response = await assignInduction(payload);

      if (response.header?.errorCount === 0) {
        toast.success(
          response.header?.messages?.[0]?.messageText ||
            "Assigned successfully."
        );
        setTimeout(() => navigate("/induction/induction-assign"), 1000);
      } else {
        toast.error(
          response.header?.messages?.[0]?.messageText || "Assignment failed."
        );
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <ToastContainer />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {loading && (
            <div className="progress mb-3" style={{ height: "3px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: "100%" }}
              />
            </div>
          )}

          <h3 className={styles.sectionHeading}>Assign Induction</h3>

          <div className={styles.row}>
            <label>
              Select User <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="userID"
              value={formData.userID}
              onChange={handleChange}
              required
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.userID} value={user.userID}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label>Due Date</label>
            <CustomDatePicker
              value={formData.dueDate}
              onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
              minDate={new Date().toISOString().split('T')[0]}
              placeholder="Select due date"
            />
          </div>

          <div className={styles.row}>
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks (optional)"
              rows={3}
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Submit"}
            </button>
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInductionAssign;
