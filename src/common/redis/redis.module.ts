import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CONFIG_OPTIONS } from './redis.constant';
import { RedisConfig } from './redis.config';

type RedisAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<RedisConfig>, 'useFactory' | 'inject'>;

@Module({})
export class RedisModule {
  static register(config: RedisConfig): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: config,
        },
        RedisService,
      ],
      exports: [RedisService, REDIS_CONFIG_OPTIONS],
    };
  }
  static registerAsync(options: RedisAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
