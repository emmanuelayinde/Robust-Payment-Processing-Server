import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggingInterceptor } from '@common/interceptors';
import { JwtAuthGuard } from '@auth/guards';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency, sourceId } = createPaymentDto;
    console.log({ amount, currency, sourceId });
    return this.paymentsService.createPayment(amount, currency, sourceId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved' })
  async retrieveAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved' })
  async retrievePayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }
}
