import { Injectable } from '@nestjs/common';
import { SlotsRepository } from './slots.repository.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';
import { generateTimeSlots } from '../../common/libs/generate-time-slots.js';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto.js';
import { ServiceError } from '../../common/errors/ServiceError.js';
import { FilteredSlotsDto } from './dto/filtered-slots.dto.js';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace.js';
import { getISODate, getStartOfTheDay } from '../../common/libs/datetime-functions.js';

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

      throw new ServiceError(
        'unknown',
        'Во время обработки данных произошла непредвиденная ошибка, повторите позднее',
      );
    }

    return { ...result, createdAt: new Date() };
  }

  /**
   * @throws { RangeError }
   */
  async getByFilter(data: GetSlotsQueryDto): Promise<{ items: FilteredSlotsDto[]; total: number }> {
    const { from = getISODate(), to = from, doctorId, status } = data;

    const dateNow = getStartOfTheDay();

    const dateFrom =
      new Date(from).getTime() < dateNow.getTime() ? dateNow : new Date(from);
    const dateTo = new Date(to);

    if (dateTo.getTime() < dateFrom.getTime()) {
      throw new RangeError('Временной интервал должен быть от ранней даты к поздней (или даты должны совпадать), а не наоборот');
    }

    const raw = await this.repository.getByFilter(dateFrom, dateTo, doctorId, status);

    const items: Map<number, FilteredSlotsDto> = new Map();

    raw.forEach((item) => {
      const slot = {
        id: item.slot_id,
        status: item.status,
        slotDate: new Date(item.slot_date),
        startTime: new Date(item.start_time),
        endTime: new Date(item.end_time),
        timezone: item.timezone,
      };

      if (!items.has(item.doctor_id)) {
        const doctor: FilteredSlotsDto = {
          id: item.doctor_id,
          lastName: item.last_name,
          firstName: item.first_name,
          patronymic: item.patronymic,
          gender: item.gender,
          price: Decimal(item.price),
          specialty: {
            id: item.specialty_id,
            name: item.specialty,
          },
          slots: [slot],
        };

        items.set(item.doctor_id, doctor);

        return;
      }

      const doctor = items.get(item.doctor_id);
      doctor?.slots.push(slot);
    });

    return { items: [...items.values()], total: items.size };
  }
}
