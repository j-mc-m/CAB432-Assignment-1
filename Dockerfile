FROM alpine:latest
LABEL MAINTAINER "Jack Muir"
COPY assignment-1 /app
RUN apk update && apk add --no-cache nodejs npm
ADD assignment-1 /app
WORKDIR /app
EXPOSE 3000
RUN npm install
RUN npm install aws-sdk
CMD npm start