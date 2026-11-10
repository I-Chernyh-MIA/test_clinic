import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from './doctors.repository.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { DoctorsQueryDto } from './dto/doctors-query.dto.js';

@Injectable()
export class DoctorsService {
  constructor(private readonly repository: DoctorsRepository) {}

  async createSpecialty(name: string) {
    const result = await this.repository.createSpecialty(name);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }

  async create(data: CreateDoctorDto) {
    const result = await this.repository.create(data);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }

  async getAll(params: DoctorsQueryDto) {
    const { specialty, fullName, page, itemsPerPage } = params;

    const { items, total } = await this.repository.getAll({
      specialty,
      fullName,
      take: itemsPerPage,
      skip: itemsPerPage * (page - 1),
    });

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / itemsPerPage) || 1,
    };
  }

  getById(id: number) {
    return this.repository.getById(id);
  }
}
