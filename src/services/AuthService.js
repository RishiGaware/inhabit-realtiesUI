// AuthService.js
class AuthService {
    // Check if user is authenticated by checking token in sessionStorage
    static isAuthenticated() {
      const token = sessionStorage.getItem('authToken');
      return !!token; // Returns true if token exists, false otherwise
    }
  
    // Log the user in by setting the token in sessionStorage and updating isAuthenticated
    static login(token) {
      sessionStorage.setItem('authToken', token);
      return true; // Indicate successful login
    }
  
    // Log the user out by removing the token from sessionStorage and updating isAuthenticated
    static logout() {
      sessionStorage.removeItem('authToken');
      return false; // Indicate successful logout
    }
  
    // Get the token from sessionStorage
    static getToken() {
      return sessionStorage.getItem('authToken');
    }
    
    // Optional: Check if the user is authenticated and update the state accordingly
    static checkAuthentication() {
      const token = sessionStorage.getItem('authToken');
      return token ? true : false;
    }
  }
  
  export default AuthService;