#!/bin/sh

# Recreate config file
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

# Start nginx
nginx -g "daemon off;"