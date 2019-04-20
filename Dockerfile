FROM node:dubnium-alpine

WORKDIR /usr/src/poodle

COPY package* ./
RUN npm install

COPY . .
RUN node_modules/.bin/sapper build

CMD ["node", "/usr/src/poodle/__sapper__/build"]
