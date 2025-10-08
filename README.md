# Blog Platform - Docker Project

Modern blog platformu. Docker, Docker Compose ve DevOps best practices ile geliştirilmiştir.

---

## Proje Hakkında

Bu proje, Docker ekosistemini öğrenmek ve modern DevOps pratiklerini uygulamak için geliştirilmiş bir blog platformudur.

**Özellikler:**
- Blog yazısı oluşturma, okuma, güncelleme, silme (CRUD)
- MongoDB ile veri kalıcılığı
- Nginx reverse proxy
- Multi-stage Docker build
- Health checks ve volume yönetimi
- Custom bridge network

---

## Teknoloji Stack

| Servis | Teknoloji | Port |
|--------|-----------|------|
| Frontend/Proxy | Nginx | 80 |
| Backend API | Node.js 20 + Express | 3000 (internal) |
| Database | MongoDB 7.0 | 27017 (internal) |

---

## Mimari

```
┌─────────────────────┐
│   NGINX (Port 80)   │  ← Reverse Proxy
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API (Port 3000)    │  ← Backend
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MongoDB (27017)    │  ← Database
│  Volume: mongodb-data
└─────────────────────┘
```

Detaylı mimari için: [docs/architecture.md](docs/architecture.md)

---

## Kurulum

### Gereksinimler

- Docker 24.0+
- Docker Compose 2.0+

### Adımlar

**1. Projeyi klonlayın:**
```bash
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
```

**2. Environment dosyasını oluşturun:**
```bash
cp .env.example .env
```

**3. Container'ları başlatın:**
```bash
docker-compose up -d
```

**4. Test edin:**
```bash
curl http://localhost/api/posts
```

---

## Kullanım

### Temel Komutlar

**Container'ları başlat:**
```bash
docker-compose up -d
```

**Durumu kontrol et:**
```bash
docker-compose ps
```

**Logları izle:**
```bash
docker-compose logs -f
```

**Durdur ve sil:**
```bash
docker-compose down
```

**Volume'lar ile birlikte sil:**
```bash
docker-compose down -v
```

### Debug Komutları

**API container'ına bağlan:**
```bash
docker-compose exec api sh
```

**MongoDB'ye bağlan:**
```bash
docker-compose exec mongodb mongosh
```

**Network'ü kontrol et:**
```bash
docker network inspect blog-platform_blog-network
```

**Volume'ları kontrol et:**
```bash
docker volume ls
```

Tüm komutlar için: [docs/commands.md](docs/commands.md)

---

## API Kullanımı

### Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/posts` | Tüm yazıları listele |
| GET | `/api/posts/:id` | Tek yazı detayı |
| POST | `/api/posts` | Yeni yazı oluştur |
| PUT | `/api/posts/:id` | Yazı güncelle |
| DELETE | `/api/posts/:id` | Yazı sil |

### Örnek İstekler

Tüm API örnekleri için: [docs/API.md](docs/API.md)

---

## Proje Yapısı

```
blog-platform/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── LICENSE
├── api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── src/
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
└── docs/
    ├── architecture.md
    ├── API.md
    └── commands.md
```

---

## Öğrenilen Docker Kavramları

Bu projede kullanılan Docker kavramları:

- Multi-stage build
- Docker Compose orchestration
- Named volumes (veri kalıcılığı)
- Custom bridge network
- Health checks
- Environment variables
- Resource limits
- Non-root user
- .dockerignore optimization
- Container networking

---

## Troubleshooting

**Port 80 zaten kullanılıyor:**

docker-compose.yml'de portu değiştirin: `8080:80`

**MongoDB'ye bağlanamıyor:**

Container loglarını kontrol edin: `docker-compose logs mongodb`

**Değişiklikler yansımıyor:**

Image'i yeniden build edin: `docker-compose build --no-cache`

Detaylı sorun giderme için: [docs/troubleshooting.md](docs/troubleshooting.md)

---

## Güvenlik

**Production Checklist:**

- Environment variables `.env` dosyasında
- MongoDB authentication aktif
- Non-root user kullanımı
- Resource limits tanımlı
- Health checks aktif

Detaylı güvenlik bilgisi için: [docs/security.md](docs/security.md)

---

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## İletişim

- GitHub: [@yourusername](https://github.com/yourusername)
- Proje: [blog-platform](https://github.com/yourusername/blog-platform)
