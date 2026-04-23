# ---- Builder ----
FROM node:20-bookworm-slim AS builder

# libvips is bundled with sharp's prebuilt binaries on linux/amd64 + arm64,
# but we install build tools just in case a rebuild is needed.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner ----
FROM node:20-bookworm-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/server ./server
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/next.config.js ./next.config.js

RUN mkdir -p /app/temp && chown -R node:node /app
USER node

EXPOSE 8080
CMD ["node", "server.js"]
