#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Run the k6 test
k6 run --out influxdb=http://influxdb:8086/k6 mainTest.js
