# Stage 1: Build stage
FROM node:alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm install --frozen-lockfile

# Copy the entire project and build
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM node:alpine
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install only production dependencies
RUN npm install --omit=dev --frozen-lockfile

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
