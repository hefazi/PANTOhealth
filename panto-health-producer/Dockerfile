FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache curl openssl3
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 9002

CMD [ "yarn", "dev" ]
