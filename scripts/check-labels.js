// Check production DB (via service key) - same connection as Vercel
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

(async () => {
  // Get all 6 games' first product label
  const { data: games } = await a.from('games').select('id, slug').order('id');
  for (const g of games) {
    const { data: prods } = await a.from('products').select('label, is_active').eq('game_id', g.id).order('sort_order').limit(2);
    console.log(`\n${g.slug} (id=${g.id}):`);
    prods?.forEach(p => {
      const bytes = Buffer.from(p.label).toString('hex');
      console.log(`  "${p.label}" active=${p.is_active}`);
      console.log(`  bytes: ${bytes}`);
    });
  }
})();
