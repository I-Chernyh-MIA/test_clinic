import { GenderType } from '../types/index.js';

export class CreatedPatientDto {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly patronymic: string | null;
  readonly gender: GenderType;
  readonly phoneNumber: string;
  readonly createdAt: Date;
}
