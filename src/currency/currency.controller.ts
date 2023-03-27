import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyResDto } from './dto/currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/usd/krw')
  async getUsdToKrwCurrency(): Promise<CurrencyResDto> {
    return this.currencyService.getCurrency();
  }
}
