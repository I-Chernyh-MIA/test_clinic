import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class SlotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    doctorId: number,
    slots: { slotDate: Date; startTime: Date; endTime: Date }[],
  ) {
    try {
      const result = await this.prisma.slot.createMany({
        data: slots.map((value) => ({
          doctorId,
          ...value,
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
}
