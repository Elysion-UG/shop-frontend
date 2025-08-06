# === STAGE 1: Build mit Node ===
FROM node:22-alpine AS builder

# Setze Arbeitsverzeichnis
WORKDIR /app

# Installiere Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere restlichen Code
COPY . .

# Baue das Projekt
RUN npm run build

# === STAGE 2: Serve mit Nginx ===
FROM nginx:alpine

# Eigene Nginx-Konfiguration einfügen (für React-Routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiere gebaute Dateien in den Nginx-Ordner
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponiere Port
EXPOSE 80

# Starte Nginx im Vordergrund
CMD ["nginx", "-g", "daemon off;"]