# Environment Variables (DigitalOcean Droplet)

This Angular app is compiled as static files and served by Nginx. For the current setup, no runtime environment variables are required by the container.

## Optional variables you may use on the Droplet

- `TZ` -> server timezone (example: `America/Lima`)
- `DOCKER_IMAGE` -> image tag to deploy (example: `ghcr.io/<org>/ays-shl-account-management:staging-latest`)
- `CONTAINER_NAME` -> running container name (example: `ays-shl-account-management`)

## If you need API URLs per environment

Use Angular build configurations (build-time) or implement runtime config injection (`env.js`) in a next step.
