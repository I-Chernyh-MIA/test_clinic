import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { SlotStatus } from '../../generated/prisma/enums.js';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace.js';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto.js';

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

  async getByFilter(data: GetSlotsQueryDto) {
    const { from, to = from, doctorId, status } = data;

    const includeStatus = status === 'all' ? {} : { status };

    const items = await this.prisma.slot.findMany({
      where: {
        ...includeStatus,
        doctorId,
        slotDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      include: {
        doctor: {
          include: {
            specialty: true,
          },
          omit: {
            specialtyId: true,
          },
        },
      },
      omit: {
        doctorId: true,
      },
    });

    return { items, total: items.length };
  }
}
