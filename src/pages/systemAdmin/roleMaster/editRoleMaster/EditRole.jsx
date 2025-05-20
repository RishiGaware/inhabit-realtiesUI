import React, { useState, useEffect, useContext } from "react";
import styles from "./EditRole.module.css";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { RoleContext } from "../../../../context/RoleContext";
import { updateRole } from "../../../../services/systemAdmin/RoleMasterService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRole } = useContext(RoleContext);
  const [reasonForChange, setReasonForChange] = useState("");
  const [formData, setFormData] = useState({
    roleID: selectedRole?.roleID || "",
    roleName: selectedRole?.roleName || "",
    description: selectedRole?.description || "", // Include description
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.roleData) {
      setFormData({
        roleID: location.state.roleData.roleID,
        roleName: location.state.roleData.roleName,
        description: location.state.roleData.description || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonForChange.trim()) {
      toast.error("Please provide a reason for the change.");
      return;
    }
    const userId = localStorage.getItem("userId") || "11"; // fallback user ID
    const payload = {
      roleID: formData.roleID,
      roleName: formData.roleName,
      description: formData.description,
      modifiedBy: userId,
      plantID: 0,
      reasonForChange: reasonForChange,
      electronicSignature: formData.roleName, // or another field if needed
      signatureDate: new Date().toISOString(),
    };

    console.log("Sending request payload:", payload);
    setLoading(true);
    try {
      const response = await updateRole(payload); // <-- Use service call
      console.log("Update Response:", response);

      if (response.header?.errorCount === 0) {
        const infoMsg = response.header?.messages?.find(msg => msg.messageLevel === 'Information')?.messageText;
        toast.success(infoMsg || "Role updated successfully.");
        setTimeout(() => {
          navigate("/system-admin/role-master");
        }, 3000);
      } else {
        toast.error(response.header?.message || "Failed to update role.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("An error occurred while updating the role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
 
      
      <div className={styles.container}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <h3 className={styles.sectionHeading}>Edit Role</h3>
            {loading && <div className={styles.spinner}></div>}
            <div className={styles.row}>
              <label htmlFor="roleName">
                Role Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                placeholder="Enter role name"
                required
              />
            </div>
            <div className={styles.row}>
              <label htmlFor="description">Description <span className={styles.required}>*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description (optional)"
              ></textarea>
            </div>

            <div className={styles.row}>
              <label htmlFor="reasonForChange">
                Reason for Change <span className={styles.required}>*</span>
              </label>
              <textarea
                name="reasonForChange"
                value={reasonForChange}
                onChange={(e) => setReasonForChange(e.target.value)}
                placeholder="Provide reason for the change"
                required
              ></textarea>
            </div>
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

export default EditRole;
