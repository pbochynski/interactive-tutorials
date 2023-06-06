const redis = require('redis');

const client = redis.createClient()

async function connect() {
  await client.connect();
}

async function inc(key) {
  await client.incr(key);
  return get(key);
}

async function get(key) {
  const value = await client.get(key);
  return value;
}
async function disconnect() {
  client.disconnect();
}

async function test() {
  connect()
  let v = await inc('key1')
  console.log(v)
  v = await inc('key1')
  console.log(v)
  disconnect()  
}

test()