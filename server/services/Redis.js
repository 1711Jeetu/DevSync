const Redis = require('ioredis');

const RedisPublisher = new Redis();
const RedisSubscriber = new Redis();

RedisPublisher.on('error', err => console.error('Redis Publisher Error: ', err));
RedisPublisher.on('error', err => console.error('Redis Subscriber Error: ', err));

console.log("Redis Clients initialized");

module.exports = {
    RedisPublisher,
    RedisSubscriber,
};