FROM node:20.12.2 AS build

LABEL org.opencontainers.image.source=https://github.com/tn-aixpa/overtourism-frontend

WORKDIR /app

# ARG VITE_APP_URL_TOKEN
# ARG VITE_APP_AXIOS_URL
# ARG VITE_APP_HATEDEMICS_API_URL
# ARG VITE_APP_TITLE="Hatedemics"
# ARG VITE_APP_HATEDEMICS_API_GEN_URL
COPY package.json /app
COPY package-lock.json /app
# RUN rm .env*
# RUN npm install --legacy-peer-deps
RUN npm install 
# ENV VITE_APP_URL_TOKEN=${VITE_APP_URL_TOKEN}
# ENV VITE_APP_AXIOS_URL=${VITE_APP_AXIOS_URL}
# ENV VITE_APP_HATEDEMICS_API_URL=${VITE_APP_HATEDEMICS_API_URL}
# ENV VITE_APP_TITLE=${VITE_APP_TITLE}
# ENV VITE_APP_HATEDEMICS_API_GEN_URL=${VITE_APP_HATEDEMICS_API_GEN_URL}
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged

COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
