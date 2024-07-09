FROM node:18.13.0
WORKDIR /server/src
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y redis-tools
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]