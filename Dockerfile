# Verwende ein offizielles Node-Image als Basis
FROM node:22-alpine

# Installiere Systemabhängigkeiten
RUN apk add --no-cache bash

# Arbeitsverzeichnis setzen
WORKDIR /app

# Kopiere package.json und package-lock.json in das Arbeitsverzeichnis
COPY package*.json ./

# Installiere alle Abhängigkeiten
RUN npm install

# Kopiere alle anderen Dateien
COPY . .

# Baue das Projekt
RUN npm run build

# Verwende Nginx, um das gebaute Projekt bereitzustellen
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]