const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  process.env.SUPABASE_URL || 'https://zvvamkqzpupeoladlwui.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var first.');
  process.exit(1);
}

(async () => {
  // Get user by email
  const { data: users } = await s.auth.admin.listUsers();
  const u = users?.users?.find((x) => x.email === 'ersetstore@gmail.com');
  console.log('user id:', u?.id);

  // Simulate authenticated session
  const { data: signin, error: signinErr } = await s.auth.signInWithPassword({
    email: 'ersetstore@gmail.com',
    password: 'Admin123456!',
  });
  console.log('signin ok:', !!signin?.session, signinErr?.message);

  if (signin?.session) {
    // Query products as authenticated user
    const { data: products, error: prodErr } = await s
      .from('products')
      .select('id,label,games(slug,name)')
      .limit(3);
    console.log('products count:', products?.length, 'err:', prodErr?.message);
  }
})();
