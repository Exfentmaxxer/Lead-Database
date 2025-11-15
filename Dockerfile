# Lead Database - Production Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/*.js ./backend/

# Install production dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy frontend files
COPY frontend/ /app/frontend/

# Create data directory for SQLite
RUN mkdir -p /app/backend/data

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]
