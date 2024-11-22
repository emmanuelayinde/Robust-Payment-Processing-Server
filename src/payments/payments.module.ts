import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentService, JwtService],
  exports: [PaymentService],
})
export class PaymentsModule {}
