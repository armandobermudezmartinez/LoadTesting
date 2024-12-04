#!/bin/bash

# echo "Logging in ..."
source ./sc_token.sh

# Check if a json file was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <.json>"
  return
fi

# Assign the first argument to the DATASET_ID variable
METADATA=$1

url="https://public-data-staging.desy.de/api/v3/datasets"

response=$(cat $METADATA | curl -s -o /dev/null -w "%{http_code}" -X 'POST' "$url" \
  -H 'accept: application/json' -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" -d @-)

response_code=$response
echo $response_code

# Check the response status code
if [ "$response_code" -eq 204 ] || [ "$response_code" -eq 200 ] || [ "$response_code" -eq 201 ]; then
  echo "Dataset created successfully."
else
  echo "Failed to create dataset. HTTP Status Code: $response"
fi



# cat data_to_validate.json | curl -v -X 'POST' "http://backend.localhost/api/v3/datasets" -H 'accept: application/json' -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" -d @-
