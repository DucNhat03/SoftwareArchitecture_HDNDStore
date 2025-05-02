{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^27.0.0",
    "redis-mock": "^1.0.0"
  }
} 

const Redis = require('redis-mock');
const client = Redis.createClient();

test('set and get value from Redis', async () => {
  await new Promise((resolve, reject) => {
    client.set('key', 'value', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const value = await new Promise((resolve, reject) => {
    client.get('key', (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  expect(value).toBe('value');
}); 

module.exports = {
  testEnvironment: 'node'
};