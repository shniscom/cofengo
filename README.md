# Cofengo

Cofengo cafe & restoranı için Next.js (App Router) ile geliştirilmiş, kendi admin panelinden yönetilebilen web sitesi.

## Özellikler

- Ana sayfa, Menü, Etkinlikler, Galeri, İletişim sayfaları
- Kendi yazdığımız basit admin paneli (`/admin`) — menü, etkinlik, galeri fotoğrafları ve iletişim bilgileri buradan yönetilir
- Veritabanı: SQLite (Node.js'in yerleşik `node:sqlite` modülü ile, harici bağımlılık yok)
- Görsel yükleme: sunucu üzerinde `public/uploads` klasörüne kaydedilir
- WhatsApp hızlı iletişim butonu

## Gereksinimler

- Node.js **22.5 veya üzeri** (`node:sqlite` modülü bu sürümden itibaren mevcut)
- npm

## Yerel Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasını doldurun:

- `DATABASE_PATH` — varsayılan `./data/cofengo.db`, değiştirmenize gerek yok.
- `ADMIN_USERNAME` — admin paneline giriş için kullanıcı adı.
- `ADMIN_PASSWORD_HASH` — aşağıdaki komutla üretin:

  ```bash
  node scripts/hash-password.mjs "sifreniz"
  ```

  Çıktıyı `ADMIN_PASSWORD_HASH` değişkenine yapıştırın.

- `SESSION_SECRET` — en az 16 karakter, rastgele bir metin (örn. `openssl rand -hex 32` ile üretebilirsiniz).

Örnek menü/etkinlik verisiyle başlamak isterseniz:

```bash
npm run seed
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Site: http://localhost:3000
Admin paneli: http://localhost:3000/admin

## Admin Panelinden Neler Yönetilir?

- **Menü** — kategori ve ürün ekleme/düzenleme/silme, fiyat, açıklama, görsel, stok durumu
- **Etkinlikler** — başlık, tarih, açıklama, görsel, yayında/taslak durumu
- **Galeri** — mekan fotoğrafları yükleme/silme
- **Ayarlar** — site adı, ana sayfa başlıkları, hakkımızda metni, adres, telefon, WhatsApp numarası, e-posta, çalışma saatleri, Instagram/Facebook linkleri, Google Maps embed linki

İlk kurulumda mutlaka **Ayarlar** sayfasından gerçek iletişim bilgilerinizi girin (varsayılan değerler örnek/placeholder'dır).

## Coolify + Hostinger VPS Üzerine Deploy

### 1. Kodu GitHub'a gönderin

```bash
git init
git add .
git commit -m "İlk sürüm"
git remote add origin <repo-url>
git push -u origin main
```

### 2. Coolify'da yeni uygulama oluşturun

1. Coolify panelinde **New Resource → Application** seçin.
2. GitHub reponuzu bağlayın.
3. **Build Pack** olarak **Dockerfile** seçin (proje kökündeki `Dockerfile` otomatik algılanır).
4. Port olarak **3000** girin.

### 3. Ortam değişkenlerini tanımlayın

Coolify'da uygulamanın **Environment Variables** sekmesinden ekleyin:

```
DATABASE_PATH=/app/data/cofengo.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<hash-degeriniz>
SESSION_SECRET=<uzun-rastgele-deger>
NODE_ENV=production
```

### 4. Kalıcı depolama (Volume) ekleyin

Konteyner her yeniden başladığında/deploy edildiğinde menü verisi ve yüklenen fotoğrafların silinmemesi için **Storage / Volumes** sekmesinden iki kalıcı volume tanımlayın:

| Volume adı        | Konteyner içi yol       |
| ------------------ | ------------------------ |
| cofengo-data        | `/app/data`              |
| cofengo-uploads      | `/app/public/uploads`    |

Bu adım atlanırsa her deploy'da menü/etkinlik/galeri verileri ve yüklenen görseller sıfırlanır.

### 5. Domain bağlama

Coolify'ın **Domains** sekmesinden `cofengo.com` (veya seçtiğiniz alan adını) ekleyin. Coolify, Let's Encrypt ile otomatik SSL sertifikası sağlar. Alan adınızın DNS **A kaydını** VPS'inizin IP adresine yönlendirmeniz yeterli.

### 6. Otomatik deploy

Coolify'da **Webhook / Auto Deploy** özelliğini açarsanız, `main` branch'ine her push yaptığınızda site otomatik olarak yeniden build edilip yayına alınır.

### 7. İlk yayın sonrası

Deploy tamamlandıktan sonra `https://alanadiniz.com/admin` adresinden giriş yapıp içerikleri (menü, etkinlik, galeri, iletişim ayarları) doldurun.

## Yedekleme

Tüm veriler `data/cofengo.db` (SQLite dosyası) ve `public/uploads/` klasöründe tutulur. Coolify sunucunuzda bu iki yolu düzenli olarak (örn. haftalık cron ile) yedeklemenizi öneririz:

```bash
tar -czf cofengo-yedek-$(date +%F).tar.gz data public/uploads
```

## Proje Yapısı (özet)

```
src/
  app/            → Next.js sayfaları (site + /admin)
  components/     → Header, Footer, admin panel bileşenleri
  lib/            → veritabanı erişimi (data.ts), auth (auth.ts), dosya yükleme (uploads.ts)
scripts/
  hash-password.mjs → admin şifresi için bcrypt hash üretir
  seed.mjs          → örnek menü/etkinlik verisi ekler
```
