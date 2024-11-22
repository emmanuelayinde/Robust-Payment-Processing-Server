import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency, sourceId } = createPaymentDto;
    return await this.paymentsService.createPayment(amount, currency, sourceId);
  }

  @Get()
  async retrieveAllPayments() {
    return await this.paymentsService.getAllPayments();
  }

  @Get(':id')
  async retrievePayment(@Param('id') id: string) {
    return await this.paymentsService.getPayment(id);
  }
}
