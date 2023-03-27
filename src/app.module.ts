import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SimpleQueueModule } from './simple-queue/simple-queue.module';
import { CatsModule } from './cats/cats.module';
import { APP_PIPE } from '@nestjs/core';
import { CurrencyModule } from './currency/currency.module';

const envFile = (nodeEnv: string): string => {
  const file = {
    local: '.env.local',
    dev: '.env.dev',
    prod: '.env.prod',
  }[nodeEnv];
  return file || '.env.local';
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFile(process.env.NODE_ENV),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('MONGO_HOST');
        const port = config.get<string>('MONGO_PORT');
        const user = config.get<string>('MONGO_USER');
        const pass = config.get<string>('MONGO_PASS');
        const uri = `mongodb://${user}:${pass}@${host}:${port}/admin`;
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    SimpleQueueModule,
    CatsModule,
    CurrencyModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
