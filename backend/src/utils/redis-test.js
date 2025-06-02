const { createClient } = require('redis');

async function testRedisConnection() {
  console.log('Testing Redis Cloud connection...');
  
  // Redis Cloud configuration
  const redisConfig = {
    username: 'default',
    password: 'EeCYciJ5dXxxn6yyd4cUHhNWkACQS5KA',
    socket: {
      host: 'redis-14944.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 14944,
      connectTimeout: 10000, // 10 second timeout
    }
  };

  try {
    console.log('Creating Redis client...');
    const client = createClient(redisConfig);
    
    // Set up error logging
    client.on('error', (err) => {
      console.error('Redis Error:', err);
    });

    console.log('Connecting to Redis...');
    await client.connect();
    console.log('Connected successfully to Redis Cloud!');
    
    // Test basic operations
    console.log('Setting test value...');
    await client.set('test-key', 'test-value');
    
    console.log('Getting test value...');
    const value = await client.get('test-key');
    console.log('Retrieved value:', value);
    
    // Clean up
    console.log('Deleting test key...');
    await client.del('test-key');
    
    console.log('Disconnecting...');
    await client.disconnect();
    console.log('Redis test completed successfully!');
    return true;
  } catch (error) {
    console.error('Redis test failed:', error);
    return false;
  }
}

// Execute the test
testRedisConnection()
  .then(success => {
    console.log(`Redis connection test ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during Redis test:', err);
    process.exit(1);
  }); 
 