import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SlotStatus } from '../../../generated/prisma/enums.js';
import { Type } from 'class-transformer';

export class GetSlotsQueryDto {
  @IsDateString({ strict: true, strictSeparator: true })
  @IsNotEmpty()
  readonly from: string;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true })
  readonly to?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly doctorId?: number;

  @IsOptional()
  @IsIn(Object.values(SlotStatus))
  readonly status?: SlotStatus;
}
