import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CurrencyResDto } from './dto/currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly http: HttpService) {}

  async getCurrency(): Promise<CurrencyResDto> {
    const source = 'usd';
    const target = 'krw';
    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${source}/${target}.json`;
    const { data } = await this.http.axiosRef.get(url);
    return { source, target, currency: data[target] };
  }

  mockCurrencyApiRes(won: number) {
    return {
      date: '2023-02-07',
      krw: won,
    };
  }
}
