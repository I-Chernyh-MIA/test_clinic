import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateReceptionDto } from './dto/create-reception.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ReceptionStatus } from '../../generated/prisma/enums.js';
import { SlotsRepository } from '../slots/slots.repository.js';
import { GetReceptionsQueryDto } from './dto/get-receptions.dto.js';

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
        await this.slotsRepository.patchSlotStatus(data.slotId, 'occupied', tx);

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
      await this.slotsRepository.patchSlotStatus(result.slot.id, 'free');
    }

    return result;
  }

  async getByFilter(data: GetReceptionsQueryDto) {
    const { patientId, from, to = from, status } = data;

    let includeDateFilter = {};

    if (from?.length && to?.length) {
      includeDateFilter = {
        slot: {
          slotDate: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
      };
    }

    const patient = await this.prisma.patient.findUnique({
      where: {
        id: patientId,
        receptions: {
          some: { status, ...includeDateFilter },
        },
      },
      include: {
        receptions: {
          where: {
            status,
            ...includeDateFilter,
          },
          include: {
            slot: {
              include: {
                doctor: {
                  include: { specialty: true },
                  omit: {
                    specialtyId: true,
                  },
                },
              },
              omit: { doctorId: true },
            },
          },
          omit: {
            patientId: true,
            slotId: true,
          },
        },
      },
    });

    return patient;
  }
}
