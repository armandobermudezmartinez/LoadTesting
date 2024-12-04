import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1, // Number of virtual users
  //   duration: "30s", // Duration of the test
  iterations: 1, // Run the test for iteration(s)
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

  const token = tokenResponse.json("token"); // Extract the token

  // Step 2: Use the token in the next API call
  const apiUrl = "https://public-data-staging.desy.de/api/v3/origdatablocks"; // API endpoint

  const apiPayload = JSON.stringify({
    ownerGroup: "ingestor",
    owner: "ingestor",
    ownerEmail: "scicatingestor@your.site",
    contactEmail: "scicatingestor@your.site",
    sourceFolder: "/nfs",
    creationTime: "2024-10-14T14:37:50.857Z",
    type: "derived",
    description: "this is test4",
    datasetName: "test3",
    investigator: "scicatingestor@your.site",
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
  console.log("Token response status:", tokenResponse.status);
  console.log("Token response status:", tokenResponse.body);

  console.log("API Response status:", apiResponse.status);
  console.log("API Response status:", apiResponse.body);

  // Optional sleep
  sleep(1);
}
