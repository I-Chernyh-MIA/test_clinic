import { Injectable } from '@nestjs/common';
import { PatientsRepository } from './patients.repository.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { PatchPatientDto } from './dto/patch-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(private readonly repository: PatientsRepository) {}

  async create(data: CreatePatientDto) {
    const result = await this.repository.create(data);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }

  getByPhone(phone: string) {
    return this.repository.getByPhone(phone);
  }

  getById(id: number) {
    return this.repository.getById(id);
  }

  patch(id: number, data: PatchPatientDto) {
    return this.repository.patch(id, data);
  }
}
