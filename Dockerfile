FROM node:12-alpine

WORKDIR /app
RUN apk update ; apk add git 

# COPY package*.json /app
# RUN npm install

CMD [ "npm","run","build" ]