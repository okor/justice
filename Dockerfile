FROM node:13.7.0-stretch-slim

RUN mkdir /justice
WORKDIR /justice

COPY package*.json ./
RUN npm install

COPY . /justice

EXPOSE 8080

CMD [ "bash" ]