#Me# ==========================================
# STAGE 1: DEPENDENCIES (Builder)
# ==========================================
FROM node:18-alpine AS dependencies

# Metadata
LABEL stage=builder

WORKDIR /build

# Package files kopyala (cache optimization)
COPY package*.json ./

# Production dependencies kur
RUN npm ci --omit=dev && \
    npm cache clean --force

# ==========================================
# STAGE 2: PRODUCTION
# ==========================================
FROM node:18-alpine

# Metadata
LABEL maintainer="devops-team@example.com" \
      version="1.0.0" \
      description="Blog API - Production Image"

# Security: Update system packages
RUN apk update && \
    apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Security: Non-root user oluştur
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser && \
    mkdir -p /app && \
    chown -R appuser:appgroup /app

WORKDIR /app

# Dependencies'leri builder stage'den kopyala
COPY --from=dependencies --chown=appuser:appgroup /build/node_modules ./node_modules

# Application files kopyala
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup src ./src
COPY --chown=appuser:appgroup healthcheck.js ./

# Environment variables (defaults)
ENV NODE_ENV=production \
    PORT=3000

# Security: Non-root user'a geç
USER appuser

# Port expose (documentation)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start application
CMD ["node", "src/server.js"]
