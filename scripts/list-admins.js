// List all auth users + their profiles (role)
const { createClient } = require('@supabase/supabase-js');

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvvamkqzpupeoladlwui.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const supabase = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 100 });
  if (error) { console.error('listUsers failed:', error.message); process.exit(1); }

  const profiles = await supabase.from('profiles').select('id,email,role,full_name').order('role');
  console.log('=== AUTH USERS ===');
  for (const u of data.users) {
    console.log(`- ${u.email}  (id=${u.id}  created=${u.created_at})`);
  }
  console.log('\n=== PROFILES (role) ===');
  if (profiles.error) { console.error(profiles.error.message); }
  else {
    for (const p of profiles.data || []) {
      console.log(`- [${p.role}] ${p.email}  name=${p.full_name || ''}  id=${p.id}`);
    }
  }
})();
