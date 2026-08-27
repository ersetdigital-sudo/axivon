// Run Supabase migrations via direct Postgres connection
// Usage: node scripts/run-migrations.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const PROJECT_REF = 'zvvamkqzpupeoladlwui';
const PASSWORD = 'Sumedang@98';
// Try pooler (transaction mode) — usually more reliable than direct db host
const URL = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres`;

async function runMigration(file) {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', file), 'utf8');
  const client = new Client({ connectionString: URL, ssl: { rejectUnauthorized: false } });
  console.log(`\n▶ Running ${file}...`);
  try {
    await client.connect();
    await client.query(sql);
    console.log(`✅ ${file} OK`);
  } catch (e) {
    console.error(`❌ ${file} FAILED:`, e.message);
    if (e.position) console.error(`   at position ${e.position}`);
    throw e;
  } finally {
    await client.end();
  }
}

(async () => {
  try {
    // 0001 & 0002 are already applied — skip them
    await runMigration('0003_payment_methods.sql');
    console.log('\n🎉 Migrations applied.');
  } catch (e) {
    process.exit(1);
  }
})();
