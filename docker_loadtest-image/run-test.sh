#!/bin/bash

# Load environment variables from .env file
set -a
source config
set +a

# Run the k6 test
k6 run --out influxdb=http://$INFLUXDB_HOST:8086/k6 mainTest.js
