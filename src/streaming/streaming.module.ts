import { Module } from '@nestjs/common';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';

@Module({
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
