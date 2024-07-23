# Use an official Node.js runtime as a base image with Node.js version 18.17.0
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json to the working directory
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 8082

# Start the application
CMD ["npm", "run", "start"]
