#!/bin/sh
set -eu

cat > /usr/share/nginx/html/app-config.js <<EOF
window.__APP_CONFIG__ = {
  AYS_MFA_ACCOUNT_URL: "${AYS_MFA_ACCOUNT_URL:-}"
};
EOF
