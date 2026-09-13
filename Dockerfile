FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY react-app/package.json react-app/package-lock.json ./react-app/
RUN cd react-app && npm ci

COPY . .

RUN npm --prefix react-app run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
