const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

(async () => {
  // Get game
  const { data: game } = await s.from('games').select('id').eq('slug', 'mobile-legends').single();
  console.log('game:', game);
  // Get product
  const { data: product } = await s.from('products').select('id,label,price').eq('game_id', game.id).eq('label', '86 Diamonds').single();
  console.log('product:', product);
  // Insert order
  const { data: codeData } = await s.rpc('generate_order_code');
  console.log('code:', codeData);
  const { data: order, error } = await s.from('orders').insert({
    order_code: codeData,
    game_id: game.id,
    product_id: product.id,
    customer_uid: '1111111',
    customer_zid: '1234',
    customer_whatsapp: '628123456789',
    payment_method: 'QRIS',
    subtotal: product.price,
    service_fee: 0,
    total: product.price,
    status: 'pending',
  }).select().single();
  console.log('order:', order, 'err:', error?.message);
})();
