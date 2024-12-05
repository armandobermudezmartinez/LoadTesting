// mainTest.js
import { AuthService } from "./authService.js";
import { DatasetService } from "./datasetService.js";
import { SharedArray } from "k6/data";
import { sleep } from "k6";
import { PayloadManager } from "./payloadManager.js";

// Load payloads
const payloads = new SharedArray("Payloads", function () {
  return JSON.parse(open("./payloads.json"));
});

// Options for the test
export let options = {
  vus: 1,
  //   duration: "10m",
  iterations: 1,
};

export default function () {
  //   // Step 1: Authenticate
  //   const authService = new AuthService(
  //     "https://public-data-staging.desy.de/api/v3",
  //     "ingestor",
  //     "fCwe5gF8x^nGZBX"
  //   );
  //   const token = authService.login();
  //   // Step 2: Initialize Dataset Service
  //   const datasetService = new DatasetService(
  //     "https://public-data-staging.desy.de/api/v3",
  //     token
  //   );
  //   // Step 3: Use dynamic payload
  //   const payload = payloads[__VU % payloads.length]; // Rotate payloads per VU
  //   // Step 4: Create dataset
  //   datasetService.createDataset(payload);
  //   // Optional sleep to simulate realistic behavior
  //   sleep(1);

  const payloadManager = new PayloadManager();
  const payload = payloadManager.generateRandomPayload();
  console.log("payload: ", payload);
}
