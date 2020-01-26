FROM node:13.7.0-stretch-slim AS git
RUN apt-get update && apt-get install git -y

FROM node:13.7.0-stretch-slim
COPY --from=git /usr/bin/git /usr/bin/git

RUN mkdir /justice
WORKDIR /justice

COPY package*.json ./
RUN npm install
RUN npm install grunt-cli -g

COPY . /justice

EXPOSE 8080

CMD [ "bash" ]