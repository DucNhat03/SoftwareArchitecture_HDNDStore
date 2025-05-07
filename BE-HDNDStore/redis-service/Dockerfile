FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (using default Redis port, adjust if needed)
EXPOSE 6380

# Start the service
CMD ["node", "server.js"] 