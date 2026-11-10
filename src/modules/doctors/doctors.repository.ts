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

  async getAll(params: {
    specialty?: string | number;
    fullName?: string;
    take: number;
    skip: number;
  }) {
    const { specialty, fullName, take, skip } = params;

    const specialtyId = !Number.isNaN(Number(specialty)) && Number(specialty);
    const specialtyStringified = specialty && !specialtyId && String(specialty);

    const specialtyStatement = specialty && {
      specialty: {
        ...((specialtyId && { id: specialtyId }) ||
          (specialtyStringified && { name: { equals: specialtyStringified } })),
      },
    };

    const [lastName, firstName, patronymic] = (fullName ?? '').split(' ', 3);

    const searchStatement = fullName && {
      lastName: {
        search: lastName,
      },
      firstName: {
        search: firstName,
      },
      patronymic: {
        search: patronymic,
      },
    };

    const where = {
      ...specialtyStatement,
      ...searchStatement,
    };

    const result = await this.prisma.doctor.findMany({
      where,
      orderBy: { id: 'asc' },
      take,
      skip,
      include: { specialty: true },
      omit: { specialtyId: true },
    });

    const count = await this.prisma.doctor.count({ where });

    return { items: result, total: count };
  }

  async getById(id: number) {
    const result = await this.prisma.doctor.findUnique({ where: { id } });

    return result;
  }
}
