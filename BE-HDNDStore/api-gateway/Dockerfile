FROM node:18-alpine

WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the port that the app runs on
EXPOSE 5004

# Start the application
CMD ["node", "server.js"] 