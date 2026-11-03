import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { SlotStatus } from '../../generated/prisma/enums.js';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace.js';

@Injectable()
export class SlotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    doctorId: number,
    slots: { slotDate: string; startTime: string; endTime: string }[],
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
        if (e.code === 'P2002') {
          return false;
        }
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
}
