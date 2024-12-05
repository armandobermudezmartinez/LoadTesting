import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 10 }, // Ramp-up to 10 VUs in 1 minute
    { duration: "30s", target: 100 }, // Sudden spike to 100 VUs
    { duration: "1m", target: 10 }, // Return to normal load
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
  const apiUrl = "https://public-data-staging.desy.de/api/v3/origdatablocks"; // API endpoint

  const apiPayload = JSON.stringify({
    ownerGroup: "ingestor",
    size: 0,
    chkAlg: "string",
    dataFileList: [
      {
        path: "string",
        size: 0,
        time: "2024-10-17T11:16:52.470Z",
        chk: "string",
        uid: "string",
        gid: "string",
        perm: "string",
      },
    ],
    datasetId: "public-data/7d886695-d07a-408b-8436-885d8960ac18",
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
}
