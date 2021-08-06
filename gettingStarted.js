require('dotenv').config()
const memjs = require('memjs');

(async () => {
  if (!process.env.MEMCACHED_HOST) {
    throw Error('You should first fill the .env-example file and rename it to .env');
  }

  // Connect to Memcached server
  console.log();
  console.log('🔌  Connecting to Memcached...');
  console.log();
  const { MEMCACHED_HOST, MEMCACHED_USER, MEMCACHED_PASSWORD } = process.env;
  const memcached = memjs.Client.create(
    `${MEMCACHED_USER}:${MEMCACHED_PASSWORD}@${MEMCACHED_HOST}`,
    {
      timeout: 5,
      keepAlive: true
    }
  );


  // This is a good practice to close Memcached connection when the Node.js process receives the signal "TERM".
  process.once('SIGTERM', () => memcached.quit());


  // MemJS client will expose these methods: get, set, add, replace, delete, increment, decrement, append, prepend, touch, flush, statsWithKey, stats, resetStats, quit, close


  // Set a key
  console.log(`➡️  Setting key "stackhero-example-key" to value "abcd" with an expiration of 600 seconds`);
  await memcached.set('stackhero-example-key', 'abcd', { expires: 600 });
  console.log();


  // Get a key
  console.log(`➡️  Getting key "stackhero-example-key" value...`);
  const response = await memcached.get('stackhero-example-key');
  console.log(`⬅️  Key "stackhero-example-key" has value "${response.value.toString()}"`);
  console.log();


  // Disconnect from Memcached
  console.log('-'.repeat(80));
  console.log('👋 Disconnecting from memcached');
  memcached.quit();
  console.log();

})().catch(error => {
  console.error('');
  console.error('🐞 An error occurred!');
  console.error(error);
  process.exit(1);
});