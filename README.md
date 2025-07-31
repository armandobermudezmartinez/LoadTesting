# Load Testing Framework with k6, InfluxDB & Grafana

This project provides a containerized load testing environment using the custom image [load-testing-k6-image](https://gitlab.desy.de/ric/opendata/load-testing-k6-image.git) based on [k6](https://k6.io/). It leverages [InfluxDB](https://www.influxdata.com/) and [Grafana](https://grafana.com/) for storing and visualizing performance metrics in real time.

## Services

- **k6**: Executes load testing scripts and pushes metrics to InfluxDB.
- **InfluxDB**: Stores k6 test results.
- **Grafana**: Visualizes metrics using pre-configured dashboards.

## Folder Structure

```
.
├── config/                  # k6 configuration files
├── dashboards/             # Grafana dashboards (JSON)
├── provisioning/           # Grafana provisioning (datasources & dashboards)
├── .env                    # Environment variables (credentials for SciCat)
├── docker-compose.yml      # Docker Compose configuration
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://gitlab.desy.de/ric/opendata/load-testing.git
   cd load-testing
   ```

2. **Configure environment variables**

   Create a `.env` file in the root directory to define the target service to test and your API credentials:

   ```bash
   cp .env.example .env
   ```

   Example `.env` configuration:

   ```env
   TARGET_URL=https://public-data-dev.desy.de/api/v3
   USER=my_user
   PASSWORD=my_password
   ```

3. **Run the stack**

   ```bash
   docker compose up -d
   ```

   This starts all three containers: `influxdb`, `grafana`, and `k6`. The k6 container automatically runs the `run-test.sh` script.

4. **Access the Grafana dashboard**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

   - Username: `admin`
   - Password: `admin`

   You should see the pre-configured dashboard displaying your test metrics.

## Test Configuration

Test behavior can be customized through environment variables defined in the `config` file. Available parameters include:

### Functional Options

- `TEST_TYPE`: Test strategy (`load`, `stress`, `spike`, `soak`, or `default`)
- `MAX_DATASETS`: Maximum number of datasets to generate
- `MAX_ORIGDATABLOCKS`: Maximum number of origDatablocks per dataset
- `USE_RANDOM_DATASET_NUMBER`: Set to `1` to randomize the number of datasets (between 1 and `MAX_DATASETS`)
- `USE_RANDOM_ORIGDATABLOCK_NUMBER`: Set to `1` to randomize the number of origDatablocks (between 1 and `MAX_ORIGDATABLOCKS`)

### Load Profile Options

Each test type uses specific load stages defined by environment variables. You can override these defaults via `config`. Example for `stress`:

```javascript
export const testOptionsConfig = {
  stress: {
    stages: [
      {
        duration: __ENV.RAMP_UP_DURATION_1 || "1m",
        target: __ENV.RAMP_UP_VUS_1 || 20,
      },
      {
        duration: __ENV.STABLE_DURATION_1 || "5m",
        target: __ENV.STABLE_VUS_1 || 20,
      },
      {
        duration: __ENV.RAMP_UP_DURATION_2 || "1m",
        target: __ENV.RAMP_UP_VUS_2 || 40,
      },
      {
        duration: __ENV.STABLE_DURATION_2 || "5m",
        target: __ENV.STABLE_VUS_2 || 40,
      },
      {
        duration: __ENV.RAMP_UP_DURATION_3 || "1m",
        target: __ENV.RAMP_UP_VUS_3 || 80,
      },
      {
        duration: __ENV.STABLE_DURATION_3 || "5m",
        target: __ENV.STABLE_VUS_3 || 80,
      },
      {
        duration: __ENV.RAMP_DOWN_DURATION || "5m",
        target: __ENV.RAMP_DOWN_VUS || 0,
      },
    ],
  },
  // Other types: load, spike, soak, default...
};
```

Each stage defines a duration and the number of virtual users (VUs). You can adjust these to simulate different types of performance loads.

## Cleanup

To stop and remove all containers:

```bash
docker compose down
```

---

## Feedback

Please open an issue or submit a merge request if you find any bugs or want to improve the framework.
