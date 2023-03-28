FROM node:19-bullseye-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm@8

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm db:deploy; pnpm prod:start"]
