FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]