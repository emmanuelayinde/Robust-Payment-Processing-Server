import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Environment, ApiError, CreatePaymentRequest } from 'square';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
  private readonly client: Client;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private PaymentsRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.client = new Client({
      accessToken: this.configService.get<string>('square.accessToken'),
      environment:
        this.configService.get<string>('square.environment') === 'production'
          ? Environment.Production
          : Environment.Sandbox,
    });
  }

  private async createSquarePayment(
    amount: number,
    currency: string,
    sourceId: string,
  ): Promise<any> {
    try {
      const body: CreatePaymentRequest = {
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(amount * 100),
          currency,
        },
      };

      const { result } = await this.client.paymentsApi.createPayment(body);

      this.logger.log(`Payment created successfully: ${result.payment.id}`);
      return result.payment;
    } catch (error) {
      if (error instanceof ApiError) {
        this.logger.error(`Square API Error: ${error.message}`);
        throw error;
      }
      this.logger.error(
        'Unexpected error during payment creation',
        error.stack,
      );
      throw error;
    }
  }

  async createPayment(
    amount: number,
    currency: string,
    sourceId: string,
    customerId: string,
  ): Promise<Payment> {
    try {
      const squarePayment = await this.createSquarePayment(
        amount,
        currency,
        sourceId,
      );

      console.log({ squarePayment });

      const payment = this.PaymentsRepository.create({
        amount,
        currency,
        customerId,
        paymentId: squarePayment.id,
        status:
          squarePayment.status === 'COMPLETED'
            ? PaymentStatus.COMPLETED
            : PaymentStatus.PENDING,
      });

      await this.PaymentsRepository.save(payment);
      return payment;
    } catch (error) {
      this.logger.error('Error creating payment:', error.stack);
      throw error;
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    const payments = await this.PaymentsRepository.find({});
    if (!payments) {
      this.logger.warn('No payments found');
    }

    return payments;
  }

  async getAllCustomerPayments(customerId: string): Promise<Payment[]> {
    try {
      const payments = await this.PaymentsRepository.find({
        where: { customerId },
      });
      return payments;
    } catch (error) {
      this.logger.error(
        `Error retrieving customer payments by customer ID ${customerId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<Payment> {
    try {
      const payment = await this.PaymentsRepository.findOne({
        where: { id: paymentId },
      });
      return payment;
    } catch (error) {
      this.logger.error(`Error retrieving payment ${paymentId}:`, error.stack);
      throw error;
    }
  }
}
