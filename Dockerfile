FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
WORKDIR /app/dist
RUN rm -rf /app/src

CMD [ "npm", "start" ]
