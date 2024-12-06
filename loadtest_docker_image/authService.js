// authService.js
import http from "k6/http";
import { check } from "k6";

export class AuthService {
  constructor(baseURL, username, password) {
    this.baseURL = baseURL;
    this.username = username;
    this.password = password;
    this.token = null;
  }

  login() {
    const url = `${this.baseURL}/auth/login`;
    const payload = JSON.stringify({
      username: this.username,
      password: this.password,
    });
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    const response = http.post(url, payload, { headers });
    check(response, {
      "Token request is successful": (r) => r.status === 200,
      "Token is present": (r) => r.json("access_token") !== undefined,
    });

    this.token = response.json("access_token");
    return this.token;
  }
}
