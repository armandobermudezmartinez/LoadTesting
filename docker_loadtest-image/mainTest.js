// mainTest.js
import { AuthService } from "./authService.js";
import { DatasetService } from "./datasetService.js";
import { sleep } from "k6";
import { PayloadManager } from "./payloadManager.js";
import { getTestOptions } from "./testOptions.js";

// Access the TEST_TYPE environment variable
const testType = __ENV.TEST_TYPE || "default";

// Setup function: runs once before the test begins
export function setup() {
  console.log("Test Type:", testType);
}

export let options = getTestOptions(testType);

export default function () {
  // Step 1: Authenticate
  const authService = new AuthService(
    __ENV.TARGET_URL,
    __ENV.USER,
    __ENV.PASSWORD
  );

  // Step 2: Initialize Dataset Service
  const datasetService = new DatasetService(authService);

  // Step 3: Instantiate PayloadManager
  const payloadManager = new PayloadManager();

  const maxCount = __ENV.MAX_COUNT || 1;
  const useRandomCount = __ENV.USE_RANDOM_COUNT || false;
  const useRandomPayload = __ENV.USE_RANDOM_PAYLOAD || true;
  const payloads = payloadManager.getPayloads(
    maxCount,
    useRandomCount,
    useRandomPayload
  );

  // Step 4: Loop through payloads and create datasets
  const timeBetweenRequests = 1;
  for (let i = 0; i < payloads.length; i++) {
    const payload = payloads[i]; // Get each payload from the list
    datasetService.createDataset(payload); // Create dataset for each payload
    sleep(timeBetweenRequests); // Optional: simulate time between requests
  }
}
