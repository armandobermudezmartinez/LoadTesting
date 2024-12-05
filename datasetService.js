// datasetService.js
import http from "k6/http";
import { check } from "k6";

export class DatasetService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  createDataset(payload) {
    const url = `${this.baseURL}/datasets`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };

    const response = http.post(url, JSON.stringify(payload), { headers });
    check(response, {
      "Dataset created successfully": (r) => r.status === 200,
      "Response time is acceptable": (r) => r.timings.duration < 500,
    });

    return response;
  }
}
