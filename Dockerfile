FROM node:19-bullseye-slim

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install

COPY . .

RUN pnpx prisma generate
RUN pnpm run build


FROM node:19-bullseye-slim
WORKDIR /app

COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/build ./build
COPY --from=0 /app/prisma ./prisma
COPY --from=0 /app/package*.json ./

COPY .env /app/.env

EXPOSE 3000
CMD [  "npm", "run", "start:migrate:prod" ]