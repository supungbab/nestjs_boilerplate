import { Body, Controller, Patch, Post } from '@nestjs/common';
import { SimpleQueueService } from './simple-queue.service';

@Controller('queue')
export class SimpleQueueController {
  constructor(private readonly simpleQueueService: SimpleQueueService) {}

  @Post('enqueue')
  async enqueue(@Body() body) {
    const total = await this.simpleQueueService.enqueue(body.data);
    return {
      total,
    };
  }

  @Patch('dequeue')
  async dequeue() {
    const result = await this.simpleQueueService.dequeue();
    return { data: result };
  }
}
