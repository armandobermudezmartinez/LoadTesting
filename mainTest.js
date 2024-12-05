// mainTest.js
import { AuthService } from "./authService.js";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

// Options for the test
export let options = {
  vus: 1,
  iterations: 1,
  //   duration: "10m",
};

export default function () {
  // Step 1: Authenticate
  const authService = new AuthService(
    "https://public-data-staging.desy.de/api/v3",
    "ingestor",
    "fCwe5gF8x^nGZBX"
  );
  const token = authService.login();

  console.log("token:", token);
}
