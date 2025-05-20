/**
 * Utility function to get user's IP address and location coordinates
 * @returns {Promise<{ip: string|null, lat: number|null, long: number|null, error: string|null}>}
 */
export async function getIpAndLocation() {
  try {

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;
 
    const permission = await navigator.permissions.query({ name: "geolocation" });
 
    if (permission.state === "denied") {
      return {
        ip,
        lat: null,
        long: null,
        error: "Location permission denied. Please enable it in your browser settings.",
      };
    }
 
    const getCoords = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              long: position.coords.longitude,
              ip,
            });
          },
          (error) => {
            reject({
              ip,
              lat: null,
              long: null,
              error: "Location access failed: " + error.message,
            });
          }
        );
      });
 
    return await getCoords();
  } catch (error) {
    return {
      ip: null,
      lat: null,
      long: null,
      error: error.message || "Unexpected error",
    };
  }
} 