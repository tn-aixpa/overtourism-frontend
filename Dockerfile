ARG CACHE=smartcommunitylab/overtourism-frontend:cache
FROM ${CACHE} AS cache

FROM node:20 AS build

LABEL org.opencontainers.image.source=https://github.com/tn-aixpa/overtourism-frontend

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

ENV PATH=/app/node_modules/.bin/:$PATH
COPY . .
RUN --mount=type=cache,target=/app/node_modules,source=/app/node_modules,from=cache npm install && npm run build

FROM nginxinc/nginx-unprivileged

COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js

ENV API_BASE_URL=https://overtourism.digitalhub-test.smartcommunitylab.it/api/v1

USER root
RUN chmod +x /docker-entrypoint.sh && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*
USER 101

ENTRYPOINT ["/docker-entrypoint.sh"]
