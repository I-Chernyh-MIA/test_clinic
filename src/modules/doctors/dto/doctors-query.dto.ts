import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DoctorsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly specialty?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly fullName?: string;

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
