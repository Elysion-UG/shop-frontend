# Verwende ein Node.js-Image als Basis, um die Anwendung zu bauen
FROM node:16-alpine AS build

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json (oder yarn.lock) ins Arbeitsverzeichnis
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den gesamten Quellcode ins Arbeitsverzeichnis
COPY . .

# Baue das Projekt
RUN npm run build

# Verwende ein Nginx-Image, um das gebaute Projekt auszuliefern
FROM nginx:alpine

# Kopiere das Build-Output von der ersten Stage in das Nginx-Verzeichnis
COPY --from=build /app/dist /usr/share/nginx/html

# Exponiere Port 80
EXPOSE 80

# Starte Nginx im Vordergrund
CMD ["nginx", "-g", "daemon off;"]