// src/modules/payments/services/square-payment.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Environment, ApiError, CreatePaymentRequest } from 'square';
import { randomUUID } from 'crypto';

@Injectable()
export class SquarePaymentService {
  private readonly client: Client;
  private readonly logger = new Logger(SquarePaymentService.name);

  constructor(private configService: ConfigService) {
    this.client = new Client({
      accessToken: this.configService.get<string>('square.accessToken'),
      environment:
        this.configService.get<string>('square.environment') === 'production'
          ? Environment.Production
          : Environment.Sandbox,
    });
  }

  async createPayment(
    amount: number,
    currency: string,
    sourceId: string,
  ): Promise<any> {
    try {
      const body: CreatePaymentRequest = {
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(amount * 100), // Convert to cents
          currency,
        },
      };

      const response = await this.client.paymentsApi.createPayment(body);

      this.logger.log(
        `Payment created successfully: ${response.result.payment.id}`,
      );
      return response.result.payment;
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

  async getPayment(paymentId: string): Promise<any> {
    try {
      const response = await this.client.paymentsApi.getPayment(paymentId);
      return response.result.payment;
    } catch (error) {
      this.logger.error(`Error retrieving payment ${paymentId}:`, error.stack);
      throw error;
    }
  }
}
