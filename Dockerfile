FROM node:16-slim

RUN mkdir /project
WORKDIR /project

RUN npm install -g @angular/cli@13

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]

# # Use an official Node.js runtime as a parent image
# FROM node:16-slim

# # Set the working directory to /app
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install any needed packages specified in package.json
# RUN npm install

# # Copy the rest of the application code to the working directory
# COPY . .

# # Build the Angular app
# RUN npm run build

# # Expose port 80
# EXPOSE 80

# # Serve the app using a web server
# CMD ["ng", "serve"]
