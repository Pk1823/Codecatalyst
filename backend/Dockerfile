FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/

RUN npm ci
RUN node scripts/prepare-prisma.js && npx prisma generate

COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 5000

CMD ["node", "dist/server.js"]
