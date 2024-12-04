import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1, // Number of virtual users
  //   duration: "30s", // Duration of the test
  iterations: 1, // Run the test for one iteration only
};

export default function () {
  // Step 1: Fetch the token
  const tokenUrl = "https://public-data-staging.desy.de/api/v3/auth/login"; // Replace with the token endpoint
  const tokenPayload = JSON.stringify({
    username: "ingestor", // Replace with required credentials
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
  const apiUrl = "https://your-api.com/endpoint"; // Replace with your API endpoint
  const apiPayload = JSON.stringify({
    key: "value", // Replace with required payload for this API
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
  console.log("Response status:", tokenResponse.status);
  console.log("Response status:", tokenResponse.body);

  // Optional sleep
  sleep(1);
}
