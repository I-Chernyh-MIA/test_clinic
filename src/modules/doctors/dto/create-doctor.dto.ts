import {
  IsDecimal,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { gender } from '../../../common/types/index.js';
import type { GenderType } from '../../../common/types/index.js';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly patronymic?: string;

  @IsIn(gender)
  readonly gender: GenderType;

  @IsNumber()
  @Type(() => Number)
  readonly specialtyId: number;

  @IsDecimal()
  readonly price: number;
}
