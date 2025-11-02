# ----------------------------
# Etapa 1: Build
# ----------------------------
FROM node:20-alpine AS build

ARG BUILD_ENV=production
ENV NODE_ENV=$BUILD_ENV

WORKDIR /api

COPY package*.json ./
RUN npm install

COPY . .

RUN apk add --no-cache python3 make g++

RUN echo "Ambiente de build: $BUILD_ENV"

RUN npm run build

# ----------------------------
# Etapa 2: Servidor
# ----------------------------
FROM node:20 AS production

RUN mkdir -p /usr/api/eucatur-pricing-api
WORKDIR /usr/api/eucatur-pricing-api

RUN apt-get update && apt-get install -y \
    python3-venv \
    python3-pip netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /venv

COPY requirements.txt .

RUN /venv/bin/pip install --no-cache-dir -r requirements.txt

ENV PATH="/venv/bin:$PATH"

COPY pricing/ /usr/api/eucatur-pricing-api/pricing

COPY package*.json ./
COPY tsconfig.json ./

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

RUN npm install

COPY --from=build /api/dist /usr/api/eucatur-pricing-api/dist

EXPOSE 4001

CMD sh -c "./wait-for-it.sh data_eucatur 5432 -- npm run migration:run-js && npm run start"