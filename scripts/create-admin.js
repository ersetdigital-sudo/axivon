// Create admin user via Supabase Admin API + promote to admin role
const { createClient } = require('@supabase/supabase-js');

// Credentials are read from env to avoid leaking secrets in source control.
// Run: SERVICE_KEY=... node scripts/create-admin.js
const URL = process.env.SUPABASE_URL || 'https://zvvamkqzpupeoladlwui.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var first.');
  process.exit(1);
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ersetstore@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123456!';

const supabase = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  console.log(`Creating admin user: ${ADMIN_EMAIL}...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Admin Axivon' },
  });
  if (error) {
    if (error.message.includes('already')) {
      console.log('User already exists, skipping creation.');
    } else {
      console.error('Create user failed:', error.message);
      process.exit(1);
    }
  } else {
    console.log('User created:', data.user?.id);
  }

  // Promote to admin role
  console.log('Promoting to admin role...');
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', ADMIN_EMAIL)
    .select();

  if (updateError) {
    console.error('Promote failed:', updateError.message);
    process.exit(1);
  }
  console.log('Profile updated:', updated);

  console.log('\n✅ Admin user ready:');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
})();
