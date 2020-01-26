FROM node:4.2.0-slim

RUN mkdir /justice
WORKDIR /justice

COPY package*.json ./
RUN npm install

COPY . /justice

EXPOSE 8080

CMD [ "grunt" ]