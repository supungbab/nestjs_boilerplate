import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppModule } from './../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { CurrencyService } from '../src/currency/currency.service';

const randomDigit = (digit) => `${Math.random()}`.slice(-digit);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;
  let currecyService: CurrencyService;
  let redisService: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpService = moduleFixture.get<HttpService>(HttpService);
    currecyService = moduleFixture.get<CurrencyService>(CurrencyService);
    redisService = moduleFixture.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have redis client ready', async () => {
    expect(redisService.client.isOpen).toEqual(true);
    expect(redisService.client.isReady).toEqual(true);

    const pong = await redisService.client.ping();
    expect(pong).toEqual('PONG');
  });

  describe('/currency', () => {
    it('GET', async () => {
      const value = 1200.42;
      const mockRes = currecyService.mockCurrencyApiRes(value);
      httpService.axiosRef.get = jest
        .fn()
        .mockResolvedValueOnce({ data: mockRes });

      const { body: currency } = await request(app.getHttpServer())
        .get(`/currency/usd/krw`)
        .expect(200);

      expect(currency.source).toEqual('usd');
      expect(currency.target).toEqual('krw');
      expect(currency.currency).toEqual(value);
    });
  });

  describe('/queue', () => {
    it('GET /queue/{enqueue,dequeue}', async () => {
      const data = `queue-data-${randomDigit(8)}`;
      await request(app.getHttpServer())
        .post(`/queue/enqueue`)
        .send({ data })
        .expect(201);

      const {
        body: { data: received },
      } = await request(app.getHttpServer())
        .patch(`/queue/dequeue`)
        .expect(200);

      expect(received).toEqual(data);
    });
  });

  describe('/cats', () => {
    it('POST -> 201', async () => {
      const data = {
        name: `cat-name-${randomDigit(8)}`,
        age: 3,
        breed: 'cat-breed',
      };
      const { body } = await request(app.getHttpServer())
        .post(`/cats`)
        .send(data)
        .expect(201);

      expect(body.name).toEqual(data.name);
      expect(body.age).toEqual(data.age);
      expect(body.breed).toEqual(data.breed);
    });

    it('POST -> 400: missing "name"', async () => {
      const data = {
        age: 3,
      };
      const { body } = await request(app.getHttpServer())
        .post(`/cats`)
        .send(data)
        .expect(400);

      expect(body.statusCode).toEqual(400);
      expect(body.message).toEqual([
        'name must be a string',
        'name should not be empty',
      ]);
      expect(body.error).toEqual('Bad Request');
    });

    it('POST -> 400: minus "age"', async () => {
      const data = {
        name: 'cat',
        age: -5,
      };
      const { body } = await request(app.getHttpServer())
        .post(`/cats`)
        .send(data)
        .expect(400);

      expect(body.statusCode).toEqual(400);
      expect(body.message).toEqual(['age must not be less than 0']);
      expect(body.error).toEqual('Bad Request');
    });
  });
});
