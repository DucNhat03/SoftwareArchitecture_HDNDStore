FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ curl wget

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x start.sh

EXPOSE 5003 4040

ENV NGROK_AUTHTOKEN=2T8fQw9v3a6MnMzWmTeRP4WQ97q_5TyiMEBqHAcZeiD57k6Dv

CMD ["sh", "./start.sh"]
