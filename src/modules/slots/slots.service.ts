import { Injectable } from '@nestjs/common';
import { SlotsRepository } from './slots.repository.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';
import { generateTimeSlots } from '../../common/libs/generate-time-slots.js';

@Injectable()
export class SlotsService {
  constructor(private readonly repository: SlotsRepository) {}

  /**
   * @throws { RangeError }
   */
  async create(data: CreateSlotsDto) {
    const { doctorId, dateFrom, dateTo = dateFrom, timeFrom = '09:00', timeTo = '21:00' } = data;

    const datetimeFrom = new Date(`${dateFrom} ${timeFrom}`);
    const datetimeTo = new Date(`${dateFrom} ${timeTo}`);

    console.log(datetimeFrom.getHours(), datetimeTo.getHours());

    if (
      datetimeFrom.getHours() < 9 ||
      datetimeTo.getHours() > 21 ||
      (datetimeTo.getHours() >= 21 && datetimeTo.getMinutes() > 0)
    ) {
      throw new RangeError('Указанный промежуток вне рабочего времени с 9:00 до 21:00');
    }

    const { slots, timezoneOffset } = generateTimeSlots(dateFrom, dateTo, timeFrom, timeTo);

    const result = await this.repository.create(doctorId, slots, timezoneOffset);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }
}
