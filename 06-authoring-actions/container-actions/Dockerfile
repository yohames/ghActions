FROM node:alpine

WORKDIR /github/workspace

RUN npm install pnpm --global

ENTRYPOINT ["sh", "-c", "pnpm install --frozen-lockfile --force && pnpm run test"]