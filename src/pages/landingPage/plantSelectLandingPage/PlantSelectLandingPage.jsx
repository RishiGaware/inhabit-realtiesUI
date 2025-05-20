import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PlantSelectionLandingPage.module.css";
import logo from "../../../assets/images/logo.png";
import { fetchPlantAssignmentsByUserId } from "../../../services/plantAssignmentService";

const PlantSelectionLandingPage = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      let userId = sessionStorage.getItem('userId');
      if (!userId || userId === 'undefined') {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
          try {
            userId = JSON.parse(userData).userID;
          } catch (e) {
            userId = null;
          }
        }
      }
      if (!userId) {
        setPlants([]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetchPlantAssignmentsByUserId(userId);
        const assignedPlants = response.userPlantAssignments || [];
        setPlants(assignedPlants);
        // If only one plant, store and redirect
        if (assignedPlants.length === 1) {
          localStorage.setItem("selectedPlant", JSON.stringify(assignedPlants[0]));
          navigate("/dashboard", { state: { plant: assignedPlants[0] } });
        }
      } catch (error) {
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [navigate]);

  const handleRedirect = (plant) => {
    localStorage.setItem("selectedPlant", JSON.stringify(plant));
    navigate("/dashboard", { state: { plant } });
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Company Logo" className={styles.landingLogo} />
      </div>

      <div className={styles.selectPlantHeading}>
        <h2 className="selectPlantHeading">Select Plant</h2>
      </div>

      <div className={styles.cardWrapperContainer}>
        <div className={styles.cardWrapper}>
          {loading ? (
            <div>Loading...</div>
          ) : plants.length === 0 ? (
            <div>No plants assigned.</div>
          ) : (
            plants.map((plant) => (
            <div
                key={plant.plantID}
                className={styles.landingCard}
                onClick={() => handleRedirect(plant)}
            >
              <h2 className={styles.cardTitle}>
                  {plant.plantID} - {plant.plantName}
              </h2>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantSelectionLandingPage;