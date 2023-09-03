# Use a Node.js image to build the React app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container
COPY . .

# Build the React app
RUN npm run build

# Now, use an Nginx image to serve the built React app
FROM nginx:alpine

# Copy the built app to the Nginx web directory
COPY --from=build /app/build /usr/share/nginx/html

# Optionally, use custom nginx configurations
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the app
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
