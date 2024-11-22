import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './entities';
import { CreateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async createNewCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);

    try {
      const savedCustomer = await this.customersRepository.save(customer);
      return savedCustomer;
    } catch (error) {
      this.logger.error('Error creating customer:', error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      relations: ['transactions'],
    });

    if (!customer) {
      this.logger.warn(`Customer with id ${id} not found`);
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { email },
    });

    if (!customer) {
      this.logger.warn(`Customer with email ${email} not found`);
      throw new NotFoundException(`Customer with email ${email} not found`);
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
