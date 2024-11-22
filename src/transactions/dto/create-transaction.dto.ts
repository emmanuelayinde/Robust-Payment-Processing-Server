import { IsString, IsNumber, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP'])
  currency: string;

  @ApiProperty({ example: 'card_nonce_from_square' })
  @IsString()
  sourceId: string;
}
