import axios from "axios";
import Constants from "expo-constants";

// The IP address of your machine running the Express server.
// For Android Emulator, it's typically '10.0.2.2'.
// For an iOS Simulator on the same machine, it's 'localhost'.
// If testing on a physical device, use your machine's local network IP (e.g., '192.168.1.10').
// const { manifest } = Constants;
// const apiUri =
//   typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
//     ? `http://${manifest.debuggerHost.split(`:`).shift()}:5000/api`
//     : "https://your-production-api.com/api"; // Replace with your production URL if you have one

/**
 * A centralized Axios instance for making API calls.
 */
export const api = axios.create({
  baseURL: "http://172.18.4.24:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * A helper function to set the authorization header for the API instance.
 * This should be called after a user logs in.
 * @param {string | null} token The JWT token, or null to remove it.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// module.exports = {
//   baseURL: "http://172.18.4.24:5000",
// };
