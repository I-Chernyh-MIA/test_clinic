import { Injectable } from '@nestjs/common';
import { SlotsRepository } from './slots.repository.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';
import { generateTimeSlots } from '../../common/libs/generate-time-slots.js';

@Injectable()
export class SlotsService {
  constructor(private readonly repository: SlotsRepository) {}

  async create(data: CreateSlotsDto) {
    const {
      doctorId,
      dateFrom,
      dateTo = dateFrom,
      timeFrom = '09:00',
      timeTo = '21:00',
    } = data;

    const slots = generateTimeSlots(dateFrom, dateTo, timeFrom, timeTo);

    const result = await this.repository.create(doctorId, slots);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }
}
