# ---- 1) Bagimliliklari kur ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2) Uygulamayi derle ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build sirasinda gercek bir DATABASE_PATH gerekmiyor, sadece derleme yapiliyor
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- 3) Calisma zamani (production) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Next.js standalone ciktisi
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Veritabani ve yuklenen gorsellerin saklanacagi kalici dizinler
RUN mkdir -p /app/data /app/public/uploads \
  && chown -R nextjs:nodejs /app/data /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
