import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { ReceptionStatus, SlotStatus } from '../../../generated/prisma/enums.js';
import { Type } from 'class-transformer';

export class GetReceptionsQueryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly patientId: number;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true })
  readonly from?: string;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true })
  readonly to?: string;

  @IsOptional()
  @IsIn(Object.values(ReceptionStatus))
  readonly status?: ReceptionStatus;
}
