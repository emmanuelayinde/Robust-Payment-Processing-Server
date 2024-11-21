import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities';
import { PaymentService } from '@payments/payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PaymentService],
})
export class TransactionsModule {}
