import { LoggingInterceptor } from '@common/interceptors';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {  Throttle} from '@nestjs/throttler';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto';
import { JwtAuthGuard } from '@auth/guards';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Throttle({default: { limit: 50, ttl: 60 }})
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  async getTransaction(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}
