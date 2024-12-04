#!/bin/bash

# Request the token and extract it using jq
TOKEN=$(curl -s -X POST --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  -d '{"username":"ingestor", "password":"fCwe5gF8x^nGZBX"}' \
  'https://public-data-staging.desy.de/api/v3/auth/login' | jq -r '.access_token')

# Print the token for debugging purposes (optional)
echo "Token: $TOKEN"
