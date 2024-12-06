// mainTest.js
import { AuthService } from "./authService.js";
import { DatasetService } from "./datasetService.js";
import { sleep } from "k6";
import { PayloadManager } from "./payloadManager.js";
import { getTestOptions } from "./testOptions.js";

export let options = getTestOptions("spike");

export default function () {
  // Step 1: Authenticate
  const authService = new AuthService(
    "https://public-data-staging.desy.de/api/v3",
    "ingestor",
    "dummy-pass"
  );

  // Step 2: Initialize Dataset Service
  const datasetService = new DatasetService(authService);

  // Step 3: Instantiate PayloadManager
  const payloadManager = new PayloadManager();
  const payloads = payloadManager.getPayloads(10, true, true);

  // Step 4: Loop through payloads and create datasets
  for (let i = 0; i < payloads.length; i++) {
    const payload = payloads[i]; // Get each payload from the list
    // console.log(`Creating dataset for payload ${i + 1}`);
    // console.log("payload", payload);
    datasetService.createDataset(payload); // Create dataset for each payload
    sleep(1); // Optional: simulate time between requests
  }

  // Optional sleep to simulate realistic behavior
  //   sleep(1);
}
