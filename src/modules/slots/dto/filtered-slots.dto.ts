import { Decimal } from '@prisma/client/runtime/client';
import { Gender, SlotStatus } from '../../../generated/prisma/enums.js';

export class FilteredSlotsDto {
  readonly id: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly patronymic: string | null;
  readonly gender: Gender;
  readonly price: Decimal;
  readonly specialty: {
    id: number;
    name: string;
  };
  readonly slots: {
    id: number;
    status: SlotStatus;
    slotDate: Date;
    startTime: Date;
    endTime: Date;
    timezone: number;
  }[];
}
