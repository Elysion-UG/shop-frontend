# === STAGE 1: Build mit Node ===
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./

# RUN npm ci
RUN npm install

# Build-Arg entgegennehmen und ins ENV setzen (nur für den Build)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

# Baue das Projekt (Vite liest VITE_* aus ENV zur Build-Zeit)
RUN npm run build

# === STAGE 2: Serve mit Nginx ===
FROM nginx:alpine

# SPA-Routing (falls du das brauchst)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]