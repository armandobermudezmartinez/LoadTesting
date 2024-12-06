# Use the official k6 image as a base
FROM grafana/k6:0.55.0

# Set the working directory in the container
WORKDIR /app

# Copy your project files into the container
COPY . .

# Ensure the shell script has executable permissions
RUN chmod +x /app/run-test.sh

# Set the default command to execute the shell script
CMD ["/app/run-test.sh"]