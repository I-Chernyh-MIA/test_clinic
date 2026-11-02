import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class DoctorsQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly specialtyId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly itemsPerPage: number = 10;
}
