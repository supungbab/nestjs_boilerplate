import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '../common/redis/redis.module';
import { SimpleQueueController } from './simple-queue.controller';
import { SimpleQueueService } from './simple-queue.service';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        createClientConfiguration: {
          socket: {
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
          },
        },
      }),
    }),
  ],
  controllers: [SimpleQueueController],
  providers: [SimpleQueueService],
})
export class SimpleQueueModule {}
