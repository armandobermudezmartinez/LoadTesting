// mainTest.js
import { AuthService } from "./authService.js";
import { DatasetService } from "./datasetService.js";
import { sleep } from "k6";
import { PayloadManager } from "./payloadManager.js";

// Options for the test
export let options = {
  vus: 1, // Number of Virtual Users
  iterations: 1, // Total number of iterations per VU
};

export default function () {
  // Step 1: Authenticate
  const authService = new AuthService(
    "https://public-data-staging.desy.de/api/v3",
    "ingestor",
    "fCwe5gF8x^nGZBX"
  );

  // Step 2: Initialize Dataset Service
  const datasetService = new DatasetService(authService);

  // Step 3: Instantiate PayloadManager
  const payloadManager = new PayloadManager();
  const payloads = payloadManager.getPayloads(5, true, true);

  // Step 4: Loop through payloads and create datasets
  for (let i = 0; i < payloads.length; i++) {
    const payload = payloads[i]; // Get each payload from the list
    console.log(`Creating dataset for payload ${i + 1}`);
    datasetService.createDataset(payload); // Create dataset for each payload
    sleep(2); // Optional: simulate time between requests
  }

  // Optional sleep to simulate realistic behavior
  //   sleep(1);
}
