import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnApplicationShutdown, OnModuleInit {
  private _client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  public get client() {
    return this._client;
  }

  private set client(value) {
    this._client = value;
  }

  constructor(
    @Inject(REDIS_CONFIG_OPTIONS) private readonly config: RedisConfig,
  ) {
    this.client = createClient(config.createClientConfiguration);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.quit();
  }
}

export { REDIS_CONFIG_OPTIONS };
