import { RedisClientOptions } from 'redis';

export interface RedisConfig {
  createClientConfiguration: RedisClientOptions;
}

export { RedisClientOptions };
