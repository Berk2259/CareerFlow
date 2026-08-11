# CareerFlow

İş başvurularını tek yerden takip etmek için geliştirilen bir web uygulaması. Kullanıcılar başvurularını, mülakat takvimlerini ve CV geçmişlerini yönetebiliyor.

## Özellikler

- [x] E-posta ile kayıt/giriş (Supabase Auth)
- [x] Korumalı dashboard (giriş yapmayan kullanıcı erişemiyor)
- [x] Başvuru ekleme ve listeleme
- [x] Kanban görünümü (durumlara göre sürükle-bırak)
- [ ] Takvim (mülakat/son başvuru tarihleri)
- [ ] CV arşivi
- [ ] AI destekli CV-ilan eşleştirme
- [ ] İlana özel pratik/sınav köşesi

## Teknolojiler

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Auth + Postgres + Row Level Security)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (sürükle-bırak)

## Geliştirme ortamını çalıştırma

```bash
npm install
npm run dev
```

`http://localhost:3000` adresinde açılır.

### Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde bir proje oluşturdum.
2. Proje ayarlarından (Project Settings → API Keys) Project URL ve Publishable (anon) key'i aldım.
3. Proje kök dizininde `.env.local` dosyası oluşturdum:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. SQL Editor'da `applications` tablosunu ve Row Level Security politikalarını oluşturdum.