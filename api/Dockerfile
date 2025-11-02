FROM node:20

RUN mkdir -p /usr/app/eucatur-pricing-api
WORKDIR /usr/app/eucatur-pricing-api

RUN apt-get update && apt-get install -y \
    python3-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /venv

COPY requirements.txt .

# Instalar as dependências dentro do ambiente virtual
RUN /venv/bin/pip install --no-cache-dir -r requirements.txt

ENV PATH="/venv/bin:$PATH"

COPY pricing/ .

COPY .env .

COPY package.json .
RUN npm install

COPY dist/ .

EXPOSE 4001

CMD [ "npm", "start" ]
