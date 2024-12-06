# Use the official k6 image as a base
FROM grafana/k6:0.55.0

# Set the working directory in the container
WORKDIR /app

# Copy your project files into the container
COPY --chmod=0755 . .

# Override the entrypoint to use sh
ENTRYPOINT ["sh", "/app/run-test.sh"]