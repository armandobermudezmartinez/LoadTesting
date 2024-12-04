import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 2, // Number of virtual users
  duration: '30s', // Duration of the test
};

export default function () {
  const url = 'https://your-api-dns.com/endpoint'; // Replace with your API's DNS and endpoint
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload = JSON.stringify({
    key: 'value', // Replace with the required request payload
  });

  let response = http.post(url, payload, params); // Use http.get, http.put, etc., as needed

  // Validate response
  check(response, {
    'is status 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1); // Pause for 1 second between requests
}
