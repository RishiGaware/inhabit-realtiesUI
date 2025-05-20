import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import styles from "./EditInductionAssign.module.css";
import {
  getInductionAssignmentById,
  updateInductionAssignment,
} from "../../../../services/induction/InductionAssignService";

const EditInductionAssign = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    inductionID: "",
    userID: "",
    userName: "",
    dueDate: "",
    remarks: "",
    inductionStatus: "",
    reasonForChange: "",
  });

  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadInductionData = async () => {
      const inductionID = location.state?.inductionData?.inductionID;

      if (inductionID) {
        try {
          const result = await getInductionAssignmentById(inductionID);
          if (result) {
            setFormData({
              inductionID: result.inductionID,
              userID: result.userID,
              userName: `${result.firstName} ${result.lastName}`,
              dueDate: result.dueDate ? result.dueDate.split("T")[0] : "",
              remarks: result.remarks || "",
              inductionStatus: result.inductionStatus || "",
              reasonForChange: "",
            });
          } else {
            toast.error("Failed to load induction assignment details.");
          }
        } catch (error) {
          console.error("Error loading induction assignment:", error);
          toast.error("An error occurred while loading the data.");
        }
      } else {
        toast.error("Invalid induction assignment ID.");
        navigate(-1); 
      }
    };

    loadInductionData();
  }, [location.state, navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reasonForChange.trim()) {
      toast.error("Reason for change is mandatory.");
      return;
    }

    setLoading(true);

    const payload = {
      inductionID: parseInt(formData.inductionID),
      userID: parseInt(formData.userID),
      modifiedBy: "2", // Using the current user ID
      remarks: formData.remarks,
      inductionStatus: formData.inductionStatus,
      reasonForChange: formData.reasonForChange,
      electronicSignature: "2", // Using the current user ID as signature
      signatureDate: new Date().toISOString(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    try {
      const response = await updateInductionAssignment(payload);

      if (response.header?.errorCount === 0) {
        toast.success(
          response.header?.messages?.[0]?.messageText || "Updated successfully."
        );
        setTimeout(() => navigate("/induction/induction-assign"), 1500);
      } else {
        toast.error(
          response.header?.messages?.[0]?.messageText || "Update failed."
        );
      }
    } catch (error) {
      console.error("Error updating induction assignment:", error);
      toast.error("An unexpected error occurred.");
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
                style={{ width: "100%" }}
              ></div>
            </div>
          )}

          <h3 className={styles.sectionHeading}>Edit Induction Assignment</h3>

          <div className={styles.row}>
            <label>User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              readOnly
            />
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
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Optional remarks"
            />
          </div>

          <div className={styles.row}>
            <label>Induction Status</label>
            <CustomSelect
              value={formData.inductionStatus}
              onChange={(value) => setFormData(prev => ({ ...prev, inductionStatus: value }))}
              options={["Assigned", "InProgress", "Completed", "Overdue"]}
              placeholder="--Select Status--"
            />
          </div>

          <div className={styles.row}>
            <label>
              Reason for Change <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="reasonForChange"
              value={formData.reasonForChange}
              onChange={handleChange}
              placeholder="Reason for Change"
              required
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
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

export default EditInductionAssign;