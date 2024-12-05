import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "2m", target: 50 }, // Ramp-up to 50 VUs in 2 minutes
    { duration: "5m", target: 50 }, // Hold steady for 5 minutes
    { duration: "2m", target: 0 }, // Ramp-down to 0 VUs
  ],
};

export default function () {
  // Step 1: Fetch the token
  const tokenUrl = "https://public-data-staging.desy.de/api/v3/auth/login"; // token endpoint
  const tokenPayload = JSON.stringify({
    username: "ingestor", // credentials
    password: "fCwe5gF8x^nGZBX",
  });
  const tokenHeaders = {
    "Content-Type": "application/json",
    accept: "application/json",
  };

  let tokenResponse = http.post(tokenUrl, tokenPayload, {
    headers: tokenHeaders,
  });

  // Validate token response
  check(tokenResponse, {
    "Token request is successful": (r) => r.status === 200,
    "Token is present": (r) => r.json("token") !== undefined,
  });

  const token = tokenResponse.json("access_token"); // Extract the token

  // Step 2: Use the token in the next API call
  const apiUrl = "https://public-data-staging.desy.de/api/v3/datasets"; // API endpoint

  const apiPayload = JSON.stringify({
    ownerGroup: "ingestor",
    owner: "ingestor",
    ownerEmail: "scicat@ingestor.site",
    contactEmail: "scicat@ingestor.site",
    sourceFolder: "/nfs",
    sourceFolderHost: "sourcefolder.host",
    creationTime: "2024-10-17T15:41:24.347Z",
    type: "raw",
    description: "k6 test for Loadtesting",
    datasetName: "first k6 loadtest",
    principalInvestigator: "Armando Bermudez Martinez",
    creationLocation: "Hamburg",
    investigator: "armando@bermudez.martinez",
    inputDatasets: "",
    usedSoftware: "",
  });
  const apiHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
  };

  let apiResponse = http.post(apiUrl, apiPayload, { headers: apiHeaders });

  // Validate API response
  check(apiResponse, {
    "API request is successful": (r) => r.status === 200,
    "Response time is acceptable": (r) => r.timings.duration < 200,
  });

  // Print the response for debugging
  //   console.log("Token response status:", tokenResponse.status);
  //   console.log("Token response status:", tokenResponse.body);

  //   console.log("API Response status:", apiResponse.status);
  //   console.log("API Response status:", apiResponse.body);

  // Optional sleep
  //   sleep(1);
}
