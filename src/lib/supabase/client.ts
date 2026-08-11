import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

//Sonuç olarak bu dosya, "tarayıcıdan Supabase'e bağlanmak istediğimde kullanacağım hazır bağlantı nesnesini bana ver" diyen küçük bir yardımcı fonksiyon.