import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { PatchPatientDto } from './dto/patch-patient.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Метод создаст новый `Patient`.
   * 
   * Если при создании возникла ошибка Unique Constraint, вернёт `false`.
   * 
   * При других ошибках вернёт `null`.
   */
  async create(data: CreatePatientDto) {
    try {
      const result = await this.prisma.patient.create({ data });
      
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

  async getByPhone(phone: string) {
    const result = await this.prisma.patient.findUnique({
      where: { phoneNumber: phone },
    });

    return result;
  }

  async getById(id: number) {
    const result = await this.prisma.patient.findUnique({ where: { id } });

    return result;
  }

  /**
   * Метод обновит и вернёт обновлённый `Patient`.
   * 
   * Если записи для обновления не были найдены, вернёт `null`.
   * 
   * При других ошибках вернёт `false`.
   */
  async patch(id: number, data: PatchPatientDto) {
    try {
      const result = await this.prisma.patient.update({ where: { id }, data });

      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return null;
        }
      }
    }

    return false;
  }
}
