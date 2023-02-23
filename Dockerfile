FROM node:19-bullseye-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpx turbo db:deploy; node apps/web/build"]