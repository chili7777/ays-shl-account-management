# Deploy Quickstart (DigitalOcean Droplet)

This project is deployed as a Dockerized Angular SPA served by Nginx.

## 1) Local verification

```bash
npm ci
npm run build
```

## 2) Build and test container locally

```bash
docker build -f deploy/Dockerfile -t ays-shl-account-management:staging .
docker run --rm -p 8080:80 ays-shl-account-management:staging
```

Open: `http://localhost:8080`

## 3) Push image to registry (example: GHCR)

```bash
docker login ghcr.io
docker tag ays-shl-account-management:staging ghcr.io/<ORG_OR_USER>/ays-shl-account-management:staging-latest
docker push ghcr.io/<ORG_OR_USER>/ays-shl-account-management:staging-latest
```

## 4) Deploy on DigitalOcean Droplet

SSH into your Droplet and run:

```bash
docker login ghcr.io -u <GITHUB_USER>
docker pull ghcr.io/<ORG_OR_USER>/ays-shl-account-management:staging-latest

docker stop ays-shl-account-management 2>/dev/null || true
docker rm ays-shl-account-management 2>/dev/null || true

docker run -d \
  --name ays-shl-account-management \
  --restart unless-stopped \
  -p 80:80 \
  ghcr.io/<ORG_OR_USER>/ays-shl-account-management:staging-latest
```

## 5) Validate deployment

```bash
docker ps
docker logs --tail=100 ays-shl-account-management
curl -I http://localhost
```

If your Droplet firewall is enabled, allow HTTP/HTTPS ports (80/443).

## Optional: run with compose on the Droplet

```bash
cd deploy
docker compose -f docker-compose.staging.yml up -d --build
```
