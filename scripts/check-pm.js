const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  const { data: methods } = await a.from('payment_methods').select('label, is_active, qris_image_url').eq('is_active', true);
  console.log('Active methods:');
  methods?.forEach(m => {
    const bytes = Buffer.from(m.label).toString('hex');
    console.log(`  "${m.label}" (${m.label.length} chars, hex: ${bytes}) qr=${m.qris_image_url?.slice(0, 40)}`);
  });

  // Get latest order's payment_method value
  const { data: o } = await a.from('orders').select('payment_method').eq('order_code', 'AX-20260827-0008').single();
  console.log('\nOrder AX-20260827-0008 payment_method:', JSON.stringify(o));
  if (o) {
    const bytes = Buffer.from(o.payment_method).toString('hex');
    console.log(`Hex: ${bytes}`);
  }
})();
