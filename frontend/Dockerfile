# Node.js base image
FROM node:18-alpine

# working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# npm config to retry and increase timeout
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm config set fetch-retries 5

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev"] 