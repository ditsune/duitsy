import { createBrowserClient } from '@supabase/ssr';

// Satu instance untuk seluruh tab. Kalau setiap query membuat client sendiri,
// beberapa GoTrueClient membaca dan me-refresh sesi dari localStorage tanpa
// koordinasi, dan itu memunculkan error token yang hanya hilang setelah hard refresh.
let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
