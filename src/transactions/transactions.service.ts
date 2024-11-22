import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Transaction, TransactionStatus } from './entities';
import { PaymentService } from '@payments/payments.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private PaymentService: PaymentService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      customerId: createTransactionDto.customerId,
      amount: createTransactionDto.amount,
      currency: createTransactionDto.currency,
      status: TransactionStatus.PENDING,
    });

    try {
      // Save initial transaction record
      const savedTransaction =
        await this.transactionsRepository.save(transaction);

      // Process payment with
      const payment = await this.PaymentService.createPayment(
        createTransactionDto.amount,
        createTransactionDto.currency,
        createTransactionDto.sourceId,
      );

      // Update transaction with  payment ID and status
      savedTransaction.paymentId = payment.id;
      savedTransaction.status = TransactionStatus.COMPLETED;

      const updatedTransaction =
        await this.transactionsRepository.save(savedTransaction);
      this.logger.log(
        `Transaction completed successfully: ${updatedTransaction.id}`,
      );

      return updatedTransaction;
    } catch (error) {
      this.logger.error('Error processing transaction:', error.stack);

      if (transaction.id) {
        transaction.status = TransactionStatus.FAILED;
        await this.transactionsRepository.save(transaction);
      }

      throw error;
    }
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!transaction) {
      this.logger.warn(`Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      relations: ['customer'],
    });

    if (!transactions) {
      this.logger.warn(`Transactions not found`);
      throw new NotFoundException(`Transactions not found`);
    }

    return transactions;
  }
}
