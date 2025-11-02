# ----------------------------
# Etapa 1: Build
# ----------------------------
FROM node:20-alpine AS build

ARG BUILD_ENV=production
ENV NODE_ENV=$BUILD_ENV

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN echo "Ambiente de build: $BUILD_ENV"
RUN echo "API URL: $VITE_API_URL"

RUN npm run build

# ----------------------------
# Etapa 2: Servidor
# ----------------------------
FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/dist /usr/share/nginx/html/eucatur-pricing-app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]