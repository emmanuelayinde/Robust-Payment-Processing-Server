import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency, sourceId } = createPaymentDto;
    return await this.paymentsService.createPayment(amount, currency, sourceId);
  }

  //   @Get(':id')
  //   async findOne(@Param('id') id: string) {
  //     return await this.paymentsService.getPayment(id);
  //   }

  @Get('get-locations')
  async findOne() {
    return await this.paymentsService.getLocations();
  }
}
