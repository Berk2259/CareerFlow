# CareerFlow

İş başvurularını tek yerden takip etmek için geliştirilen bir web uygulaması. Kullanıcılar başvurularını, mülakat takvimlerini ve CV geçmişlerini yönetebiliyor.

## Özellikler (planlanan)

- Başvuru takibi (kanban görünümü)
- Takvim (mülakat/son başvuru tarihleri)
- CV arşivi
- AI destekli CV-ilan eşleştirme (yakında)
- İlana özel pratik/sınav köşesi (yakında)

## Teknolojiler

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Auth + Postgres + Storage)

## Geliştirme ortamını çalıştırma

\`\`\`bash
npm install
npm run dev
\`\`\`

`http://localhost:3000` adresinde açılır. Supabase bağlantısı için `.env.local.example` dosyasını referans alıp kendi `.env.local` dosyanı oluşturman gerekiyor.