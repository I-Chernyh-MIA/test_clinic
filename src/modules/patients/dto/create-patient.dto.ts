import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { gender } from '../types/index.js';
import type { GenderType } from '../types/index.js';

export class CreatePatientDto {
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

  @IsPhoneNumber()
  readonly phoneNumber: string;
}
