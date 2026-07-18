# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

# Set production environment variable
ENV NODE_ENV=production

# Cloud Run sets the PORT environment variable to 8080 by default.
# Ensure the app binds to this port.
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
