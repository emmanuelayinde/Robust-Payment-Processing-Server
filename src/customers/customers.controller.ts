import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoggingInterceptor } from '@common/interceptors';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '@auth/guards';
import { Request } from 'express';

@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Customers found' })
  async getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @Get('current-customer')
  @ApiOperation({ summary: 'Get current customer' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  async getCurrentCustomer(@Req() request: Request) {
    const customerId = request['customerId'];
    return this.customersService.getCustomerById(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  async getCustomer(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }
}
