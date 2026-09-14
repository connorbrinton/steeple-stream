FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
COPY public ./public
COPY tools ./tools
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache tar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/src ./src
COPY --from=build /app/public ./public
COPY deploy ./deploy

ENV STEEPLE_HOST=0.0.0.0
ENV STEEPLE_PORT=8080
ENV STEEPLE_DATA_DIR=/app/data

EXPOSE 8080 4455
CMD ["npm", "start"]
