FROM node:20.15.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY vite.config.js ./
COPY index.html ./
COPY src ./src
COPY .env ./
COPY .env.production ./
COPY public ./public

RUN npm run build

FROM nginx:alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]