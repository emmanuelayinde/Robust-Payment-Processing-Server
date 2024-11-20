import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Customer } from './entities';
import { CreateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);

    try {
      const savedCustomer = await this.customersRepository.save(customer);
      this.logger.log(`Customer created with ID: ${savedCustomer.id}`);
      return savedCustomer;
    } catch (error) {
      this.logger.error('Error creating customer:', error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!customer) {
      this.logger.warn(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }
}
