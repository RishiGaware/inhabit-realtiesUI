import React, { useState } from "react";
import styles from "./AddRole.module.css";

import { useNavigate } from "react-router-dom";
import { createRole } from "../../../../services/systemAdmin/RoleMasterService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRole = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      roleName: formData.roleName,
      description: formData.description,
      createdBy: "11", // Replace dynamically
      plantID: 0,
      electronicSignature: "string", // Replace dynamically
      signatureDate: new Date().toISOString(),
    };
    setLoading(true);
    try {
      const response = await createRole(payload); // <-- use service
      console.log("Success:", response);
      if (response.header?.errorCount === 0) {
        const infoMsg = response.header?.messages?.find(msg => msg.messageLevel === 'Information')?.messageText;
        toast.success(infoMsg || "Role added successfully");
        setTimeout(() => {
          navigate("/system-admin/role-master");
        }, 3000);
      } else {
        toast.error(response.header?.message || "Failed to add role");
        console.error("Failed:", response.header?.message || "Unknown error");
      }
    } catch (error) {
      toast.error("Error occurred while adding role");
      console.error("Error creating role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
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
      <div className={styles.container}>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.sectionHeading}>Add Role</h3>
          {loading && <div className={styles.spinner}></div>}
          <div className={styles.row}>
            <label htmlFor="roleName">Role Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="description">Description <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
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

export default AddRole;
