import { Injectable } from '@nestjs/common';
import { PatientRepository } from './patients.repository.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { CreatedPatientDto } from './dto/created-patient.dto.js';
import { PatchPatientDto } from './dto/patch-patient.dto.js';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async create(data: CreatePatientDto) {
    const result = await this.patientRepository.create(data);

    if (!result) {
      return result;
    }

    return { ...result, createdAt: new Date() } as CreatedPatientDto;
  }

  getByPhone(phone: string) {
    return this.patientRepository.getByPhone(phone);
  }

  getById(id: number) {
    return this.patientRepository.getById(id);
  }

  patch(id: number, data: PatchPatientDto) {
    return this.patientRepository.patch(id, data);
  }
}
