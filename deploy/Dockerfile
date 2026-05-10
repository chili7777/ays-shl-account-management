# Multi-stage build: compile Angular app and serve with Nginx
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# SPA-friendly Nginx config
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Angular application output (Angular application builder emits /browser)
COPY --from=build /app/dist/ays-shl-account-management/browser ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
