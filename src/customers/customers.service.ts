import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './entities';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'payments'],
    });

    if (!customer) {
      this.logger.warn(`Customer with id ${id} not found`);
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      const customers = await this.customersRepository.find({
        select: ['id', 'name', 'email'],
      });
      return customers;
    } catch (error) {
      this.logger.error('Error fetching customers:', error.stack);
      throw error;
    }
  }
}
