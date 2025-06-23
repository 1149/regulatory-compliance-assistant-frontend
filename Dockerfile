# Stage 1: Build the React application
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine as production-stage

# Copy the built React app from the build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 for Nginx (default HTTP port inside container)
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]