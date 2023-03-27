import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';
import { KEY_QUEUE } from './simple-queue.constant';

@Injectable()
export class SimpleQueueService {
  constructor(private readonly redis: RedisService) {}

  async enqueue(value: string): Promise<number> {
    return await this.redis.client.lPush(KEY_QUEUE, value);
  }

  async dequeue(): Promise<string> {
    return this.redis.client.rPop(KEY_QUEUE);
  }
}
