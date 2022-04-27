FROM node:16
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5100

CMD [ "npm", "start" ]
