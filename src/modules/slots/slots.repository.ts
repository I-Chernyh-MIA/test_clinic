import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { SlotStatus } from '../../generated/prisma/enums.js';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace.js';
import { Prisma } from '../../generated/prisma/client.js';
import { FilteredRawSlotsDto } from './dto/filtered-raw-slots.dto.js';
import { getISODate, getISOTime } from '../../common/libs/datetime-functions.js';

@Injectable()
export class SlotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    doctorId: number,
    slots: { slotDate: Date; startTime: Date; endTime: Date }[],
    timezone: number,
  ) {
    try {
      const result = await this.prisma.slot.createMany({
        data: slots.map((value) => ({
          doctorId,
          ...value,
          timezone,
          status: 'free',
        })),
      });

      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return e.code;
      }

      if (e instanceof Error) {
        throw e;
      }
    }

    return null;
  }

  getById(id: number) {
    return this.prisma.slot.findUnique({ where: { id } });
  }

  async patchSlotStatus(id: number, status: SlotStatus, tx?: TransactionClient) {
    try {
      const update = tx ? tx.slot.update : this.prisma.slot.update;
      const result = await update({ where: { id }, data: { status } });

      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return null;
        }
      }

      return false;
    }
  }

  async getByFilter(dateFrom: Date, dateTo: Date, doctorId?: number, status?: SlotStatus) {
    const conditions: Prisma.Sql[] = [];

    if (doctorId) {
      conditions.push(Prisma.sql`d.id = ${doctorId}`);
    }

    if (status) {
      conditions.push(Prisma.sql`s.status = ${status}`);
    }

    const rawItems = await this.prisma.$queryRaw<FilteredRawSlotsDto[]>`
      SELECT
        d.id as doctor_id,
        d.last_name,
        d.first_name,
        d.patronymic,
        d.gender,
        d.price,
        ds.id as specialty_id,
        ds.name as specialty,
        s.id as slot_id,
        s.slot_date,
        s.start_time,
        s.end_time,
        s.status,
        s.timezone
      FROM
        doctors d,
        doctor_specialties ds,
        slots s
      WHERE
        d.id = s.doctor_id
        AND d.specialty_id = ds.id
        ${conditions.length ? Prisma.sql`AND ${Prisma.join(conditions, ' AND ')}` : Prisma.empty}
        AND s.slot_date BETWEEN ${getISODate(dateFrom)} AND ${getISODate(dateTo)}
        AND (
          s.slot_date > ${getISODate()}
          OR s.start_time >= ADDTIME(${getISOTime()}, MAKETIME(s.timezone * 60 DIV 60, s.timezone * 60 % 60, 0))
        )
      ORDER BY
        d.id,
        s.slot_date,
        s.start_time;
    `;

    return rawItems;
  }
}
