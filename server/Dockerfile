FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install pm2 -g

COPY . .

EXPOSE 5000

CMD [ "pm2-runtime", "pm2.json" ]
