import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from './doctors.repository.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';

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

  async getAll(params: {
    specialtyId?: number;
    page: number;
    itemsPerPage: number;
  }) {
    const { specialtyId, page, itemsPerPage } = params;

    const { items, total } = await this.repository.getAll({
      specialtyId,
      take: itemsPerPage,
      skip: itemsPerPage * (page - 1),
    });

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / itemsPerPage),
    };
  }

  getById(id: number) {
    return this.repository.getById(id);
  }
}
