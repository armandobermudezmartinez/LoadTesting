export const testOptionsConfig = {
  load: {
    vus: __ENV.VUS_LOAD || 20, // Default to 20 VUs if not set
    duration: __ENV.DURATION_LOAD || "30s", // Default to 30s if not set
  },
  soak: {
    vus: __ENV.VUS_SOAK || 20,
    duration: __ENV.DURATION_SOAK || "12h",
  },
  spike: {
    stages: [
      {
        duration: __ENV.RAMP_UP_DURATION || "1m",
        target: __ENV.RAMP_UP_VUS || 10,
      },
      {
        duration: __ENV.SPIKE_DURATION || "30s",
        target: __ENV.SPIKE_VUS || 100,
      },
      {
        duration: __ENV.RAMP_DOWN_DURATION || "1m",
        target: __ENV.RAMP_DOWN_VUS || 10,
      },
    ],
  },
  stress: {
    vus: __ENV.VUS_STRESS || 20,
    duration: __ENV.DURATION_STRESS || "600s",
  },
  default: {
    vus: __ENV.VUS_DEFAULT || 1,
    iterations: __ENV.ITERATIONS_DEFAULT || 1,
  },
};

// Function to get test options based on the test type
export function getTestOptions(testType = "default") {
  // Return the corresponding options, defaulting to "default" if invalid type
  return testOptionsConfig[testType] || testOptionsConfig["default"];
}
