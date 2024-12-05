// datasetService.js
import http from "k6/http";
import { check } from "k6";

export class DatasetService {
  constructor(authService) {
    this.authService = authService; // AuthService is injected into DatasetService
  }

  createDataset(payload) {
    // Use authService to get the token whenever needed
    const token = this.authService.login(); // Get the token directly from AuthService
    const apiUrl = `${this.authService.baseURL}/datasets`;
    console.log(apiUrl);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = http.post(apiUrl, JSON.stringify(payload), { headers });
    console.log("response: ", response);
    check(response, {
      "Dataset created successfully": (r) => r.status === 200,
      "Response time is acceptable": (r) => r.timings.duration < 500,
    });

    return response;
  }
}
