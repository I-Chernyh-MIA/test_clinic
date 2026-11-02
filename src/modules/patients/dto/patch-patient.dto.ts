import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { gender } from '../../../common/types/index.js';
import type { GenderType } from '../../../common/types/index.js';

export class PatchPatientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly patronymic?: string;

  @IsOptional()
  @IsIn(gender)
  readonly gender?: GenderType;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;
}
