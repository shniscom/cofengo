# ---- 1) Bagimliliklari kur ----
FROM node:22-alpine AS deps
WORKDIR /app
# Coolify/host NODE_ENV=production build-arg olarak gecse bile devDependencies
# (typescript, tailwind, eslint) kurulmali - build bunlara ihtiyac duyuyor.
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# ---- 2) Uygulamayi derle ----
FROM node:22-alpine AS builder
WORKDIR /app
# ONEMLI: Burada NODE_ENV=development SET ETME. next build kendi icinde
# NODE_ENV'i production yapar; eger biz burada development olarak zorlarsak
# Next.js 16'da bilinen bir bug yuzunden /_global-error sayfasi prerender
# asamasinda "Cannot read properties of null (reading 'useContext')" /
# "Expected workUnitAsyncStorage to have a store" hatasiyla build cokuyor.
# (bkz. vercel/next.js issue #86178 ve #87719). node_modules zaten deps
# asamasindan kopyalandigi icin burada tekrar npm install gerekmiyor,
# dolayisiyla NODE_ENV=development'a hic ihtiyac yok.
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- 3) Calisma zamani (production) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk add --no-cache su-exec \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Next.js standalone ciktisi
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Veritabani ve yuklenen gorsellerin saklanacagi kalici dizinler
RUN mkdir -p /app/data /app/public/uploads \
  && chown -R nextjs:nodejs /app/data /app/public/uploads

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Container root olarak baslar; entrypoint script kalici volume'larin
# sahipligini duzeltip nextjs kullanicisina gecis yapar (bkz. docker-entrypoint.sh)
EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
