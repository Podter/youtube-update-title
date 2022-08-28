FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
WORKDIR /app/dist

CMD [ "npm", "start" ]
