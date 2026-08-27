const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  // Check payment methods
  const { data: methods } = await a.from('payment_methods').select('id, label, slug, type, qris_image_url, is_active').order('sort_order');
  console.log('=== Payment methods ===');
  methods?.forEach(m => console.log(JSON.stringify({id: m.id, label: m.label, type: m.type, qris: m.qris_image_url?.slice(0, 60), active: m.is_active})));

  // Check latest order
  const { data: orders } = await a.from('orders').select('id, order_code, payment_method, status').order('created_at', { ascending: false }).limit(3);
  console.log('\n=== Latest orders ===');
  orders?.forEach(o => console.log(JSON.stringify(o)));
})();
