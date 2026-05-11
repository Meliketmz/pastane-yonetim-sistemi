# Butik Pastane ve Menü Yönetim Sistemi

Bu proje, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş web tabanlı bir CRUD uygulamasıdır. Bir butik pastanenin ürün envanterini, fiyatlandırmasını ve kategorilerini dijital ortamda yönetmesini sağlar.

## Kullanılan Teknolojiler

- **Frontend:** Vanilla Javascript, HTML5, CSS3 (Single Page Application mimarisi)
- **Backend:** Node.js, Express.js
- **Veritabanı:** SQLite
- **API Dokümantasyonu:** Swagger UI

## Temel Özellikler

- Menü ürünleri için tam CRUD (Oluştur, Oku, Güncelle, Sil) operasyonları
- Asenkron API çağrıları (Fetch API) ile sayfa yenilenmeden çalışan dinamik arayüz
- İş mantığının (Business Logic) route'lardan bağımsız katmanlarda yönetilmesi
- Hem istemci (Frontend) hem de sunucu (Backend) tarafında veri doğrulama (Validation)
