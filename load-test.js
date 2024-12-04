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

  // Print the response for debugging
  console.log("Response status:", tokenResponse.status);
  console.log("Response status:", tokenResponse.body);

  // Optional sleep
  sleep(1);
}
