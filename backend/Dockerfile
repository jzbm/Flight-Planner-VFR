FROM node:20-alpine
WORKDIR /app

# Copy dependency manifests
COPY package.json ./
COPY tsconfig.json nest-cli.json ./
COPY prisma ./prisma

RUN npm install

# Copy (empty for now) source tree
COPY src ./src

# Build stage placeholder (will succeed once src/main.ts exists)
RUN npm run build || echo "Build skipped: add source files to compile"

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
