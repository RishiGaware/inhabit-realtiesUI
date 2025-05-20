import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import styles from "./InductionSign.module.css";
import "react-toastify/dist/ReactToastify.css";
import {
  getJobResponsibilityByUserId,
  signOffInductionAssignment,
} from "../../../services/induction/InductionSignService";

const InductionSign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobResponsibilities, setJobResponsibilities] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isSignedOff, setIsSignedOff] = useState(false);

  const [formData, setFormData] = useState({
    userID: "",
    induction_ID: "",
    jobResponsibilityID: "",
    plantID: "",
    createdBy: "",
    remarks: "",
    electronicSignature: "",
    signatureDate: new Date().toISOString().split("T")[0],
    confirmation: false,
  });

  const [inductionData, setInductionData] = useState({
    employeeName: "",
    employeeID: "",
    plantName: "",
    department: "",
    assignedJDTitle: "",
    responsibilities: "",
  });

  useEffect(() => {
    const loadJobResponsibility = async () => {
      const userId = sessionStorage.getItem("userId");
      const userData = sessionStorage.getItem("userData");

      if (userId) {
        try {
          setLoading(true);
          setHasError(false);
          const response = await getJobResponsibilityByUserId(userId);

          if (
            response &&
            response.jobResponsibility &&
            !response.header.errorCount
          ) {
            const jobResp = response.jobResponsibility;

            // Validate required fields
            if (
              !jobResp.userID ||
              !jobResp.inductionID ||
              !jobResp.jobResponsibilityID ||
              !jobResp.plantID
            ) {
              setHasError(true);
              toast.error(
                "Missing required job responsibility information. Please contact your administrator."
              );
              return;
            }

            // Check if already signed off
            if (jobResp.isSignedOff) {
              setIsSignedOff(true);
              toast.info("This induction has already been signed off");
            }

            setJobResponsibilities(jobResp);

            const updatedInductionData = {
              assignedJDTitle: jobResp.title || "",
              responsibilities: jobResp.responsibilities || "",
              department: jobResp.departmentName || "",
              plantName: jobResp.plantName?.trim() || "Not Assigned",
              employeeName: `${jobResp.firstName || ""} ${
                jobResp.lastName || ""
              }`.trim(),
              employeeID: jobResp.employeeID || "",
            };

            setInductionData(updatedInductionData);

            setFormData((prevFormData) => ({
              ...prevFormData,
              userID: jobResp.userID,
              induction_ID: jobResp.inductionID,
              jobResponsibilityID: jobResp.jobResponsibilityID,
              plantID: jobResp.plantID,
              createdBy: userId,
              confirmation: jobResp.isSignedOff || prevFormData.confirmation,
              electronicSignature: jobResp.isSignedOff
                ? `${jobResp.firstName} ${jobResp.lastName}`.trim()
                : prevFormData.electronicSignature,
              signatureDate:
                jobResp.signatureDate || prevFormData.signatureDate,
              remarks: jobResp.remarks || prevFormData.remarks,
            }));
          } else {
            setHasError(true);
            const errorMessage =
              response?.header?.messages?.[0]?.messageText ||
              "No job responsibility data found";

            toast.error(errorMessage);
          }
        } catch (error) {
          setHasError(true);
          toast.error("Failed to load job responsibility data");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Please log in to access this page");
        navigate("/login");
      }
    };

    loadJobResponsibility();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      signatureDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmation) {
      toast.error("Please confirm that you have completed your induction");
      return;
    }

    if (!formData.electronicSignature) {
      toast.error("Please enter your electronic signature");
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();

    if (formData.electronicSignature.trim() !== fullName) {
      toast.error("Electronic signature must match your full name");
      return;
    }

    // Validate required fields
    if (
      !formData.userID ||
      !formData.induction_ID ||
      !formData.jobResponsibilityID ||
      !formData.plantID
    ) {
      toast.error(
        "Missing required information. Please refresh the page and try again."
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userID: formData.userID,
        induction_ID: formData.induction_ID,
        jobResponsibilityID: formData.jobResponsibilityID,
        plantID: formData.plantID,
        createdBy: formData.createdBy,
        remarks: formData.remarks || "",
        electronicSignature: formData.electronicSignature,
        signatureDate: formData.signatureDate,
      };

      const response = await signOffInductionAssignment(payload);

      if (response.header?.errorCount === 0) {
        toast.success("Your induction has been successfully signed off");
        // Navigate back to assignments page after successful sign-off
        setTimeout(() => {
          navigate("/induction/induction-assign");
        }, 2000);
      } else {
        const errorMessage =
          response.header?.messages?.[0]?.messageText ||
          "Failed to sign off induction";

        // Show a more detailed error message
        if (errorMessage.includes("failed to signed off")) {
          toast.error(
            <div>
              <p>Your induction sign-off failed.</p>
              <p>Please ensure:</p>
              <ul>
                <li>You have completed all required training</li>
                <li>Your induction is not already signed off</li>
                <li>You have the correct permissions</li>
              </ul>
              <p>If the issue persists, please contact your administrator.</p>
            </div>
          );
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.header?.messages?.[0]?.messageText ||
        "An unexpected error occurred";

      if (errorMessage.includes("failed to signed off")) {
        toast.error(
          <div>
            <p>Your induction sign-off failed.</p>
            <p>Please ensure:</p>
            <ul>
              <li>You have completed all required training</li>
              <li>Your induction is not already signed off</li>
              <li>You have the correct permissions</li>
            </ul>
            <p>If the issue persists, please contact your administrator.</p>
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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
      />
      <div className={styles.container}>
        {hasError ? (
          <div className={styles.errorContainer}>
            <h3>Unable to Load Job Responsibility</h3>
            <p>
              Please ensure you have a valid job responsibility assigned before
              signing off your induction.
            </p>
            <button
              className={styles.backButton}
              onClick={() => navigate("/induction/induction-assign")}
            >
              Return to Induction Assignments
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {loading && (
              <div className="progress mb-3" style={{ height: "3px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: "100%" }}
                ></div>
              </div>
            )}

            <h3 className={styles.sectionHeading}>
              {isSignedOff
                ? "Induction Sign Off Details"
                : "Induction Sign Off"}
            </h3>

            <div className={styles.infoSection}>
              <div className={styles.row}>
                <label>Employee Name</label>
                <input
                  type="text"
                  value={inductionData.employeeName || ""}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <label>Employee ID</label>
                <input
                  type="text"
                  value={inductionData.employeeID || ""}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <label>Plant Name</label>
                <input
                  type="text"
                  value={inductionData.plantName || ""}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <label>Department</label>
                <input
                  type="text"
                  value={inductionData.department || ""}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <label>Assigned JD Title</label>
                <input
                  type="text"
                  value={inductionData.assignedJDTitle || ""}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <label>Responsibilities</label>
                <div className={styles.responsibilitiesBox}>
                  {inductionData.responsibilities || ""}
                </div>
              </div>
            </div>

            {!isSignedOff && (
              <div className={styles.signOffSection}>
                <h4>Sign Off Details</h4>

                <div className={styles.row}>
                  <label>
                    <input
                      type="checkbox"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleChange}
                      disabled={isSignedOff}
                    />
                    I confirm that I have completed my induction and accept the
                    responsibilities assigned to me as part of my Job Description.
                  </label>
                </div>

                <div className={styles.row}>
                  <label>Electronic Signature</label>
                  <input
                    type="text"
                    name="electronicSignature"
                    value={formData.electronicSignature}
                    onChange={handleChange}
                    placeholder="Enter your name as electronic signature"
                    required
                    disabled={isSignedOff}
                  />
                </div>

                <div className={styles.row}>
                  <label>Signature Date</label>
                  <CustomDatePicker
                    value={formData.signatureDate}
                    onChange={handleDateChange}
                    maxDate={new Date().toISOString().split("T")[0]}
                    placeholder="Select signature date"
                    disabled={isSignedOff}
                  />
                </div>

                <div className={styles.row}>
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Enter remarks (optional)"
                    maxLength={500}
                    rows={3}
                    disabled={isSignedOff}
                  />
                </div>
              </div>
            )}

            <div className={styles.submitRow}>
              {!isSignedOff && (
                <button type="submit" disabled={loading}>
                  {loading ? "Signing Off..." : "Sign Off"}
                </button>
              )}
              <button type="button" onClick={() => navigate(-1)}>
                {isSignedOff ? "Back" : "Cancel"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default InductionSign;
