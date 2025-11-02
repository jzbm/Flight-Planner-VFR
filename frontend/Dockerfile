FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY tsconfig.json next.config.mjs ./
COPY next-env.d.ts ./

RUN npm install

COPY app ./app

RUN npm run build || echo "Build skipped: add Next.js pages"

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
