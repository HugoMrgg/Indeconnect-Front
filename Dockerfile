# syntax=docker/dockerfile:1

# ----- Build stage -----
    FROM node:20-alpine AS build

    WORKDIR /app
    
    # Copier les fichiers de dépendances
    COPY package.json package-lock.json ./
    
    RUN npm ci
    
    # Copier tout le code source
    COPY . .
    
    # Build de l'application React
    RUN npm run build
    
    # ----- Production stage -----
    FROM nginx:alpine AS production
    
    # Copier le build React dans nginx
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Configuration nginx pour React Router (SPA)
    RUN echo 'server { \
        listen 80; \
        server_name _; \
        \
        root /usr/share/nginx/html; \
        index index.html; \
        \
        # Support pour React Router \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
        \
        # Cache des assets statiques \
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
            expires 1y; \
            add_header Cache-Control "public, immutable"; \
        } \
        \
        # Désactiver le cache pour index.html \
        location = /index.html { \
            add_header Cache-Control "no-cache, no-store, must-revalidate"; \
        } \
    }' > /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    