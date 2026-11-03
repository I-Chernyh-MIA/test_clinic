import { Injectable } from '@nestjs/common';
import { SlotsRepository } from './slots.repository.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';
import { generateTimeSlots } from '../../common/libs/generate-time-slots.js';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto.js';
import { ServiceError } from '../../common/errors/ServiceError.js';

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

    if (
      datetimeFrom.getHours() < 9 ||
      datetimeTo.getHours() > 21 ||
      (datetimeTo.getHours() >= 21 && datetimeTo.getMinutes() > 0)
    ) {
      throw new RangeError('Указанный промежуток вне рабочего времени с 9:00 до 21:00');
    }

    const { slots, timezoneOffset } = generateTimeSlots(dateFrom, dateTo, timeFrom, timeTo);

    const result = await this.repository.create(doctorId, slots, timezoneOffset);

    if (result === null) {
      return result;
    } else if (typeof result === 'string') {
      if (result === 'P2002') {
        throw new ServiceError('conflict', 'Слоты в указанном промежутке времени уже существуют');
      } else if (result === 'P2003') {
        throw new ServiceError('not-found', `Доктор с ID: ${doctorId} не был найден`);
      }

      throw new ServiceError('unknown', 'Во время обработки данных произошла непредвиденная ошибка, повторите позднее');
    }

    return { ...result, createdAt: new Date() };
  }

  async getByFilter(data: GetSlotsQueryDto) {
    return this.repository.getByFilter(data);
  }
}
