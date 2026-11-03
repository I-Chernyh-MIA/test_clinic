import { Type } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateReceptionDto {
  @IsNumber()
  @Type(() => Number)
  readonly patientId: number;

  @IsNumber()
  @Type(() => Number)
  readonly slotId: number;

  @IsBoolean()
  @Type(() => Boolean)
  readonly isInitial: boolean = true;
}
