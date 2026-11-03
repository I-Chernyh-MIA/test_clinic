import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateReceptionDto } from './dto/create-reception.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ReceptionStatus } from '../../generated/prisma/enums.js';
import { SlotsRepository } from '../slots/slots.repository.js';

const basicOptions = {
  include: {
    slot: {
      include: { doctor: true },
      omit: { doctorId: true },
    },
    patient: true,
  },
  omit: { slotId: true, patientId: true },
};

@Injectable()
export class ReceptionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slotsRepository: SlotsRepository,
  ) {}

  async create(data: CreateReceptionDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        this.slotsRepository.patchSlotStatus(data.slotId, 'occupied', tx);

        const reception = await tx.reception.create({
          data: {
            ...data,
            status: 'pending',
            datetimeModified: new Date().toISOString(),
          },
          ...basicOptions,
        });

        return reception;
      });

      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return e.code;
      }
    }

    return null;
  }

  getById(id: number) {
    return this.prisma.reception.findUnique({ where: { id }, ...basicOptions });
  }

  async patchReceptionStatus(id: number, status: ReceptionStatus) {
    try {
      const updatableStatuses: ReceptionStatus[] = ['pending'];

      if (status === 'cancelled') {
        updatableStatuses.push('confirmed');
      }

      const result = await this.prisma.reception.update({
        where: { id, status: { in: updatableStatuses } },
        data: { status, datetimeModified: new Date().toISOString() },
        ...basicOptions,
      });

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

  confirm(id: number) {
    return this.patchReceptionStatus(id, 'confirmed');
  }

  async cancel(id: number) {
    const result = await this.patchReceptionStatus(id, 'cancelled');

    if (result) {
      this.slotsRepository.patchSlotStatus(result.slotId, 'free');
    }

    return result;
  }
}
