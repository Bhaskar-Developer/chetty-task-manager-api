# Use an official Node.js 14 runtime as a parent image
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the current directory in the host to /app in the container. Remember that /app is the WORKDIR i.e. Working Directory.
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

# Docker build command:
# docker build -t task-manager-api .

# Docker run command:
# docker run -dp 127.0.0.1:3000:3000 -v "$(pwd):/app" task-manager-api 
# Note: The -v "$(pwd):/app" flag mounts the current directory to /app in the container, allowing for live code updates during development.

# Docker logs command:
# docker logs -f <container_id>
# Note: Use this command to view real-time logs from the running container.