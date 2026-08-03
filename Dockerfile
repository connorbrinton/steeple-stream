FROM node:22-alpine

RUN apk add --no-cache tar

WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY deploy ./deploy

ENV STEEPLE_HOST=0.0.0.0
ENV STEEPLE_PORT=8080
ENV STEEPLE_DATA_DIR=/app/data

EXPOSE 8080 4455
CMD ["npm", "start"]
