import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { LoggingInterceptor } from '@common/interceptors';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto';
import { JwtAuthGuard } from '@auth/guards';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Throttle({default:{ limit: 100, ttl: 60 }})
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  async getCustomer(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
}
