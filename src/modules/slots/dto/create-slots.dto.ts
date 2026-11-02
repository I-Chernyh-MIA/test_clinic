import { Type } from "class-transformer";
import { IsDateString, IsMilitaryTime, IsNumber, IsOptional, MaxLength } from "class-validator";

export class CreateSlotsDto {
  @IsNumber()
  @Type(() => Number)
  readonly doctorId: number;

  @IsDateString({}, { message: 'Неверный формат даты (требуется YYYY-MM-DD)' })
  @MaxLength(10)
  readonly dateFrom: string;

  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты (требуется YYYY-MM-DD)' })
  @MaxLength(10)
  readonly dateTo?: string;

  @IsOptional()
  @IsMilitaryTime({ message: 'Время должно быть в формате HH:MM' })
  @MaxLength(5)
  readonly timeFrom?: string;

  @IsOptional()
  @IsMilitaryTime({ message: 'Время должно быть в формате HH:MM' })
  @MaxLength(5)
  readonly timeTo?: string;
}