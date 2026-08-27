const dns = require('dns');
const regions = ['ap-southeast-1', 'ap-northeast-1', 'ap-south-1', 'us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-2', 'sa-east-1'];
(async () => {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    try {
      const addrs = await dns.promises.resolve4(host);
      console.log(`${r} -> ${addrs.join(', ')}`);
    } catch (e) {
      console.log(`${r} -> FAIL`);
    }
  }
})();
