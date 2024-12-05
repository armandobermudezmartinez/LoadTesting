export const testOptionsConfig = {
  load: {
    vus: 20, // Number of virtual users
    duration: "30s", // Duration of the test
  },
  soak: {
    vus: 20, // Steady number of users
    duration: "12h", // Duration of the test
  },
  spike: {
    stages: [
      { duration: "1m", target: 10 }, // Ramp-up to 10 VUs in 1 minute
      { duration: "30s", target: 100 }, // Sudden spike to 100 VUs
      { duration: "1m", target: 10 }, // Return to normal load
    ],
  },
  stress: {
    vus: 20, // Number of virtual users
    duration: "600s", // Duration of the test
  },
  default: {
    vus: 1, // Default to a single virtual user
    iterations: 1, // One iteration
  },
};

// Function to get test options based on the test type
export function getTestOptions(testType = "default") {
  // Return the corresponding options, defaulting to "default" if invalid type
  return testOptionsConfig[testType] || testOptionsConfig["default"];
}
