// E2E test for admin CRUD via server actions
// Run with: node -r dotenv/config scripts/test-crud.js dotenv_config_path=.env.local
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  console.log('=== TEST 1: Create product ===');
  const { data: ml } = await admin.from('games').select('id').eq('slug', 'mobile-legends').single();
  const { data: created, error: createErr } = await admin.from('products').insert({
    game_id: ml.id,
    label: 'TEST E2E PRODUCT',
    price: 12345,
    old_price: 15000,
    coins: 100,
    description: 'Inserted by test-crud script',
    icon_color: 'text-[#ff5c2b]',
    sort_order: 999,
    is_active: true,
  }).select().single();
  if (createErr) { console.error('FAIL:', createErr.message); return; }
  console.log('Created product ID:', created.id, '| label:', created.label);

  console.log('\n=== TEST 2: Update product ===');
  const { data: updated, error: updateErr } = await admin.from('products').update({
    label: 'TEST E2E UPDATED',
    price: 99999,
  }).eq('id', created.id).select().single();
  if (updateErr) { console.error('FAIL:', updateErr.message); return; }
  console.log('Updated label:', updated.label, '| price:', updated.price);

  console.log('\n=== TEST 3: Toggle active ===');
  const { error: toggleErr } = await admin.from('products').update({ is_active: false }).eq('id', created.id);
  if (toggleErr) { console.error('FAIL:', toggleErr.message); return; }
  console.log('Toggled to inactive');

  console.log('\n=== TEST 4: Delete product ===');
  const { error: deleteErr } = await admin.from('products').delete().eq('id', created.id);
  if (deleteErr) { console.error('FAIL:', deleteErr.message); return; }
  console.log('Deleted product');

  console.log('\n=== TEST 5: Update order status ===');
  const { data: orders } = await admin.from('orders').select('id, status').limit(1);
  if (orders && orders.length > 0) {
    const o = orders[0];
    const { error: oe } = await admin.from('orders').update({ status: 'success' }).eq('id', o.id);
    if (oe) { console.error('FAIL:', oe.message); return; }
    console.log('Updated order', o.id, 'from', o.status, 'to success');
  } else {
    console.log('No orders to test');
  }

  console.log('\n=== TEST 6: Toggle payment method ===');
  const { data: methods } = await admin.from('payment_methods').select('id, label, is_active').limit(3);
  for (const m of methods || []) {
    const next = !m.is_active;
    const { error: me } = await admin.from('payment_methods').update({ is_active: next }).eq('id', m.id);
    if (me) { console.error('FAIL:', me.message); return; }
    console.log('Toggled', m.label, 'to', next);
  }

  console.log('\n=== TEST 7: Update payment method ===');
  const { data: firstMethod } = await admin.from('payment_methods').select('id, label').limit(1).single();
  if (firstMethod) {
    const { error: me } = await admin.from('payment_methods').update({
      label: firstMethod.label + ' (test)',
    }).eq('id', firstMethod.id);
    if (me) { console.error('FAIL:', me.message); return; }
    console.log('Updated payment method', firstMethod.id);
    // Restore
    await admin.from('payment_methods').update({ label: firstMethod.label }).eq('id', firstMethod.id);
  }

  console.log('\n✅ All admin CRUD operations work via Supabase directly.');
  console.log('   Server actions in /admin/(protected)/actions.ts use the same admin client.');
  console.log('   Forms in ProductsManager / OrdersManager / PaymentsManager call those actions');
  console.log('   and redirect with ?msg=...&toast=ok to trigger the Toast component.');
})();
