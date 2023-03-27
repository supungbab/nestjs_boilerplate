import { Test, TestingModule } from '@nestjs/testing';
import { REDIS_CONFIG_OPTIONS } from '../common/redis/redis.constant';
import { RedisService } from '../common/redis/redis.service';
import { SimpleQueueService } from './simple-queue.service';

describe('SimpleQueueService', () => {
  let simpleQueueService: SimpleQueueService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimpleQueueService,
        RedisService,
        {
          provide: REDIS_CONFIG_OPTIONS,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    simpleQueueService = module.get<SimpleQueueService>(SimpleQueueService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(simpleQueueService).toBeDefined();
  });

  it('enqueue/dequeue', async () => {
    const queueData = 'data1';
    const queueLen = 1;
    redisService.client.lPush = jest.fn().mockResolvedValueOnce(queueLen);
    redisService.client.rPop = jest.fn().mockResolvedValueOnce(queueData);

    const enqueueResult = await simpleQueueService.enqueue(queueData);
    expect(enqueueResult).toEqual(queueLen);

    const dequeueResult = await simpleQueueService.dequeue();
    expect(dequeueResult).toEqual(queueData);
  });
});
