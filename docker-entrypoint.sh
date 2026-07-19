#!/bin/sh
set -e

# Coolify/host tarafindan mount edilen kalici volume'lar container her
# basladiginda root sahipliginde gelebiliyor. nextjs kullanicisinin
# bu klasorlere yazabilmesi icin sahipligi burada duzeltiyoruz.
mkdir -p /app/data /app/public/uploads
chown -R nextjs:nodejs /app/data /app/public/uploads

exec su-exec nextjs:nodejs "$@"
