import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSpecialty(name: string) {
    try {
      const result = await this.prisma.doctorSpecialty.create({
        data: { name },
      });

      return result;
    } catch (e) {
      return null;
    }
  }

  async create(data: CreateDoctorDto) {
    try {
      const result = await this.prisma.doctor.create({ data });

      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          return false;
        }
      }
    }

    return null;
  }

  async getAll(params: { specialtyId?: number; take: number; skip: number }) {
    const { specialtyId, take, skip } = params;

    const result = await this.prisma.doctor.findMany({
      where: {
        specialtyId,
      },
      orderBy: { id: 'asc' },
      take,
      skip,
      include: {
        specialty: true,
      },
      omit: {
        specialtyId: true,
      },
    });

    const count = await this.prisma.doctor.count({
      where: { specialtyId },
    });

    return { items: result, total: count };
  }

  async getById(id: number) {
    const result = await this.prisma.doctor.findUnique({ where: { id } });

    return result;
  }
}
